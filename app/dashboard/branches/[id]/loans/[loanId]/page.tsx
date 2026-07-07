import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft,ShieldCheck, Banknote, Calendar } from "lucide-react";
import PrintButton from "@/components/PrintButton"; 

export default async function LoanDocumentViewPage({ 
  params 
}: { 
  params: Promise<{ id: string; loanId: string }> 
}) {
  const resolvedParams = await params;
  const branchId = resolvedParams.id
  const loanId = parseInt(resolvedParams.loanId);

  if (isNaN(loanId)) return notFound();

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: { branch: true }
  });

  if (!loan) return notFound();

  return (
    <div className="p-0 md:p-10 bg-slate-100 min-h-screen print:bg-white">
      {/*  Back Button */}
      <Link 
        href={`/dashboard/branches/${branchId}/loans`}
        className="flex items-center gap-2 text-blue-600 font-bold hover:underline print:hidden mb-4">
          <ArrowLeft size={18}/>Back to Investments List
      </Link>
    
      <div className="max-w-4xl mx-auto mb-6 flex justify-end print:hidden p-4">
        <PrintButton />
      </div>

      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl border border-slate-200 min-h-[1050px] p-12 relative print:shadow-none print:border-none print:p-0">
        
        
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#051139] text-white rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-black text-[#051139] tracking-tighter uppercase">
                Official Loan Record
              </h1>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Dearo Investment Limited - Loan Management System
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800">{loan.branch?.branch_name}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              REF: {loan.contract_no}/DOC-{loan.id}
            </div>
          </div>
        </div>

        
        <div className="space-y-12">
          
          
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 border-b border-blue-50 pb-2">
              01. Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-y-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contract Number</p>
                <p className="text-lg font-bold text-slate-800">{loan.contract_no}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Loan Type</p>
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase">
                  {loan.loan_type}
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 print:bg-white print:border-slate-200">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-200 pb-2">
              02. Financial Statement
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-green-600 border border-green-100">
                  <Banknote size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Principal Amount</p>
                  <p className="text-2xl font-black text-slate-900">
                    Rs. {Number(loan.amount).toLocaleString()}.00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-blue-100">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                  <p className="text-2xl font-black text-slate-900">
                    {loan.duration || "12"} <span className="text-sm text-slate-400 font-medium font-sans">Months</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          
          <div className="pt-24 grid grid-cols-2 gap-20 text-center">
            <div>
              <div className="border-b border-slate-300 mb-2 h-10"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Authorized Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-300 mb-2 h-10"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Acknowledgment</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-10 left-12 right-12 border-t border-slate-100 pt-6 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Generated by Dearo System</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}