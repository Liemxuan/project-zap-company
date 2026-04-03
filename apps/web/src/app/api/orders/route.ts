import { NextResponse } from 'next/server';
import { prisma } from '@olympus/zap-db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        employee: {
          include: {
            organization: true,
            brand: true,
            location: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Transform to match the frontend Order interface if needed
    // The date needs to be a string formatted as YYYY-MM-DD for the mock-like experience
    const transformedOrders = orders.map((order: any) => ({
      ...order,
      date: order.date.toISOString().split('T')[0],
      status: order.status as any, // Cast to match string union in frontend
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
