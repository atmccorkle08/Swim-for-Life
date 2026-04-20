import { getSupabase } from './supabase';
import { GalleryPhoto } from '@/data/gallery';

export async function getGalleryImages(): Promise<GalleryPhoto[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('gallery_images')
    .select('id, src, alt, caption, category, width, height')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch gallery images:', error.message);
    return [];
  }

  return data as GalleryPhoto[];
}
