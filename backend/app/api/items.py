"""
Items API Routes
"""
import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database.database import get_db
from app.models.models import User, Item, Category, Location, ItemType, ItemStatus
from app.schemas.schemas import ItemCreate, ItemUpdate, ItemOut, ItemListOut, CategoryOut, LocationOut
from app.auth.security import get_current_user
from app.services.item_service import (
    get_item, list_items, create_item, update_item, delete_item, mark_recovered
)
from app.config import settings

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/locations", response_model=list[LocationOut])
def get_locations(db: Session = Depends(get_db)):
    return db.query(Location).all()


@router.get("", response_model=ItemListOut)
def browse_items(
    db: Session = Depends(get_db),
    item_type: Optional[ItemType] = None,
    category_id: Optional[str] = None,
    location_id: Optional[str] = None,
    status: Optional[ItemStatus] = None,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    skip = (page - 1) * per_page
    items, total = list_items(
        db, item_type, category_id, location_id, status,
        search, date_from, date_to, skip=skip, limit=per_page
    )

    items_out = []
    for item in items:
        match_count = len(item.lost_matches) + len(item.found_matches)
        d = ItemOut.model_validate(item)
        d.match_count = match_count
        items_out.append(d)

    return ItemListOut(
        items=items_out,
        total=total,
        page=page,
        per_page=per_page,
        has_next=(skip + per_page) < total,
    )


@router.get("/my", response_model=list[ItemOut])
def my_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    item_type: Optional[ItemType] = None,
    status: Optional[ItemStatus] = None,
):
    items, _ = list_items(
        db, item_type=item_type, status=status, reporter_id=current_user.id,
        skip=0, limit=200
    )
    result = []
    for item in items:
        match_count = len(item.lost_matches) + len(item.found_matches)
        d = ItemOut.model_validate(item)
        d.match_count = match_count
        result.append(d)
    return result


@router.get("/{item_id}", response_model=ItemOut)
def get_item_detail(item_id: str, db: Session = Depends(get_db)):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    match_count = len(item.lost_matches) + len(item.found_matches)
    d = ItemOut.model_validate(item)
    d.match_count = match_count
    return d


@router.post("", response_model=ItemOut, status_code=201)
def report_item(
    body: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = create_item(db, body, current_user.id)
    d = ItemOut.model_validate(item)
    d.match_count = 0
    return d


@router.put("/{item_id}", response_model=ItemOut)
def edit_item(
    item_id: str,
    body: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.reporter_id != current_user.id and current_user.role == "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    item = update_item(db, item, body)
    d = ItemOut.model_validate(item)
    d.match_count = len(item.lost_matches) + len(item.found_matches)
    return d


@router.delete("/{item_id}", status_code=204)
def remove_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.reporter_id != current_user.id and current_user.role == "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    delete_item(db, item)


@router.patch("/{item_id}/recovered", response_model=ItemOut)
def item_recovered(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.reporter_id != current_user.id and current_user.role == "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    item = mark_recovered(db, item)
    d = ItemOut.model_validate(item)
    d.match_count = len(item.lost_matches) + len(item.found_matches)
    return d


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload an item image and return its URL."""
    content_type = file.content_type
    if content_type not in settings.allowed_image_types_list:
        raise HTTPException(status_code=400, detail="Invalid image type")

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail="Image too large")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    return {"url": f"/uploads/{filename}"}
