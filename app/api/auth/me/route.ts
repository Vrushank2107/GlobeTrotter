import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: 'usr_demo',
      name: 'Nirmal Purja',
      email: 'demo@globetrotter.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      memberType: 'Pro Member',
      countriesVisited: 12,
      tripsPlanned: 8,
      totalBudgetSpent: 385000,
      bio: 'High-altitude mountaineer & explorer. Always looking for the next ridge to cross.',
      favoriteDestinations: ['Goa, India', 'Tokyo, Japan', 'Kathmandu, Nepal', 'Paris, France'],
    },
  });
}
