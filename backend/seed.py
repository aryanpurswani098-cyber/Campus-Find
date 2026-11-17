"""
Seed script — creates realistic development data for CampusFind.
Run from backend/ directory: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
import random
from app.database.database import SessionLocal, engine
from app.models.models import Base, User, Category, Location, Item, Match, Notification
from app.models.models import UserRole, ItemType, ItemStatus, NotificationType, ReportVerification
from app.auth.security import hash_password
from app.matching.engine import compute_match

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("[*] Seeding CampusFind database...")


# ─── Categories ───────────────────────────────────────────────────────────────
categories_data = [
    {"name": "Electronics", "icon": "Smartphone", "color": "#3B82F6"},
    {"name": "Bags", "icon": "Briefcase", "color": "#8B5CF6"},
    {"name": "Books", "icon": "BookOpen", "color": "#F59E0B"},
    {"name": "Clothing", "icon": "Shirt", "color": "#EC4899"},
    {"name": "Accessories", "icon": "Watch", "color": "#06B6D4"},
    {"name": "ID & Cards", "icon": "CreditCard", "color": "#EF4444"},
    {"name": "Sports", "icon": "Dumbbell", "color": "#22C55E"},
    {"name": "Others", "icon": "Package", "color": "#6B7280"},
]

categories = {}
for c in categories_data:
    existing = db.query(Category).filter(Category.name == c["name"]).first()
    if not existing:
        obj = Category(**c)
        db.add(obj)
        db.flush()
        categories[c["name"]] = obj
    else:
        categories[c["name"]] = existing

# ─── Locations ────────────────────────────────────────────────────────────────
locations_data = [
    {"name": "Central Library", "building": "Library", "area": "Main Hall", "latitude": 28.6315, "longitude": 77.2167},
    {"name": "A Block", "building": "Academic Block A", "area": "Ground Floor", "latitude": 28.6320, "longitude": 77.2170},
    {"name": "B Block", "building": "Academic Block B", "area": "First Floor", "latitude": 28.6325, "longitude": 77.2175},
    {"name": "Cafeteria", "building": "Student Center", "area": "Main Cafeteria", "latitude": 28.6310, "longitude": 77.2160},
    {"name": "Sports Ground", "building": "Sports Complex", "area": "Ground", "latitude": 28.6330, "longitude": 77.2180},
    {"name": "Hostel Block", "building": "Residence", "area": "Common Room", "latitude": 28.6300, "longitude": 77.2155},
    {"name": "Admin Block", "building": "Administration", "area": "Reception", "latitude": 28.6308, "longitude": 77.2162},
    {"name": "Auditorium", "building": "Main Auditorium", "area": "Lobby", "latitude": 28.6318, "longitude": 77.2173},
]

locations = {}
for l in locations_data:
    existing = db.query(Location).filter(Location.name == l["name"]).first()
    if not existing:
        obj = Location(**l)
        db.add(obj)
        db.flush()
        locations[l["name"]] = obj
    else:
        locations[l["name"]] = existing

# ─── Users ────────────────────────────────────────────────────────────────────
users_data = [
    {"name": "Aryan Purswani", "email": "aryan@college.edu", "student_id": "STU001", "role": UserRole.student},
    {"name": "Priya Sharma", "email": "priya@college.edu", "student_id": "STU002", "role": UserRole.student},
    {"name": "Rahul Mehta", "email": "rahul@college.edu", "student_id": "STU003", "role": UserRole.student},
    {"name": "Sneha Gupta", "email": "sneha@college.edu", "student_id": "STU004", "role": UserRole.student},
    {"name": "Admin", "email": "admin@college.edu", "student_id": None, "role": UserRole.admin},
]

users = {}
for u in users_data:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if not existing:
        obj = User(
            name=u["name"],
            email=u["email"],
            student_id=u["student_id"],
            hashed_password=hash_password("Password123!"),
            role=u["role"],
        )
        db.add(obj)
        db.flush()
        users[u["email"]] = obj
    else:
        users[u["email"]] = existing

# ─── Items ────────────────────────────────────────────────────────────────────
now = datetime.utcnow()

items_data = [
    # Lost items
    {
        "title": "Black Headphones",
        "item_type": ItemType.lost,
        "category": "Electronics",
        "location": "Central Library",
        "reporter_email": "aryan@college.edu",
        "brand": "Sony",
        "color": "Black",
        "description": "Sony WH-1000XM4 wireless headphones, black color. Last seen near the library reading area.",
        "date_occurred": now - timedelta(days=2),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    },
    {
        "title": "iPhone 14",
        "item_type": ItemType.lost,
        "category": "Electronics",
        "location": "A Block",
        "reporter_email": "priya@college.edu",
        "brand": "Apple",
        "color": "Space Gray",
        "description": "iPhone 14, space gray, in a clear case with a flower sticker on the back.",
        "date_occurred": now - timedelta(days=1),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"],
    },
    {
        "title": "Blue Backpack",
        "item_type": ItemType.lost,
        "category": "Bags",
        "location": "Cafeteria",
        "reporter_email": "rahul@college.edu",
        "brand": "Wildcraft",
        "color": "Blue",
        "description": "Blue Wildcraft backpack with laptop compartment. Has a keychain on the zipper.",
        "date_occurred": now - timedelta(days=3),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
    },
    {
        "title": "Water Bottle",
        "item_type": ItemType.lost,
        "category": "Others",
        "location": "Sports Ground",
        "reporter_email": "sneha@college.edu",
        "brand": "Milton",
        "color": "Green",
        "description": "Green Milton insulated water bottle, 1 litre, with a dent on the side.",
        "date_occurred": now - timedelta(days=4),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
    },
    {
        "title": "Laptop (MacBook Air)",
        "item_type": ItemType.lost,
        "category": "Electronics",
        "location": "Central Library",
        "reporter_email": "aryan@college.edu",
        "brand": "Apple",
        "color": "Silver",
        "description": "MacBook Air M2, silver, with a UniKitty sticker on the lid. Has a cracked corner.",
        "date_occurred": now - timedelta(days=5),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    },
    {
        "title": "Wallet",
        "item_type": ItemType.lost,
        "category": "Accessories",
        "location": "B Block",
        "reporter_email": "priya@college.edu",
        "brand": None,
        "color": "Brown",
        "description": "Brown leather bifold wallet. Contains student ID and some cash.",
        "date_occurred": now - timedelta(days=5),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"],
    },
    # Found items
    {
        "title": "Found Headphones",
        "item_type": ItemType.found,
        "category": "Electronics",
        "location": "Central Library",
        "reporter_email": "priya@college.edu",
        "brand": "Sony",
        "color": "Black",
        "description": "Found a pair of black over-ear wireless headphones near the reading section.",
        "date_occurred": now - timedelta(days=1),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    },
    {
        "title": "Found Laptop",
        "item_type": ItemType.found,
        "category": "Electronics",
        "location": "Central Library",
        "reporter_email": "rahul@college.edu",
        "brand": "Apple",
        "color": "Silver",
        "description": "Found a MacBook near the library entrance. Has stickers on the lid.",
        "date_occurred": now - timedelta(days=3),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    },
    {
        "title": "Found Water Bottle",
        "item_type": ItemType.found,
        "category": "Others",
        "location": "Sports Ground",
        "reporter_email": "sneha@college.edu",
        "brand": "Milton",
        "color": "Green",
        "description": "Found a green water bottle near the football field.",
        "date_occurred": now - timedelta(days=4),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
    },
    {
        "title": "Found Wallet",
        "item_type": ItemType.found,
        "category": "Accessories",
        "location": "Cafeteria",
        "reporter_email": "aryan@college.edu",
        "brand": None,
        "color": "Brown",
        "description": "Found a brown leather wallet near the cafeteria checkout.",
        "date_occurred": now - timedelta(days=5),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80"],
    },
    {
        "title": "Found Student ID Card",
        "item_type": ItemType.found,
        "category": "ID & Cards",
        "location": "A Block",
        "reporter_email": "priya@college.edu",
        "brand": None,
        "color": "White",
        "description": "Found a student ID card. Name on card: Rahul M.",
        "date_occurred": now - timedelta(days=2),
        "status": ItemStatus.active,
        "verification": ReportVerification.verified,
        "images": ["https://images.unsplash.com/photo-1589332824982-f47285a7bd78?w=800&q=80"],
    },
    {
        "title": "Found Calculator",
        "item_type": ItemType.found,
        "category": "Electronics",
        "location": "B Block",
        "reporter_email": "sneha@college.edu",
        "brand": "Casio",
        "color": "Black",
        "description": "Found a Casio scientific calculator in classroom B204.",
        "date_occurred": now - timedelta(days=1),
        "status": ItemStatus.active,
        "verification": ReportVerification.pending,
        "images": ["https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&q=80"],
    },
]

created_items = []
for item_data in items_data:
    reporter = users[item_data["reporter_email"]]
    category = categories.get(item_data["category"])
    location = locations.get(item_data["location"])

    existing = db.query(Item).filter(
        Item.title == item_data["title"],
        Item.reporter_id == reporter.id
    ).first()
    if existing:
        created_items.append(existing)
        continue

    item = Item(
        title=item_data["title"],
        item_type=item_data["item_type"],
        category_id=category.id if category else None,
        location_id=location.id if location else None,
        reporter_id=reporter.id,
        brand=item_data.get("brand"),
        color=item_data.get("color"),
        description=item_data.get("description"),
        date_occurred=item_data["date_occurred"],
        status=item_data["status"],
        verification=item_data["verification"],
        images=item_data.get("images", []),
    )
    db.add(item)
    db.flush()
    created_items.append(item)

db.commit()

# ─── Run matching engine ───────────────────────────────────────────────────────
from app.matching.engine import find_matches_for_item

all_items = db.query(Item).all()
lost_items = [i for i in all_items if i.item_type == ItemType.lost]
found_items = [i for i in all_items if i.item_type == ItemType.found]

match_count = 0
for lost in lost_items:
    results = find_matches_for_item(lost, found_items)
    for r in results[:3]:
        existing = db.query(Match).filter(
            Match.lost_item_id == r["lost_item"].id,
            Match.found_item_id == r["found_item"].id,
        ).first()
        if existing:
            continue
        match = Match(
            lost_item_id=r["lost_item"].id,
            found_item_id=r["found_item"].id,
            score=r["score"],
            confidence_level=r["confidence_level"],
            match_reasons=r["match_reasons"],
        )
        db.add(match)
        match_count += 1

db.commit()
print(f"  [OK] Created {match_count} matches")


# ─── Notifications ────────────────────────────────────────────────────────────
notif_data = [
    {
        "user_email": "aryan@college.edu",
        "type": NotificationType.match,
        "title": "Potential match found!",
        "message": "Your lost Black Headphones may have been found at Central Library.",
    },
    {
        "user_email": "aryan@college.edu",
        "type": NotificationType.verification,
        "title": "Report verified",
        "message": "Your report for MacBook Air has been verified by an admin.",
    },
    {
        "user_email": "priya@college.edu",
        "type": NotificationType.match,
        "title": "Potential match found!",
        "message": "A potential match was found for your lost iPhone 14.",
    },
]

for n in notif_data:
    user = users[n["user_email"]]
    existing = db.query(Notification).filter(
        Notification.user_id == user.id,
        Notification.title == n["title"]
    ).first()
    if not existing:
        notif = Notification(
            user_id=user.id,
            notification_type=n["type"],
            title=n["title"],
            message=n["message"],
        )
        db.add(notif)

db.commit()
db.close()

print("[DONE] Seed complete!")

print()
print("Default credentials:")
print("  Student: aryan@college.edu / Password123!")
print("  Admin:   admin@college.edu / Password123!")
