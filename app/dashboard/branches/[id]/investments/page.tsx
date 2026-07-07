import {prisma} from "@/lib/db";
import { ArrowLeft,Plus, Eye } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import ViewDocButton from "@/components/ViewDocButton";

export default async function InvestmentPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const branchId = parseInt(resolvedParams.id);

  if (isNaN(branchId)) {
    return <div>Invalid Branch ID in  URL</div>;
  }
  
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { investments: true }
  });

  async function addInvestment(formData: FormData) {
    "use server";
    await prisma.investment.create({
      data: {
        contract_no: formData.get("cNo") as string,
        amount: parseFloat(formData.get("amount") as string),
        branchId: branchId,
      }
    });
    revalidatePath(`/dashboard/branches/${branchId}/investments`);
  }

  return (
    <div className="p-6 space-y-6">
      <Link href={`/dashboard/branches/${branchId}`} className="flex items-center gap-2 text-blue-600 font-bold hover:underline mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      
      <h1 className="text-2xl font-bold">{branch?.branch_name} - Investments Documents</h1>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Add Investment</h2>
        <form action={addInvestment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="cNo" placeholder="Contract_Number" className="border p-2 rounded-lg" required />
          <input name="amount" type="number" placeholder="Amount" className="border p-2 rounded-lg" required />
          <button type="submit" className="col-span-full bg-orange-600 text-white p-2 rounded-lg font-bold">Add Investment</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Contract No</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {branch?.investments.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="p-4">{inv.contract_no}</td>
                <td className="p-4">Rs. {inv.amount.toLocaleString()}</td>
                <td className="p-4">
                  <ViewDocButton branchId={branchId} type="Investment" refNo={inv.contract_no} link={`/dashboard/branches/${branchId}/investments/${inv.id}`}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}