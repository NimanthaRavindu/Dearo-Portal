import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nic, email, password } = body;

  
    if (!name || !nic || !email || !password) {
      return NextResponse.json(
        { error: "සියලුම තොරතුරු ඇතුළත් කිරීම අනිවාර්යයි." },
        { status: 400 }
      );
    }
 
    await prisma.$executeRawUnsafe(
      `INSERT INTO User (name, nic, email, password,branchId) 
       VALUES (?, ?, ?, ?, ?)`,
      name, 
      nic, 
      email, 
      password,
      'USER', 
      1,
       
    );

    return NextResponse.json(
      { message: "පරිශීලකයා සාර්ථකව ඇතුළත් කරන ලදී." },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("SQL_INSERT_ERROR:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}