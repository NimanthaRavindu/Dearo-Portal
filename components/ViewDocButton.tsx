"use client";
import { Eye } from "lucide-react";
import Link from "next/link";
import { addToHistory } from "@/app/actions/history";

interface viewDocProps{
    branchId:number,
    type:string,
    refNo:string,
    link:string;
}

const ViewDocButton = ({branchId,type,refNo,link}:viewDocProps) => {
  return (
    <Link href={link} onClick={() => addToHistory(branchId,type,refNo,link)} className="flex items-center gap-1 text-blue-600 hover:underline font-bold text-xs">
        <Eye size={14}/>View
    </Link>
  )
}

export default ViewDocButton