import { NextResponse } from 'next/server';
import {prisma} from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ message: "මුරපදය ඇතුළත් කර නැත." }, { status: 400 });
        }

        const result = await prisma.$executeRawUnsafe(
            `UPDATE user SET password = '${password}' WHERE id = 1`
        );

        if (result === 0) {
            return NextResponse.json({ 
                message: "දෝෂයකි: ID 1 සහිත පරිශීලකයෙකු දත්ත ගබඩාවේ නැත. කරුණාකර Prisma Studio හරහා පරීක්ෂා කරන්න." 
            }, { status: 404 });
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error: any) {
        console.error("SQL ERROR:", error);
        return NextResponse.json({ 
            message: "සර්වර් දෝෂය: " + error.message 
        }, { status: 500 });
    }
}