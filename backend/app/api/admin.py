"""
Admin API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import (
    User, Item, Match, Claim, Notification, AdminAction,
    ItemStatus, ReportVerification, NotificationType
)
from app.schemas.schemas import AdminStats, ItemVerifyRequest, ItemOut, UserOut
from app.auth.security import get_current_user, require_admin
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total_items = db.query(Item).filter(Item.is_deleted == False).count()
    lost_items = db.query(Item).filter(Item.item_type == "lost", Item.is_deleted == False).count()
    found_items = db.query(Item).filter(Item.item_type == "found", Item.is_deleted == False).count()
    recovered_items = db.query(Item).filter(Item.status == "recovered", Item.is_deleted == False).count()
    pending_reports = db.query(Item).filter(
        Item.verification == "pending", Item.is_deleted == False
    ).count()
    pending_claims = db.query(Claim).filter(Claim.status == "pending").count()
    active_users = db.query(User).filter(User.is_active == True).count()
    recovery_rate = round(recovered_items / max(total_items, 1) * 100, 1)

    return AdminStats(
        total_items=total_items,
        lost_items=lost_items,
        found_items=found_items,
        recovered_items=recovered_items,
        pending_reports=pending_reports,
        pending_claims=pending_claims,
        active_users=active_users,
        recovery_rate=recovery_rate,
    )


@router.get("/items", response_model=list[ItemOut])
def admin_list_items(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    verification: str = None,
    skip: int = 0,
    limit: int = 50,
):
    from sqlalchemy.orm import joinedload
    q = (
        db.query(Item)
        .options(
            joinedload(Item.reporter),
            joinedload(Item.category),
            joinedload(Item.location),
        )
        .filter(Item.is_deleted == False)
    )
    if verification:
        q = q.filter(Item.verification == verification)
    items = q.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for item in items:
        d = ItemOut.model_validate(item)
        d.match_count = len(item.lost_matches) + len(item.found_matches)
        result.append(d)
    return result


@router.patch("/items/{item_id}/verify")
def verify_item(
    item_id: str,
    body: ItemVerifyRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.verification = body.verification
    item.updated_at = datetime.utcnow()

    # Log admin action
    action = AdminAction(
        admin_id=admin.id,
        action_type=f"verify_item_{body.verification}",
        target_id=item_id,
        target_type="item",
        notes=body.notes,
    )
    db.add(action)

    # Notify reporter
    if body.verification == "verified":
        notif = Notification(
            user_id=item.reporter_id,
            notification_type=NotificationType.verification,
            title="Your report has been verified",
            message=f"Your report for '{item.title}' has been verified by an admin.",
            related_item_id=item_id,
        )
        db.add(notif)

    db.commit()
    return {"message": f"Item {body.verification}"}


@router.delete("/items/{item_id}")
def admin_delete_item(
    item_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.is_deleted = True
    action = AdminAction(
        admin_id=admin.id,
        action_type="delete_item",
        target_id=item_id,
        target_type="item",
    )
    db.add(action)
    db.commit()
    return {"message": "Item removed"}


@router.get("/users", response_model=list[UserOut])
def admin_list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    skip: int = 0,
    limit: int = 50,
):
    return db.query(User).offset(skip).limit(limit).all()


@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Return analytics data for charts."""
    from sqlalchemy import func
    from app.models.models import Category

    # Most common categories
    cat_data = (
        db.query(Category.name, func.count(Item.id).label("count"))
        .join(Item, Item.category_id == Category.id)
        .filter(Item.is_deleted == False)
        .group_by(Category.name)
        .order_by(func.count(Item.id).desc())
        .limit(6)
        .all()
    )

    # Items by status
    status_data = (
        db.query(Item.status, func.count(Item.id).label("count"))
        .filter(Item.is_deleted == False)
        .group_by(Item.status)
        .all()
    )

    return {
        "top_categories": [{"name": r[0], "count": r[1]} for r in cat_data],
        "status_breakdown": [{"status": r[0], "count": r[1]} for r in status_data],
    }
