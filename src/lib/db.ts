import { getSupabase } from './supabase';
import type { Registration, Donor, Campaign, ContactSubmission } from './database.types';

// Maps form swim experience values to database enum values
const swimExperienceMap: Record<string, Registration['swim_experience']> = {
  'No experience': 'none',
  'Beginner': 'beginner',
  'Some experience': 'some',
};

// ============================================
// REGISTRATION FUNCTIONS
// ============================================

export async function insertRegistration(data: {
  childName: string;
  childAge: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  swimExperience: string;
  hasSpecialNeeds: boolean;
  specialNeedsDetails?: string;
  sessionPreference?: string;
  photoConsent: boolean;
  liabilityWaiver: boolean;
}): Promise<Registration> {
  const supabase = getSupabase();
  const { data: registration, error } = await supabase
    .from('registrations')
    .insert({
      child_name: data.childName,
      child_age: data.childAge,
      parent_name: data.parentName,
      parent_email: data.parentEmail,
      parent_phone: data.parentPhone,
      swim_experience: swimExperienceMap[data.swimExperience] || 'none',
      has_special_needs: data.hasSpecialNeeds,
      special_needs_details: data.specialNeedsDetails || null,
      session_preference: data.sessionPreference || null,
      photo_release_consent: data.photoConsent,
      liability_waiver_agreed: data.liabilityWaiver,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert registration: ${error.message}`);
  }

  return registration;
}

export async function getRegistrations(status?: Registration['status']): Promise<Registration[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch registrations: ${error.message}`);
  }

  return data;
}

export async function updateRegistrationStatus(
  id: string,
  status: Registration['status']
): Promise<Registration> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update registration status: ${error.message}`);
  }

  return data;
}

// ============================================
// DONOR FUNCTIONS (for future Phase 2 use)
// ============================================

export async function insertDonor(
  data: Omit<Donor, 'id' | 'created_at'>
): Promise<Donor> {
  const supabase = getSupabase();
  const { data: donor, error } = await supabase
    .from('donors')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert donor: ${error.message}`);
  }

  return donor;
}

export async function getVisibleDonors(): Promise<Donor[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('display_consent', true)
    .order('tier')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch donors: ${error.message}`);
  }

  return data;
}

export async function getDonorByStripeSession(sessionId: string): Promise<Donor | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is expected
    throw new Error(`Failed to fetch donor by session: ${error.message}`);
  }

  return data || null;
}

// ============================================
// CAMPAIGN FUNCTIONS (for future Phase 2 use)
// ============================================

export async function getActiveCampaign(): Promise<Campaign | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch active campaign: ${error.message}`);
  }

  return data || null;
}

export async function incrementCampaignAmount(amount: number): Promise<Campaign> {
  const campaign = await getActiveCampaign();

  if (!campaign) {
    throw new Error('No active campaign found');
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('campaigns')
    .update({ current_amount: campaign.current_amount + amount })
    .eq('id', campaign.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update campaign amount: ${error.message}`);
  }

  return data;
}

// ============================================
// CONTACT FUNCTIONS
// ============================================

export async function insertContactSubmission(data: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactSubmission> {
  const supabase = getSupabase();
  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert contact submission: ${error.message}`);
  }

  return submission;
}
