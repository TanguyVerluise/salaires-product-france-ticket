import { NextRequest, NextResponse } from 'next/server';
import { createProfile, getAllProfiles } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation basique
    if (!body.position || !body.yearsOfExperience || !body.location || !body.teamSize || !body.salary) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const profile = createProfile({
      position: body.position,
      yearsOfExperience: parseInt(body.yearsOfExperience, 10),
      location: body.location,
      teamSize: parseInt(body.teamSize, 10),
      salary: parseInt(body.salary, 10),
    });

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        // Ne pas retourner le salaire pour préserver l'anonymat
        salary: undefined,
      },
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const profiles = getAllProfiles();
    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
