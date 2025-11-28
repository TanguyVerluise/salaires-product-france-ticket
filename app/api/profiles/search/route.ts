import { NextRequest, NextResponse } from 'next/server';
import { searchProfiles } from '@/lib/database';
import type { SearchFilters } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters: SearchFilters = {
      position: body.position || undefined,
      yearsOfExperience: body.yearsOfExperience !== undefined ? parseInt(body.yearsOfExperience, 10) : undefined,
      location: body.location || undefined,
      teamSize: body.teamSize !== undefined ? parseInt(body.teamSize, 10) : undefined,
    };

    const results = searchProfiles(filters);

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Error searching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search profiles' },
      { status: 500 }
    );
  }
}
