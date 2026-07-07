import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req:Request) {
    try {
        const {branchId,customerName,docType,category} = await req.json();

        const query = 'INSERT INTO 	document_requests(branch_id,customer_name,doc_type,doc_category) VALUES(?,?,?,?)';
        await db.execute(query,[branchId,customerName,docType,category]);

        return NextResponse.json({success:true, message:"Inserted Success!"});
    } catch (error) {
        return NextResponse.json({success:false, message:"Database Error"},{status:500});
    }
}
