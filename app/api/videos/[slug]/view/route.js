import { NextResponse } from 'next/server';
import { recordVideoView } from '@/lib/data-source';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request, context) {
  try {
    const { slug } = await context.params;
    const videoId = slug;
    if (!videoId) {
      return NextResponse.json({ error: 'Video ID or Slug is required' }, { status: 400 });
    }

    const ip = getClientIp(request);
    // Rate limit: 1 view per 30 minutes (1800000 ms) per IP per video
    const limiter = rateLimit(ip, `view:${videoId}`, 1, 1800000);
    if (!limiter.success) {
      return NextResponse.json({
        success: true,
        message: 'View already recorded recently for this session',
      });
    }

    const result = await recordVideoView(videoId);

    return NextResponse.json({
      success: true,
      views: result?.views,
    });
  } catch (error) {
    console.error('Video view increment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record view' },
      { status: 500 }
    );
  }
}

