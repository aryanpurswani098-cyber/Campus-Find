"""
Matches API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.database.database import get_db
from app.models.models import User, Match, Item, MatchStatus
from app.schemas.schemas import MatchOut
from app.auth.security import get_current_user

router = APIRouter(prefix="/matches", tags=["matches"])


def _enrich_match(match: Match) -> MatchOut:
    from app.schemas.schemas import ItemOut
    lost = ItemOut.model_validate(match.lost_item)
    lost.match_count = len(match.lost_item.lost_matches) + len(match.lost_item.found_matches)
    found = ItemOut.model_validate(match.found_item)
    found.match_count = len(match.found_item.lost_matches) + len(match.found_item.found_matches)
    return MatchOut(
        id=match.id,
        lost_item=lost,
        found_item=found,
        score=match.score,
        confidence_level=match.confidence_level,
        match_reasons=match.match_reasons,
        status=match.status,
        created_at=match.created_at,
    )


@router.get("", response_model=list[MatchOut])
def list_my_matches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status: Optional[MatchStatus] = None,
):
    """Get all matches involving the current user's items."""
    # Get user's item IDs
    user_item_ids = [item.id for item in current_user.items if not item.is_deleted]

    q = (
        db.query(Match)
        .options(
            joinedload(Match.lost_item).joinedload(Item.reporter),
            joinedload(Match.lost_item).joinedload(Item.category),
            joinedload(Match.lost_item).joinedload(Item.location),
            joinedload(Match.found_item).joinedload(Item.reporter),
            joinedload(Match.found_item).joinedload(Item.category),
            joinedload(Match.found_item).joinedload(Item.location),
        )
        .filter(
            (Match.lost_item_id.in_(user_item_ids)) |
            (Match.found_item_id.in_(user_item_ids))
        )
    )
    if status:
        q = q.filter(Match.status == status)

    matches = q.order_by(Match.score.desc()).all()
    return [_enrich_match(m) for m in matches]


@router.get("/item/{item_id}", response_model=list[MatchOut])
def matches_for_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all matches for a specific item."""
    item = db.query(Item).filter(Item.id == item_id, Item.is_deleted == False).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.reporter_id != current_user.id and current_user.role == "student":
        raise HTTPException(status_code=403, detail="Not authorized")

    matches = (
        db.query(Match)
        .options(
            joinedload(Match.lost_item).joinedload(Item.reporter),
            joinedload(Match.lost_item).joinedload(Item.category),
            joinedload(Match.lost_item).joinedload(Item.location),
            joinedload(Match.found_item).joinedload(Item.reporter),
            joinedload(Match.found_item).joinedload(Item.category),
            joinedload(Match.found_item).joinedload(Item.location),
        )
        .filter(
            (Match.lost_item_id == item_id) | (Match.found_item_id == item_id)
        )
        .order_by(Match.score.desc())
        .all()
    )
    return [_enrich_match(m) for m in matches]


@router.patch("/{match_id}/dismiss")
def dismiss_match(
    match_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    match.status = MatchStatus.dismissed
    db.commit()
    return {"message": "Match dismissed"}


@router.patch("/{match_id}/confirm")
def confirm_match(
    match_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    match.status = MatchStatus.confirmed
    db.commit()
    return {"message": "Match confirmed"}
