"use server"
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addToHistory(branchId: number, type: string, ref: string, link: string) {
  try {
      await prisma.requestHistory.create({
        data: {
        branchId: branchId,
        documentType: type,
        referenceNo: ref,
        link: link,
        status: "Viewed"
    }
  });
  revalidatePath(`/dashboard/branches/${branchId}`);
    
  } catch (error) {
    console.error("History Error:",error);
  }

}
