"""
Smart Matching Engine
Compares lost and found items across multiple dimensions to calculate match scores.
"""
from typing import List, Tuple
from datetime import datetime
from difflib import SequenceMatcher
import math
from app.models.models import Item, ItemType


WEIGHTS = {
    "category": 0.25,
    "location": 0.25,
    "time": 0.20,
    "description": 0.15,
    "brand_color": 0.10,
    "title": 0.05,
}

CONFIDENCE_THRESHOLDS = {
    "strong": 0.80,
    "high": 0.65,
    "medium": 0.45,
    "low": 0.0,
}


def _text_similarity(a: str, b: str) -> float:
    """SequenceMatcher-based text similarity ratio (0.0–1.0)."""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def _time_score(dt1: datetime, dt2: datetime) -> float:
    """Score based on temporal proximity. Max 1.0 if same day, decays over 14 days."""
    diff_hours = abs((dt1 - dt2).total_seconds()) / 3600
    # Gaussian-like decay: full score within 24h, ~0 after 2 weeks
    return math.exp(-0.5 * (diff_hours / 72) ** 2)


def _get_confidence(score: float) -> str:
    for level, threshold in CONFIDENCE_THRESHOLDS.items():
        if score >= threshold:
            return level
    return "low"


def compute_match(lost: Item, found: Item) -> Tuple[float, str, List[str]]:
    """
    Compute a match score between a lost item and a found item.
    Returns (score_0_to_1, confidence_level, reasons_list).
    """
    reasons = []
    partial_scores = {}

    # ── Category ──────────────────────────────────────────────────────────────
    if lost.category_id and found.category_id:
        if lost.category_id == found.category_id:
            partial_scores["category"] = 1.0
            reasons.append("Same category")
        else:
            partial_scores["category"] = 0.0
    else:
        partial_scores["category"] = 0.3  # Neutral when unknown

    # ── Location ──────────────────────────────────────────────────────────────
    if lost.location_id and found.location_id:
        if lost.location_id == found.location_id:
            partial_scores["location"] = 1.0
            reasons.append("Same campus location")
        elif (lost.location and found.location and
              lost.location.building == found.location.building and
              lost.location.building is not None):
            partial_scores["location"] = 0.7
            reasons.append("Same building")
        else:
            partial_scores["location"] = 0.2
    else:
        partial_scores["location"] = 0.3

    # ── Time ──────────────────────────────────────────────────────────────────
    time_s = _time_score(lost.date_occurred, found.date_occurred)
    partial_scores["time"] = time_s
    if time_s >= 0.8:
        reasons.append("Compatible time range")
    elif time_s >= 0.5:
        reasons.append("Similar timeframe")

    # ── Description ───────────────────────────────────────────────────────────
    desc_s = _text_similarity(lost.description or "", found.description or "")
    partial_scores["description"] = desc_s
    if desc_s >= 0.5:
        reasons.append("Similar description")
    elif desc_s >= 0.3:
        reasons.append("Partially matching description")

    # ── Brand + Color ─────────────────────────────────────────────────────────
    brand_s = _text_similarity(lost.brand or "", found.brand or "")
    color_s = _text_similarity(lost.color or "", found.color or "")
    bc_score = (brand_s + color_s) / 2 if (lost.brand or lost.color) else 0.3
    partial_scores["brand_color"] = bc_score
    if color_s >= 0.7:
        reasons.append("Similar color")
    if brand_s >= 0.7:
        reasons.append("Same brand")

    # ── Title ─────────────────────────────────────────────────────────────────
    title_s = _text_similarity(lost.title, found.title)
    partial_scores["title"] = title_s
    if title_s >= 0.6:
        reasons.append("Similar item name")

    # ── Weighted Total ────────────────────────────────────────────────────────
    total = sum(partial_scores[k] * WEIGHTS[k] for k in WEIGHTS)
    confidence = _get_confidence(total)

    return round(total, 4), confidence, reasons


def find_matches_for_item(item: Item, candidates: List[Item]) -> List[dict]:
    """
    Given one item, find and rank all matching candidates.
    Returns a list of dicts sorted by score descending.
    """
    results = []
    for candidate in candidates:
        if candidate.id == item.id:
            continue
        if item.item_type == ItemType.lost:
            lost, found = item, candidate
        else:
            lost, found = candidate, item

        score, confidence, reasons = compute_match(lost, found)
        if score >= 0.30:  # Minimum threshold to surface a match
            results.append({
                "lost_item": lost,
                "found_item": found,
                "score": score,
                "confidence_level": confidence,
                "match_reasons": reasons,
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
