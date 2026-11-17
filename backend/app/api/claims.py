"""
Claims API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.models.models import User, Claim, Item, Notification, ClaimStatus, NotificationType, ItemStatus
from app.schemas.schemas import ClaimCreate, ClaimOut, ClaimReview
from app.auth.security import get_current_user, require_admin
from datetime import datetime

router = APIRouter(prefix="/claims", tags=["claims"])


def _load_claim(db: Session, claim_id: str) -> Claim:
    claim = (
        db.query(Claim)
        .options(
            joinedload(Claim.item).joinedload(Item.reporter),
            joinedload(Claim.item).joinedload(Item.category),
            joinedload(Claim.item).joinedload(Item.location),
            joinedload(Claim.claimant),
        )
        .filter(Claim.id == claim_id)
        .first()
    )
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.post("", response_model=ClaimOut, status_code=201)
def submit_claim(
    body: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(Item).filter(Item.id == body.item_id, Item.is_deleted == False).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.item_type.value != "found":
        raise HTTPException(status_code=400, detail="You can only claim found items")
    if item.reporter_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot claim your own report")

    # Check for existing claim
    existing = db.query(Claim).filter(
        Claim.item_id == body.item_id,
        Claim.claimant_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="You already submitted a claim for this item")

    claim = Claim(
        item_id=body.item_id,
        claimant_id=current_user.id,
        ownership_proof=body.ownership_proof,
        identifying_info=body.identifying_info,
        additional_notes=body.additional_notes,
    )
    db.add(claim)

    # Notify item reporter
    notif = Notification(
        user_id=item.reporter_id,
        notification_type=NotificationType.claim,
        title="Someone claimed your found item",
        message=f"A claim was submitted for: {item.title}",
        related_item_id=item.id,
    )
    db.add(notif)

    db.commit()
    db.refresh(claim)
    return _load_claim(db, claim.id)


@router.get("/my", response_model=list[ClaimOut])
def my_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    claims = (
        db.query(Claim)
        .options(
            joinedload(Claim.item).joinedload(Item.reporter),
            joinedload(Claim.item).joinedload(Item.category),
            joinedload(Claim.item).joinedload(Item.location),
            joinedload(Claim.claimant),
        )
        .filter(Claim.claimant_id == current_user.id)
        .order_by(Claim.created_at.desc())
        .all()
    )
    return claims


@router.get("", response_model=list[ClaimOut])
def all_claims(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    status: ClaimStatus = None,
):
    q = (
        db.query(Claim)
        .options(
            joinedload(Claim.item).joinedload(Item.reporter),
            joinedload(Claim.item).joinedload(Item.category),
            joinedload(Claim.item).joinedload(Item.location),
            joinedload(Claim.claimant),
        )
    )
    if status:
        q = q.filter(Claim.status == status)
    return q.order_by(Claim.created_at.desc()).all()


@router.patch("/{claim_id}/review", response_model=ClaimOut)
def review_claim(
    claim_id: str,
    body: ClaimReview,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    claim = _load_claim(db, claim_id)
    claim.status = body.status
    claim.admin_notes = body.admin_notes
    claim.reviewed_by = admin.id
    claim.reviewed_at = datetime.utcnow()

    if body.status == ClaimStatus.approved:
        claim.item.status = ItemStatus.claimed
        # Notify claimant
        notif = Notification(
            user_id=claim.claimant_id,
            notification_type=NotificationType.claim,
            title="Your claim was approved!",
            message=f"Your claim for {claim.item.title} has been approved.",
            related_item_id=claim.item_id,
        )
        db.add(notif)

    db.commit()
    return _load_claim(db, claim_id)
