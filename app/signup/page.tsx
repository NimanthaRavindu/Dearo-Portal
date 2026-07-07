import { prisma } from "@/lib/db";
import { User, CreditCard, Mail, Lock, Building2, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Link from "next/link"; 

export default async function SignupPage() {
  const branches = await prisma.branch.findMany({
    select: {
      id: true,
      branch_name: true,
    },
    orderBy: {
      branch_name: "asc",
    },
  });

  async function createUser(formData: FormData) {
    "use server";

    const fullName = formData.get("name") as string;
    const nicNumber = formData.get("nic") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const branchIdStr = formData.get("branchId") as string;

    const role = formData.get("role") as Role; 

    if (!fullName || !nicNumber || !email || !password || !branchIdStr || !role) {
      return;
    }

    const branchId = parseInt(branchIdStr);

    await prisma.user.create({
      data: {
        name: fullName,
        nic: nicNumber,
        email: email,
        password: password,
        role: role,
        branchId: branchId,
      },
    });

    redirect("/");
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/back2.gif')" }}
    >
      
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      <div className="w-full max-w-md bg-[#0b1329]/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl z-10">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)] mb-4">
            <User size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join Dearo Investment Portal</p>
        </div>

        {/* Signup Form */}
        <form action={createUser} className="space-y-5">
          
          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-slate-500 w-5 h-5" />
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* NIC Number Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">NIC Number</label>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-3 text-slate-500 w-5 h-5" />
              <input
                name="nic"
                type="text"
                placeholder="199512345678"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-500 w-5 h-5" />
              <input
                name="email"
                type="email"
                placeholder="john.d@example.com"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* Select Branch Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Branch</label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-3 text-slate-500 w-5 h-5 pointer-events-none" />
              <select
                name="branchId"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                required
                defaultValue=""
              >
                <option value="" disabled className="bg-[#0b1329] text-slate-500">
                  Choose your branch...
                </option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id} className="bg-[#0b1329] text-white">
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none text-slate-500 text-[10px]">▼</div>
            </div>
          </div>

          {/* User Role Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Role</label>
            <div className="relative flex items-center">
              <Shield className="absolute left-3 text-slate-500 w-5 h-5 pointer-events-none" />
              <select
                name="role"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                required
                defaultValue=""
              >
                <option value="" disabled className="bg-[#0b1329] text-slate-500">
                  Choose User Role...
                </option>
                <option value="USER" className="bg-[#0b1329] text-white">Standard User</option>
                <option value="MANAGER" className="bg-[#0b1329] text-white">Manager</option>
                <option value="ADMIN" className="bg-[#0b1329] text-white">Administrator</option>
              </select>
              <div className="absolute right-4 pointer-events-none text-slate-500 text-[10px]">▼</div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-500 w-5 h-5" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#111c44]/50 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.99]"
          >
            SIGN UP
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/80">
          Already have an account? <Link href="/" className="text-blue-300 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}