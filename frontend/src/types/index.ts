export interface User {
  id: string;
  name: string;
  email: string;
  student_id?: string;
  role: 'student' | 'admin' | 'moderator';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Location {
  id: string;
  name: string;
  building: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface Item {
  id: string;
  title: string;
  item_type: 'lost' | 'found';
  status: 'active' | 'matched' | 'claimed' | 'recovered' | 'archived';
  verification: 'pending' | 'verified' | 'rejected' | 'flagged';
  brand?: string;
  color?: string;
  description: string;
  date_occurred: string;
  time_approximate: string;
  images: string[];
  created_at: string;
  updated_at: string;
  reporter: User;
  category: Category | null;
  location: Location | null;
  match_count: number;
}

export interface Match {
  id: string;
  lost_item: Item;
  found_item: Item;
  score: number;
  confidence_level: 'low' | 'medium' | 'high' | 'strong';
  match_reasons: string[];
  status: 'pending' | 'confirmed' | 'dismissed';
  created_at: string;
}

export interface Claim {
  id: string;
  item: Item;
  claimant: User;
  ownership_proof?: string;
  identifying_info?: string;
  additional_notes?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  notification_type: 'match' | 'claim' | 'verification' | 'recovery' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  related_item_id?: string;
  related_match_id?: string;
  created_at: string;
}

export interface AdminStats {
  total_items: number;
  lost_items: number;
  found_items: number;
  recovered_items: number;
  pending_reports: number;
  pending_claims: number;
  active_users: number;
  recovery_rate: number;
}

export interface ItemListOut {
  items: Item[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}
