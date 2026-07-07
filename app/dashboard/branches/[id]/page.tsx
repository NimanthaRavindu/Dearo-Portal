import { prisma } from "@/lib/db";
import {CheckCircle2,Eye, Banknote, Users, TrendingUp, FileText, Send, Clock,ArrowRight,Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BranchDetailsClient from "@/app/branches/[id]/BranchDetailsClient";


export default async function BranchDetailsPage({ params } :{params:{id:string}}) {

  const resolvedParams =await params;
  const branchId = Number(resolvedParams.id);
  
  
  if (isNaN(branchId)){
     return notFound();
    }
    
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: {
      accounts: true,
      loans: true,
      investments: true,
      documentRequest :{
        where:{
          status:"PENDING"
        },
        orderBy:{
          requestedAt:'desc'
        }
      }
    }
  }) as any;

  const historyItems = await prisma.requestHistory.findMany({
    where : {branchId : branchId},
    orderBy : {createdAt:'desc'},
    take : 5
  });

  if (!branch) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Branch not found.</h2>
        <p className="text-slate-500">The requested branch ID does not exist in the database.</p>
      </div>
    );
  }

  const allHistory = [
    ...branch.accounts.map((acc:any) => ({id:acc.id,type:'Account',ref:acc.account_number,date:acc.createdAt,link:`/dashboard/branches/${branchId}/accounts/${acc.id}`})),
    ...branch.loans.map((loan:any) => ({id:loan.id,type:'Loan',ref:loan.contract_no,date:loan.createdAt,link:`/dashboard/branches/${branchId}/loans/${loan.id}`})),
    ...branch.investments.map((inv:any) => ({id:inv.id,type:'Investment',ref:inv.id,date:inv.createdAt,link:`/dashboard/branches/${branchId}/investments/${inv.id}`})),
  ]

  const allDocuments = [
    ...branch.accounts.map((doc:any) =>({id:doc.id,type:"ACCOUNT",number:doc.account_number,name:doc.customer_name})),
    ...branch.loans.map((doc:any) => ({id:doc.id,type:"LOAN",number:doc.contract_no})),
    ...branch.investments.map((doc:any) =>({id:doc.id,type:"INVESTMENT",number:doc.contract_no}))
  ]
    
  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors w-fit text-sm font-medium">
          <ArrowRight className="w-4 h-4 mr-2"/>Back to Dashboard
        </Link>
      </div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
            <Building2 size={24}/>
          </div>
          <div>
              <h1 className="text-3xl font-extrabold text-[#051139] uppercase">
                {branch.branch_name}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Branch Code: <span className="text-blue-600 font-bold">{branch.branch_code}</span>
              </p>
          </div>    
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Accounts Card */}
        <Link href={`/dashboard/branches/${branchId}/accounts`} className="bg-blue-50 border border-blue-100 p-6 rounded-2xl hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600"><Users size={24} /></div>
            <ArrowRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase">Total Accounts</p>
          <h3 className="text-3xl font-bold text-slate-800">{branch.accounts.length}</h3>
        </Link>

        {/* Loans Card */}
        <Link href={`/dashboard/branches/${branchId}/loans`} className="bg-green-50 border border-green-100 p-6 rounded-2xl hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-green-600"><Banknote size={24} /></div>
            <ArrowRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase">Total Loans</p>
          <h3 className="text-3xl font-bold text-slate-800">{branch.loans.length}</h3>
        </Link>

        {/* Investments Card */}
        <Link href={`/dashboard/branches/${branchId}/investments`} className="bg-orange-50 border border-orange-100 p-6 rounded-2xl hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-orange-600"><TrendingUp size={24} /></div>
            <ArrowRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase">Total Investments</p>
          <h3 className="text-3xl font-bold text-slate-800">{branch.investments.length}</h3>
        </Link>
      </div>

      {/* Documents Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
          {/*@ts-ignore */}
          <BranchDetailsClient branch={branch} params={params}/>
          {branch.documentRequest.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500"/>
              </div>
              <div className="text-center">
                <p className="text-slate-800 font-bold text-sm">All set!</p>
                <p className="text-slate-400 text-xs">No pending documents to submit for this branch.</p>
              </div>
            </div>
            
          )}
        </div>

      {/* Request History Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2"><Clock className="text-purple-600" size={18} />
          <h2 className="text-sm font-bold text-slate-800">Request History</h2>
        </div>

        <Link href="#" className="text-[10px] font-bold text-blue-600 hover:underline uppercase">
            View All Transactions
        </Link>  
        </div>

        <div className="divide-y">
          {historyItems.length > 0 ? (
            historyItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={16} />
                  </div>
                  <div>
                    
                    <p className="text-xs font-black uppercase text-slate-700">
                      {item.documentType} Viewed
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">REF: {item.referenceNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Status</p>
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Date</p>
                    <p className="text-[9px] font-bold text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link 
                    href={item.link} 
                    className="p-2 bg-slate-100 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Clock className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest">No History Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, count, icon, color }: { title: string, count: number, icon: any, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${colors[color]} bg-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} border-none shadow-inner`}>
          {icon}
        </div>
        <ArrowRight size={16} className="text-slate-300" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
      <p className="text-3xl font-black mt-1 text-slate-800">{count}</p>
    </div>

  );
}