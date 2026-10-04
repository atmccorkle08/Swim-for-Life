import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getSupabase } from '@/lib/supabase';
import { isAdminRequest, unauthorized } from '@/lib/auth';
import { galleryCategories } from '@/data/gallery';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 10000;
const ALLOWED_CATEGORIES = new Set(
  galleryCategories.filter((c) => c.slug !== 'all').map((c) => c.slug),
);

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, src, alt, caption, category, width, height, sort_order')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Fetch failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = (formData.get('alt') as string | null)?.trim() ?? '';
    const caption = ((formData.get('caption') as string | null) || '').trim() || null;
    const category = (formData.get('category') as string | null) ?? '';
    const width = parseInt((formData.get('width') as string) || '', 10);
    const height = parseInt((formData.get('height') as string) || '', 10);
    const sortOrder = parseInt((formData.get('sort_order') as string) || '0', 10);

    if (!file || !alt || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (alt.length > 300) {
      return NextResponse.json({ error: 'Alt text too long' }, { status: 400 });
    }
    if (caption && caption.length > 500) {
      return NextResponse.json({ error: 'Caption too long' }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > MAX_DIMENSION ||
      height > MAX_DIMENSION
    ) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
    }
    if (!Number.isInteger(sortOrder)) {
      return NextResponse.json({ error: 'Invalid sort order' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
    }
    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const supabase = getSupabase();

    const fileName = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
    const src = urlData.publicUrl;

    const { data: row, error: dbError } = await supabase
      .from('gallery_images')
      .insert({ src, alt, caption, category, width, height, sort_order: sortOrder })
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from('gallery').remove([fileName]);
      return NextResponse.json(
        { error: `Database insert failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('Gallery upload error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const { id } = body;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const updates: Record<string, string | number | null> = {};

    if ('alt' in body) {
      const alt = typeof body.alt === 'string' ? body.alt.trim() : '';
      if (!alt) return NextResponse.json({ error: 'Alt text is required' }, { status: 400 });
      if (alt.length > 300) return NextResponse.json({ error: 'Alt text too long' }, { status: 400 });
      updates.alt = alt;
    }
    if ('caption' in body) {
      const caption = typeof body.caption === 'string' ? body.caption.trim() : '';
      if (caption.length > 500) return NextResponse.json({ error: 'Caption too long' }, { status: 400 });
      updates.caption = caption || null;
    }
    if ('category' in body) {
      if (typeof body.category !== 'string' || !ALLOWED_CATEGORIES.has(body.category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      updates.category = body.category;
    }
    if ('sort_order' in body) {
      if (typeof body.sort_order !== 'number' || !Number.isInteger(body.sort_order)) {
        return NextResponse.json({ error: 'Invalid sort order' }, { status: 400 });
      }
      updates.sort_order = body.sort_order;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select('id, src, alt, caption, category, width, height, sort_order')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: `Update failed: ${error.message}` }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Gallery update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    let id: unknown;
    try {
      ({ id } = await request.json());
    } catch {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Look the file up server-side rather than trusting a client-supplied path.
    const { data: row, error: lookupError } = await supabase
      .from('gallery_images')
      .select('id, src')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: `Delete failed: ${lookupError.message}` },
        { status: 500 }
      );
    }
    if (!row) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json(
        { error: `Delete failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Remove the file after the row so a failure never leaves a broken gallery entry.
    const storagePath = row.src.split('/storage/v1/object/public/gallery/').pop();
    if (storagePath && storagePath !== row.src) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([decodeURIComponent(storagePath)]);
      if (storageError) console.error('Gallery storage cleanup failed:', storageError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Gallery delete error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
