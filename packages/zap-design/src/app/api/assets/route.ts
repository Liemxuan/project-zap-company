import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limitParam = searchParams.get('limit');
        const isAll = limitParam === '0';
        const limit = limitParam ? parseInt(limitParam, 10) : 20;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const skip = isAll ? 0 : (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereCondition: any = {};
        if (status) {
            whereCondition.status = status;
        }

        if (search) {
            if (search.startsWith('#')) {
                const tagTerm = search.substring(1);
                whereCondition.tags = { contains: tagTerm };
            } else {
                whereCondition.OR = [
                    { filePath: { contains: search } },
                    { trackingId: { contains: search } },
                    { originalName: { contains: search } },
                    { filePathB: { contains: search } },
                    { filePathZap: { contains: search } },
                    { category: { contains: search } },
                    { tags: { contains: search } },
                ];
            }
        }

        const [tickets, total] = await Promise.all([
            prisma.assetTicket.findMany({
                where: whereCondition,
                skip,
                take: isAll ? undefined : limit,
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.assetTicket.count({ where: whereCondition })
        ]);

        return NextResponse.json({
            data: tickets,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    } catch (error: any) {
        console.error("Failed to fetch asset tickets:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch asset tickets" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
