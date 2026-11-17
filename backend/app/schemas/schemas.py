"""
Pydantic Schemas for CampusFind API
"""
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import List, Optional, Any
from datetime import datetime
from app.models.models import UserRole, ItemType, ItemStatus, ClaimStatus, MatchStatus, NotificationType, ReportVerification


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    student_id: Optional[str] = None
    password: str
    confirm_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if len(self.password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ─── User ─────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    student_id: Optional[str]
    role: UserRole
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    student_id: Optional[str] = None
    avatar_url: Optional[str] = None


# ─── Category ─────────────────────────────────────────────────────────────────

class CategoryOut(BaseModel):
    id: str
    name: str
    icon: Optional[str]
    color: Optional[str]

    class Config:
        from_attributes = True


# ─── Location ─────────────────────────────────────────────────────────────────

class LocationOut(BaseModel):
    id: str
    name: str
    building: Optional[str]
    area: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True


# ─── Item ─────────────────────────────────────────────────────────────────────

class ItemCreate(BaseModel):
    title: str
    item_type: ItemType
    category_id: Optional[str] = None
    location_id: Optional[str] = None
    brand: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    date_occurred: datetime
    time_approximate: Optional[str] = None
    images: Optional[List[str]] = []


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[str] = None
    location_id: Optional[str] = None
    brand: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    date_occurred: Optional[datetime] = None
    time_approximate: Optional[str] = None
    status: Optional[ItemStatus] = None
    images: Optional[List[str]] = None


class ItemOut(BaseModel):
    id: str
    title: str
    item_type: ItemType
    status: ItemStatus
    verification: ReportVerification
    brand: Optional[str]
    color: Optional[str]
    description: Optional[str]
    date_occurred: datetime
    time_approximate: Optional[str]
    images: List[str]
    created_at: datetime
    updated_at: datetime
    reporter: UserOut
    category: Optional[CategoryOut]
    location: Optional[LocationOut]
    match_count: int = 0

    class Config:
        from_attributes = True


class ItemListOut(BaseModel):
    items: List[ItemOut]
    total: int
    page: int
    per_page: int
    has_next: bool


# ─── Match ────────────────────────────────────────────────────────────────────

class MatchOut(BaseModel):
    id: str
    lost_item: ItemOut
    found_item: ItemOut
    score: float
    confidence_level: str
    match_reasons: List[str]
    status: MatchStatus
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Claim ────────────────────────────────────────────────────────────────────

class ClaimCreate(BaseModel):
    item_id: str
    ownership_proof: str
    identifying_info: Optional[str] = None
    additional_notes: Optional[str] = None


class ClaimOut(BaseModel):
    id: str
    item: ItemOut
    claimant: UserOut
    ownership_proof: str
    identifying_info: Optional[str]
    additional_notes: Optional[str]
    status: ClaimStatus
    admin_notes: Optional[str]
    reviewed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class ClaimReview(BaseModel):
    status: ClaimStatus
    admin_notes: Optional[str] = None


# ─── Notification ─────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: str
    notification_type: NotificationType
    title: str
    message: str
    is_read: bool
    related_item_id: Optional[str]
    related_match_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Admin ────────────────────────────────────────────────────────────────────

class AdminStats(BaseModel):
    total_items: int
    lost_items: int
    found_items: int
    recovered_items: int
    pending_reports: int
    pending_claims: int
    active_users: int
    recovery_rate: float


class ItemVerifyRequest(BaseModel):
    verification: ReportVerification
    notes: Optional[str] = None
