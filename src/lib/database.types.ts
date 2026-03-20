export interface Registration {
  id: string;
  created_at: string;
  child_name: string;
  child_age: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  swim_experience: 'none' | 'beginner' | 'some';
  has_special_needs: boolean;
  special_needs_details: string | null;
  session_preference: string | null;
  photo_release_consent: boolean;
  liability_waiver_agreed: boolean;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Donor {
  id: string;
  created_at: string;
  name: string;
  tier: 'splash_supporter' | 'wave_maker' | 'tide_changer';
  amount: number;
  display_consent: boolean;
  is_recurring: boolean;
  stripe_session_id: string | null;
  stripe_customer_id: string | null;
}

export interface Campaign {
  id: string;
  created_at: string;
  updated_at: string;
  label: string;
  goal_amount: number;
  current_amount: number;
  is_active: boolean;
}

export interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}
