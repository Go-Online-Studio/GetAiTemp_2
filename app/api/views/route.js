import { NextResponse } from 'next/server';
import { recordVideoView } from '@/lib/data-source';
import { viewsSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const validation = viewsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid request' },
        { status: 400 }
      );
    }

    const { videoId } = validation.data;

    // Throttle view increments to once per 10 seconds per IP per video
    const limiter = rateLimit(ip, `view:${videoId}`, 1, 10000);
    if (!limiter.success) {
      return NextResponse.json({ success: true, message: 'View already recorded for session' });
    }

    const result = await recordVideoView(videoId);

    return NextResponse.json({
      success: true,
      views: result.views,
    });
  } catch (error) {
    console.error('Views increment error:', error);
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    );
  }
}
