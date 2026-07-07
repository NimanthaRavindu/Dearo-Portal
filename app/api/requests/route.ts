import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const requests = await prisma.documentRequest.findMany({
            include: {
                 branch:true,
            },
            orderBy: {
                requestedAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, data: requests });
    } catch (error) {
        return NextResponse.json({ success: false, error: "දත්ත ලබාගැනීමට නොහැකි විය." }, { status: 500 });
    }
}