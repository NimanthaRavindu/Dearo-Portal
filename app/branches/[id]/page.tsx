
import { PrismaClient } from '@prisma/client';
import { 
  FileText, Users, TrendingUp, ArrowLeft, 
  Download, Folder, Eye 
} from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BranchDetailsPage({ params }: PageProps) {
  
  const resolvedParams = await params;
  const branchId = parseInt(resolvedParams.id);


  const branch = await prisma.branch.findUnique({
    where: { 
        id: branchId 
    },
    include: {
      loans: true,
      accounts: true,
      investments: true,
    },
  }) as any;

  if (!branch) {
    return(
      <div className="p-10 text-center">
        <h1 className="text-red-500 font-bold">(Branch Not Found)</h1>
        <p>Please enter correct branch ID</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white rounded-full border shadow-sm hover:bg-slate-50">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase">{branch.branch_name}</h1>
            <p className="text-blue-600 text-[10px] font-bold flex items-center gap-1 uppercase">
              <Folder size={12} /> Branch Management
            </p>
          </div>
        </div>
        <button className="bg-[#1e2a3b] text-white px-5 py-2 rounded-lg text-sm font-semibold">
          <Download size={16} className="inline mr-2" /> Export
        </button>
      </div>

      {/* Stats Cards - Optional Chaining  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            label="Loans" 
            count={branch.loans?.length || 0} 
            icon={FileText} 
            color="blue" 
        />
        <StatCard 
            label="Accounts" 
            count={branch.accounts?.length || 0} 
            icon={Users} 
            color="green" 
        />
        <StatCard 
            label="Investments" 
            count={branch.investments?.length || 0} 
            icon={TrendingUp} 
            color="purple" 
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">DOCUMENT REGISTRY</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              
              {branch.loans && branch.loans.length > 0 ? (
                branch.loans.map((loan: any) => (
                  <tr key={loan.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-700">
                        {loan.loan_number || `LN-00${loan.id}`}
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">LOAN</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 font-bold flex items-center gap-1 mx-auto">
                        <Eye size={14} /> VIEW
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                    No documents found for this branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, count, icon: Icon, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={24} /></div>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-slate-900">{count}</p>
        <p className="text-xs text-slate-500">Total Records</p>
      </div>
    </div>
  );
}