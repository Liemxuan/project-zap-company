import { prisma } from '@olympus/zap-db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST_login(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true }
        });

        // Hardcoded fake passwords based on actions.ts
        if (user && user.password === password) {
            return NextResponse.json({ 
                success: true, 
                token: user.id, // Fleet Bearer Token
                user 
            });
        }

        return NextResponse.json({ error: 'Invalid credentials. Use name@zap and 1234.' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET_session(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const user = await prisma.user.findUnique({
            where: { id: token },
            include: { employee: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
