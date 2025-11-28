import { NextResponse } from 'next/server';
import { getStats } from '@/lib/database';

export async function GET() {
  try {
    const stats = getStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
