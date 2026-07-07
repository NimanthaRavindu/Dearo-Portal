import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const investments = await prisma.investment.findMany({
            orderBy: {
                uploadedAt: 'desc' 
            }
        });

        return NextResponse.json({
            success: true,
            data: investments
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: "දත්ත ලබා ගැනීමේදී දෝෂයක් සිදු විය."
        }, { status: 500 });
    }
}