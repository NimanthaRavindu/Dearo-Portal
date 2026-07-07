import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function GET() {
    
    try {
        const query = 'SELECT type,COUNT(*) as count FROM loan GROUP BY type';
        const [rows] : any = await db.execute(query);

        return NextResponse.json({success:true,data:rows});

    } catch (error : any) {
        return NextResponse.json({success:false,error:error.message},{status:500});
    }
  
}
