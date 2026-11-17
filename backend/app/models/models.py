"""
CampusFind SQLAlchemy Models
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Float, Integer,
    ForeignKey, DateTime, Enum as SAEnum, JSON
)
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum


def gen_uuid():
    return str(uuid.uuid4())


# ─── Enums ────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    student = "student"
    admin = "admin"
    moderator = "moderator"


class ItemType(str, enum.Enum):
    lost = "lost"
    found = "found"


class ItemStatus(str, enum.Enum):
    active = "active"
    matched = "matched"
    claimed = "claimed"
    recovered = "recovered"
    archived = "archived"


class ClaimStatus(str, enum.Enum):
    pending = "pending"
    under_review = "under_review"
    approved = "approved"
    rejected = "rejected"


class MatchStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    dismissed = "dismissed"


class NotificationType(str, enum.Enum):
    match = "match"
    claim = "claim"
    verification = "verification"
    recovery = "recovery"
    system = "system"


class ReportVerification(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"
    flagged = "flagged"


# ─── Models ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    student_id = Column(String(50), unique=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.student, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("Item", back_populates="reporter", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    claims = relationship("Claim", foreign_keys="Claim.claimant_id", back_populates="claimant", cascade="all, delete-orphan")



class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), nullable=True)  # Lucide icon name
    color = Column(String(20), nullable=True)  # Hex color
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="category")


class Location(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    building = Column(String(100), nullable=True)
    area = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    items = relationship("Item", back_populates="location")


class Item(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String(200), nullable=False)
    item_type = Column(SAEnum(ItemType), nullable=False)
    status = Column(SAEnum(ItemStatus), default=ItemStatus.active, nullable=False)
    verification = Column(SAEnum(ReportVerification), default=ReportVerification.pending)

    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=True)
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False)

    brand = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    date_occurred = Column(DateTime, nullable=False)
    time_approximate = Column(String(50), nullable=True)  # e.g. "morning", "2pm-4pm"

    images = Column(JSON, default=list)  # list of image URLs
    is_deleted = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("User", back_populates="items")
    category = relationship("Category", back_populates="items")
    location = relationship("Location", back_populates="items")
    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")

    # Matches where this item is the lost item
    lost_matches = relationship(
        "Match",
        foreign_keys="Match.lost_item_id",
        back_populates="lost_item",
        cascade="all, delete-orphan"
    )
    # Matches where this item is the found item
    found_matches = relationship(
        "Match",
        foreign_keys="Match.found_item_id",
        back_populates="found_item",
        cascade="all, delete-orphan"
    )


class Match(Base):
    __tablename__ = "matches"

    id = Column(String, primary_key=True, default=gen_uuid)
    lost_item_id = Column(String, ForeignKey("items.id"), nullable=False)
    found_item_id = Column(String, ForeignKey("items.id"), nullable=False)

    score = Column(Float, nullable=False)  # 0.0 – 1.0
    confidence_level = Column(String(20), nullable=False)  # "low", "medium", "high", "strong"
    match_reasons = Column(JSON, default=list)  # list of reason strings

    status = Column(SAEnum(MatchStatus), default=MatchStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lost_item = relationship("Item", foreign_keys=[lost_item_id], back_populates="lost_matches")
    found_item = relationship("Item", foreign_keys=[found_item_id], back_populates="found_matches")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, default=gen_uuid)
    item_id = Column(String, ForeignKey("items.id"), nullable=False)
    claimant_id = Column(String, ForeignKey("users.id"), nullable=False)

    ownership_proof = Column(Text, nullable=False)  # Description of proof
    identifying_info = Column(Text, nullable=True)  # Unique identifiers
    additional_notes = Column(Text, nullable=True)
    status = Column(SAEnum(ClaimStatus), default=ClaimStatus.pending)

    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(String, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    item = relationship("Item", back_populates="claims")
    claimant = relationship("User", foreign_keys=[claimant_id], back_populates="claims")
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    notification_type = Column(SAEnum(NotificationType), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    related_item_id = Column(String, ForeignKey("items.id"), nullable=True)
    related_match_id = Column(String, ForeignKey("matches.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AdminAction(Base):
    __tablename__ = "admin_actions"

    id = Column(String, primary_key=True, default=gen_uuid)
    admin_id = Column(String, ForeignKey("users.id"), nullable=False)
    action_type = Column(String(100), nullable=False)
    target_id = Column(String, nullable=True)
    target_type = Column(String(50), nullable=True)  # "item", "user", "claim"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    admin = relationship("User", foreign_keys=[admin_id])
