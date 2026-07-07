import { prisma } from "@/lib/db";
import { 
  Users, 
  Banknote, 
  TrendingUp, 
  History, 
  FileText, 
  Eye,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

async function getAllBranchesData() {
  const [accounts, loans, investments, history] = await Promise.all([
    prisma.account.findMany({ include: { branch: true } }),
    prisma.loan.findMany({ include: { branch: true } }),
    prisma.investment.findMany({ include: { branch: true } }),
    prisma.requestHistory.findMany({
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
      take: 8
    })
  ]);

  const allDocs = [
    ...accounts.map(a => ({ id: a.id, no: a.account_number, type: 'Account', branch: a.branch.branch_name, link: `/dashboard/branches/${a.branchId}/accounts/${a.id}` })),
    ...loans.map(l => ({ id: l.id, no: l.contract_no, type: 'Loan', branch: l.branch.branch_name, link: `/dashboard/branches/${l.branchId}/loans/${l.id}` })),
    ...investments.map(i => ({ id: i.id, no: i.contract_no || i.contract_no, type: 'Investment', branch: i.branch.branch_name, link: `/dashboard/branches/${i.branchId}/investments/${i.id}` }))
  ];

  return {
    stats: {
      accounts: accounts.length,
      loans: loans.length,
      investments: investments.length
    },
    allDocs,
    history
  };
}

export default async function AllBranchesPage() {
  const data = await getAllBranchesData();

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">All Branches</h1>
          <p className="text-xs font-bold text-slate-400">System Overview • <span className="text-blue-600 font-black">MASTER VIEW</span></p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Branch Code</p>
           <p className="text-lg font-black text-blue-600">A26</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Accounts" value={data.stats.accounts} icon={<Users size={24}/>} color="blue" />
        <StatCard title="Total Loans" value={data.stats.loans} icon={<Banknote size={24}/>} color="green" />
        <StatCard title="Total Investments" value={data.stats.investments} icon={<TrendingUp size={24}/>} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branch Documents Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg text-white"><FileText size={18} /></div>
              <h2 className="font-black text-sm text-slate-700 uppercase">Recent Branch Documents</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-4">Doc Number</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.allDocs.slice(0, 10).map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{doc.no}</td>
                    <td className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase">{doc.branch}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-[9px] font-black uppercase text-slate-500">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={doc.link} className="inline-flex items-center gap-1 text-blue-600 font-bold text-[10px] uppercase hover:underline">
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request History Section */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-5 border-b flex items-center gap-2 bg-slate-50/30">
            <History className="text-purple-600" size={18} />
            <h2 className="font-black text-sm text-slate-700 uppercase">Global History</h2>
          </div>
          <div className="divide-y">
            {data.history.length > 0 ? (
              data.history.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                      {item.branch?.branch_name}
                    </p>
                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-green-50 text-green-600 rounded uppercase">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-1">
                    {item.documentType} Viewed
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-bold text-slate-400">REF: {item.referenceNo}</p>
                    <Link href={item.link} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-300 font-black text-[10px] uppercase italic">
                No activity recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}