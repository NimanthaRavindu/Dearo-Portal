import { prisma } from "@/lib/db";
import MainDashboardCharts from "@/components/MainDashboardCharts";
import DashboardStats from "@/components/DashboardStats";

export default async function DashboardPage() {
  const branches = await prisma.branch.findMany({
    include: {
      _count: {
        select: {
          documentRequest: true,
          accounts: true,
          loans: true,
          investments: true,
        },
      },
    },
  });

  const totalAccounts = await prisma.documentRequest.count({
    where: { documentType: "ACCOUNT" },
  });

  const totalLoans = await prisma.documentRequest.count({
    where: { documentType: "LOAN" },
  });

  const totalInvestments = await prisma.documentRequest.count({
    where: { documentType: "INVESTMENT" },
  });

  const totalSystemDocuments = totalAccounts + totalLoans + totalInvestments;

  // Icons ඉවත් කර පිරිසිදු Plain Objects පමණක් සකස් කර ඇත
  const stats = [
    { label: "Active Branches", value: branches.length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Documents", value: totalSystemDocuments, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Total Accounts", value: totalAccounts, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", href: "/dashboard/documents/ACCOUNT" },
    { label: "Total Loans", value: totalLoans, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", href: "/dashboard/documents/LOAN" },
    { label: "Total Investments", value: totalInvestments, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/30", href: "/dashboard/documents/INVESTMENT" },
  ];

  return (
    <div className="p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* 1. Stats Cards & Directory Section */}
      <DashboardStats stats={stats} branches={branches} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">File Distribution by Branch</h3>
          <MainDashboardCharts branches={branches} />
        </div>
        
        {/* Branch Directory */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Branch Directory</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {branches.map((branch) => {
              const totalBranchFiles =                 
                branch._count.accounts + 
                branch._count.loans + 
                branch._count.investments;

              return (
                <div key={branch.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-800">{branch.branch_name}</p>
                    <p className="text-xs text-slate-500">{branch.branch_code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{totalBranchFiles}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Total Files</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}