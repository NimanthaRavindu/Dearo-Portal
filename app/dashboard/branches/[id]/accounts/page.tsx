import { prisma } from "@/lib/db";
import { Plus, ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import ViewDocButton from "@/components/ViewDocButton";
import BillPhotoUploadPage from "@/components/BillPhotoUpload";
import { promises as fs } from "fs";
import path from "path";

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const branchId = parseInt(resolvedParams.id);

  if (isNaN(branchId)) {
    return <div>Invalid Branch ID in URL</div>;
  }

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    include: { accounts: { orderBy: { id: "desc" } } }
  });

  async function addAccount(formData: FormData) {
    "use server";
    
    // 🎯 1. Hidden inputs මඟින් එවන ලද Base64 දත්ත සහ පින්තූරයේ නම ලබා ගැනීම
    const base64Data = formData.get("billPhotoBase64") as string;
    const originalName = formData.get("billPhotoName") as string;
    let filename = "";

    if (base64Data && originalName) {
      try {
        // Base64 String එකෙන් සැබෑ පින්තූරයේ කේත කොටස පමණක් වෙන් කර ගැනීම
        const base64Image = base64Data.split(';base64,').pop();
        
        if (base64Image) {
          // දත්ත Buffer එකක් බවට පත් කිරීම
          const buffer = Buffer.from(base64Image, 'base64');
          
          filename = `${Date.now()}-${originalName.replace(/\s+/g, "_")}`;
          const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
          
          // uploads ෆෝල්ඩරය සෑදීම සහ පින්තූරය පරිගණකයේ ලිවීම (Save කිරීම)
          await fs.mkdir(path.dirname(uploadPath), { recursive: true });
          await fs.writeFile(uploadPath, buffer);
        }
      } catch (uploadError) {
        console.error("File write failed:", uploadError);
      }
    }

    // 🎯 2. Database එකට දත්ත ඇතුළත් කිරීම (මෙහිදී billPhoto එක කිසිසේත් null නොවේ)
    await prisma.account.create({
      data: {
        account_number: formData.get("accNo") as string,
        customer_name: formData.get("custNo") as string,
        bill_type: formData.get("billtype") as string,
        amount: parseFloat(formData.get("amount") as string),
        date: formData.get("date") as string,
        branchId: branchId,
        billPhoto: filename ? `/uploads/${filename}` : null,
      }
    });

    revalidatePath(`/dashboard/branches/${branchId}/accounts`);
  }

  return (
    <div className="p-6 space-y-6">
      <Link href={`/dashboard/branches/${branchId}`} className="flex items-center gap-2 text-blue-600 font-bold hover:underline mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-slate-800">{branch?.branch_name} - Accounts Documents</h1>

      {/* Add Account Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-blue-600">
          <Plus size={18} /> Add Account Document
        </h2>
        
        <form action={addAccount} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input name="accNo" placeholder="Account Number" className="border p-2 rounded-lg text-sm" />
          <input name="custNo" placeholder="Customer Name" className="border p-2 rounded-lg text-sm" required />
          
          <select name="billtype" className="border p-2 rounded-lg text-sm bg-white" required>
            <option value="">Select Bill Type</option>
            <option value="Electricity Bill">Electricity Bill</option>
            <option value="Water Bill">Water Bill</option>
            <option value="Telephone Bill">Telephone Bill</option>
            <option value="Router Bill">Router Bill</option>
            <option value="Courier Bill">Courier Bill</option>
            <option value="Vehicle Bill">Vehicle Bill</option>
            <option value="IOU Bill">IOU Bill</option>
            <option value="Other">Other</option>
          </select>

          <input name="amount" type="number" step="0.01" placeholder="Amount" className="border p-2 rounded-lg text-sm" required />
          <input name="date" type="date" className="border p-2 rounded-lg text-sm" required />

          {/* 🎯 ඉතාමත් වැදගත්: Component එකෙන් එවන පින්තූර දත්ත ග්‍රහණය කර ගැනීමට ඇති Hidden Fields */}
          <input id="hidden-bill-photo-input" name="billPhotoBase64" type="hidden" />
          <input id="hidden-bill-name-input" name="billPhotoName" type="hidden" />

          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Bill Attachment</label>
            <BillPhotoUploadPage />
          </div>

          <button type="submit" className="md:col-span-5 bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
            Submit Account Details
          </button>
        </form>
      </div>

      {/* Accounts List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Acc No</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Bill Type</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {branch?.accounts.map((acc) => (
              <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-700">{acc.account_number}</td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold uppercase">
                    {acc.bill_type}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold text-slate-800">Rs. {acc.amount.toLocaleString()}</td>
                <td className="p-4 text-sm text-slate-500">{acc.date}</td>
                <td className="p-4 text-right">
                  <ViewDocButton branchId={branchId} type="Account" refNo={acc.id.toString()} link={`/dashboard/branches/${branchId}/accounts/${acc.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {branch?.accounts.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">No account records found.</div>
        )}
      </div>
    </div>
  );
}