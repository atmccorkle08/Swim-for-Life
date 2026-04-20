import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
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
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = formData.get('alt') as string;
    const caption = (formData.get('caption') as string) || null;
    const category = formData.get('category') as string;
    const width = parseInt(formData.get('width') as string, 10);
    const height = parseInt(formData.get('height') as string, 10);
    const sortOrder = parseInt((formData.get('sort_order') as string) || '0', 10);

    if (!file || !alt || !category || !width || !height) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    const src = urlData.publicUrl;

    // Insert row into gallery_images
    const { data: row, error: dbError } = await supabase
      .from('gallery_images')
      .insert({ src, alt, caption, category, width, height, sort_order: sortOrder })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if DB insert fails
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

export async function DELETE(request: NextRequest) {
  try {
    const { id, src } = await request.json();

    if (!id || !src) {
      return NextResponse.json(
        { error: 'Missing id or src' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Extract storage filename from the public URL
    const storagePath = src.split('/storage/v1/object/public/gallery/').pop();

    if (storagePath) {
      await supabase.storage.from('gallery').remove([storagePath]);
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Gallery delete error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
