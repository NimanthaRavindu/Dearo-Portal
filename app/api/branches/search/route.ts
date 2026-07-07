import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export  async function GET(req:Request){
  try {
    const {searchParams} = new URL(req.url);
    const queryTerm = searchParams.get('q');

    if (!queryTerm) return NextResponse.json([]);
    

    const sql = "SELECT  branchId,branch_name,branch_code FROM branch WHERE branch_name LIKE ? OR branch_code LIKE ? ";
    const [rows] = await db.execute(sql,['%${queryTerm}%','%${queryTerm}%']);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([]);
  }  
  
}
