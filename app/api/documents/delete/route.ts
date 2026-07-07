import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"; 

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body; 

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Document ID එක ලැබී නොමැත." },
                { status: 400 }
            );
        }

        await prisma.documentRequest.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("Database Delete Error:", error);
        return NextResponse.json(
            { success: false, error: "Database එකෙන් මැකීමට අපොහොසත් විය.", details: error.message },
            { status: 500 }
        );
    }
}