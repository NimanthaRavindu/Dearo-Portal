import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const accNo = formData.get("accNo") as string;
    const custNo = formData.get("custNo") as string;
    const billType = formData.get("billtype") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = formData.get("date") as string;
    const branchId = parseInt(formData.get("branchId") as string);
    
    // 📸 සැබෑ පින්තූරය මෙතැනට කිසිදු බාධාවකින් තොරව ලැබේ
    const file = formData.get("billPhoto") as File | null;
    let filename = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
      
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, buffer);
    }

    // Database එකට ඇතුළත් කිරීම
    const newAccount = await prisma.account.create({
      data: {
        account_number: accNo,
        customer_name: custNo,
        bill_type: billType,
        amount: amount,
        date: date,
        branchId: branchId,
        billPhoto: filename ? `/uploads/${filename}` : null, // 📸 ස්ථීරවම පින්තූරය මෙතැනින් Save වේ!
      },
    });

    return NextResponse.json({ success: true, data: newAccount });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: "Database saving failed" }, { status: 500 });
  }
}