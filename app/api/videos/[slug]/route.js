import { NextResponse } from 'next/server';
import { getVideoBySlug, getVideos } from '@/lib/data-source';

export async function GET(request, context) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Public detail view: exclude raw prompt until rewarded unlock
    const video = await getVideoBySlug(slug, false);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Related videos from same category
    const categorySlug = video.category?.slug || 'all';
    const { videos: related } = await getVideos({
      category: categorySlug,
      limit: 5,
      status: 'published',
      includePrompt: false,
    });

    const relatedVideos = (related || [])
      .filter((v) => v.slug !== video.slug)
      .slice(0, 4);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...video,
          relatedVideos,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching video by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video details' },
      { status: 500 }
    );
  }
}

