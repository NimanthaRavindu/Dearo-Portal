import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function POST(request: Request) {
    try {
        // Frontend එකෙන් එවන JSON දත්ත ලබා ගැනීම
        const body = await request.json();
        const { nic, password } = body; 

        // NIC සහ Password ඇතුළත් කර ඇත්දැයි පරීක්ෂා කිරීම
        if (!nic || !password) {
            return NextResponse.json(
                { error: "NIC and password are required." },
                { status: 400 }
            );
        }

        const [rows]: any = await db.execute(
            "SELECT * FROM user WHERE nic = ? AND password = ?",
            [nic, password]
        );

        if (rows && rows.length > 0) {
            const user = rows[0];

            
            return NextResponse.json(
                { 
                    success: true, 
                    user: user 
                },
                { 
                    status: 200, 
                 
                }
            );
        } else {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "NIC හෝ මුරපදය වැරදියි!" 
                },
                { 
                    status: 401,  
                }
            );
        }

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error. Please try again later." },
            { status: 500 }
        );
    }
}