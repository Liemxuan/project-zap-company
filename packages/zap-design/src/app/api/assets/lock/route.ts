import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { filePath, isLocked } = body;

        if (!filePath || typeof isLocked !== 'boolean') {
            return NextResponse.json({ error: "Missing required fields: filePath and isLocked (boolean)" }, { status: 400 });
        }

        const ticket = await prisma.assetTicket.update({
            where: { filePath },
            data: { isLocked }
        });

        return NextResponse.json({ data: ticket });
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (error: any) {
        console.error("Failed to update asset lock status:", error);
        return NextResponse.json({ error: error.message || "Failed to update asset lock status" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
