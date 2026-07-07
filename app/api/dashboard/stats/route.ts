import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export  async function GET() {
    
    try {
       const [total] = await db.execute('SELECT COUNT(*) as count FROM document_requests');
       const [pending] = await db.execute('SELECT COUNT(*) as count FROM document_requests WHERE status = "Pending"');
       const [approved] = await db.execute('SELECT COUNT(*) as count FROM document_requests WHERE status= "Approved"');
       
       return NextResponse.json({
         total:(total as any)[0].count,
         pending:(pending as any)[0].count,
         approved:(approved as any)[0].count,
       });
    } catch (error) {
        return NextResponse.json({error:"Failed to fetch stats"},{status:500});
    }
  
}
