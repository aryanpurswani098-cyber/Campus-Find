"""
Item Service — Business logic for creating, querying, and managing items
"""
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from typing import Optional, List
from datetime import datetime
from app.models.models import Item, Match, Notification, ItemType, ItemStatus, NotificationType
from app.schemas.schemas import ItemCreate, ItemUpdate
from app.matching.engine import find_matches_for_item


def get_item(db: Session, item_id: str) -> Optional[Item]:
    return (
        db.query(Item)
        .options(
            joinedload(Item.reporter),
            joinedload(Item.category),
            joinedload(Item.location),
        )
        .filter(Item.id == item_id, Item.is_deleted == False)
        .first()
    )


def list_items(
    db: Session,
    item_type: Optional[ItemType] = None,
    category_id: Optional[str] = None,
    location_id: Optional[str] = None,
    status: Optional[ItemStatus] = None,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    reporter_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
):
    q = (
        db.query(Item)
        .options(
            joinedload(Item.reporter),
            joinedload(Item.category),
            joinedload(Item.location),
        )
        .filter(Item.is_deleted == False)
    )

    if item_type:
        q = q.filter(Item.item_type == item_type)
    if category_id:
        q = q.filter(Item.category_id == category_id)
    if location_id:
        q = q.filter(Item.location_id == location_id)
    if status:
        q = q.filter(Item.status == status)
    if reporter_id:
        q = q.filter(Item.reporter_id == reporter_id)
    if search:
        like = f"%{search}%"
        q = q.filter(
            or_(
                Item.title.ilike(like),
                Item.description.ilike(like),
                Item.brand.ilike(like),
                Item.color.ilike(like),
            )
        )
    if date_from:
        q = q.filter(Item.date_occurred >= date_from)
    if date_to:
        q = q.filter(Item.date_occurred <= date_to)

    total = q.count()
    items = q.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()
    return items, total


def create_item(db: Session, data: ItemCreate, reporter_id: str) -> Item:
    item = Item(
        title=data.title,
        item_type=data.item_type,
        category_id=data.category_id,
        location_id=data.location_id,
        brand=data.brand,
        color=data.color,
        description=data.description,
        date_occurred=data.date_occurred,
        time_approximate=data.time_approximate,
        images=data.images or [],
        reporter_id=reporter_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Run matching engine after creation
    _run_matching(db, item)

    return item


def update_item(db: Session, item: Item, data: ItemUpdate) -> Item:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: Item) -> None:
    item.is_deleted = True
    item.updated_at = datetime.utcnow()
    db.commit()


def mark_recovered(db: Session, item: Item) -> Item:
    item.status = ItemStatus.recovered
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def _run_matching(db: Session, new_item: Item) -> None:
    """Run matching engine and persist matches for a newly created item."""
    opposite_type = ItemType.found if new_item.item_type == ItemType.lost else ItemType.lost
    candidates = (
        db.query(Item)
        .options(joinedload(Item.category), joinedload(Item.location))
        .filter(
            Item.item_type == opposite_type,
            Item.status == ItemStatus.active,
            Item.is_deleted == False,
        )
        .all()
    )

    matches = find_matches_for_item(new_item, candidates)
    for m in matches[:10]:  # Cap at top 10 matches
        # Check if match already exists
        existing = db.query(Match).filter(
            Match.lost_item_id == m["lost_item"].id,
            Match.found_item_id == m["found_item"].id,
        ).first()
        if existing:
            continue

        match = Match(
            lost_item_id=m["lost_item"].id,
            found_item_id=m["found_item"].id,
            score=m["score"],
            confidence_level=m["confidence_level"],
            match_reasons=m["match_reasons"],
        )
        db.add(match)

        # Notify the reporter of the lost item
        lost_reporter_id = m["lost_item"].reporter_id
        notif = Notification(
            user_id=lost_reporter_id,
            notification_type=NotificationType.match,
            title="Potential match found!",
            message=f"A potential match was found for your item: {m['lost_item'].title}",
            related_item_id=m["lost_item"].id,
            related_match_id=None,  # will update after flush
        )
        db.add(notif)

    db.commit()
