import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const requests = await prisma.documentRequest.findMany({
      where:{
        ...(type && {documentType:type.toUpperCase() as any}),
      },
      orderBy:{
        createdAt:"desc",
      },
    });

    return NextResponse.json(requests); 

  } catch (error: any) {
    console.error("DATABASE GET ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const {docNumber,documentType,branchId} = body;

    console.log("Received Data:",{docNumber,documentType,branchId});

    const newRequest = await prisma.documentRequest.create({
      data:{
        docNumber : String(docNumber),
        documentType:documentType,
        senderId:Number(branchId),
        status:"PENDING",

      },
    });
    
    return NextResponse.json(newRequest);
  } catch (error:any) {
    console.error("DATABASE PORT ERROR:",error);
    return NextResponse.json(
      {error:"Data inserted unsuccessful",details:error.message},
      {status:500}
    );

  }
}