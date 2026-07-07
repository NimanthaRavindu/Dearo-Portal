"use client";

import React, { useState } from 'react';
import { Send, Loader2, Banknote, TrendingUp, PieChart, Calendar as CalendarIcon, Building2, Users } from 'lucide-react';

const BranchDetailsClient = ({ branch, allRequests }: { branch: any, allRequests: any[] }) => {
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // 1. පිටුව Refresh කළත් දත්ත ස්ථීරවම පාලනය කිරීමට මේවා State එකකට දාන්න
    const [accounts, setAccounts] = useState(branch.accounts || []);
    const [loans, setLoans] = useState(branch.loans || []);
    const [investments, setInvestments] = useState(branch.investments || []);

    const handleRequest = async (docNo: string, type: string) => {
        // තහවුරු කිරීමේ පණිවිඩයක්
        if (!confirm(`${docNo} අංකය සහිත ලේඛනය ඉදිරිපත් කිරීමට ඔබට සහතිකද?`)) return;

        setIsSubmitting(docNo);
        try {
            
            const response = await fetch('/api/document-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    docNumber: String(docNo),
                    documentType: type,
                    branchId: branch.id,
                }),
            });

            if (response.ok) {
                // 3. API එක සාර්ථක නම් පමණක් UI එකෙන් ස්ථීරවම ඉවත් කිරීම
                if (type === "ACCOUNT") {
                    setAccounts((prev: any[]) => prev.filter(acc => acc.account_number !== docNo));
                } else if (type === "LOAN") {
                    setLoans((prev: any[]) => prev.filter(loan => loan.contract_no !== docNo));
                } else if (type === "INVESTMENT") {
                    setInvestments((prev: any[]) => prev.filter(inv => inv.contract_no !== docNo));
                }
                
                alert("ලේඛනය සාර්ථකව ඉදිරිපත් කරන ලදී.");
            } else {
                alert("දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.");
            }
        } catch (error) {
            alert("Database සම්බන්ධතාවයේ ගැටලුවකි.");
        } finally {
            setIsSubmitting(null);
        }
    };

    // දිනය අනුව පෙරීම
    const filteredRequests = allRequests?.filter(req => {
        const reqDate = new Date(req.requestedAt).toISOString().split('T')[0];
        return reqDate === selectedDate;
    }) || [];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-8 italic">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b pb-6">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-800">
                    <Building2 size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800">{branch.name}</h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{branch.code}</p>
                </div>
            </div>

            {/* Pending Sections */}
            <div className="grid md:grid-cols-2 gap-10">
                
                {/* ACCOUNTS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-blue-600 pb-2">
                        <Users className="text-blue-600" size={20} />
                        <h2 className="text-sm font-black text-slate-800 uppercase italic">Pending Accounts</h2>
                    </div>
                    <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xl">
                        <table className="w-full">
                            <tbody className="divide-y divide-slate-100 italic">
                                {accounts.length > 0 ? accounts.map((acc: any) => (
                                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-700">{acc.account_number}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleRequest(acc.account_number, "ACCOUNT")}
                                                disabled={isSubmitting === acc.account_number}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50"
                                            >
                                                {isSubmitting === acc.account_number ? <Loader2 size={12} className="animate-spin" /> : "Submit"}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td className="p-4 text-center text-slate-400 text-xs">No pending accounts</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* LOANS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-emerald-600 pb-2">
                        <Banknote className="text-emerald-600" size={20} />
                        <h2 className="text-sm font-black text-slate-800 uppercase italic">Pending Loans</h2>
                    </div>
                    <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xl">
                        <table className="w-full">
                            <tbody className="divide-y divide-slate-100 italic">
                                {loans.length > 0 ? loans.map((loan: any) => (
                                    <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-700">{loan.contract_no}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleRequest(loan.contract_no, "LOAN")}
                                                disabled={isSubmitting === loan.contract_no}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 disabled:opacity-50"
                                            >
                                                {isSubmitting === loan.contract_no ? <Loader2 size={12} className="animate-spin" /> : "Submit"}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td className="p-4 text-center text-slate-400 text-xs">No pending loans</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* INVESTMENTS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-purple-600 pb-2">
                        <TrendingUp className="text-purple-600" size={20} />
                        <h2 className="text-sm font-black text-slate-800 uppercase italic">Pending Investments</h2>
                    </div>
                    <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xl">
                        <table className="w-full">
                            <tbody className="divide-y divide-slate-100 italic">
                                {investments.length > 0 ? investments.map((inv: any) => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 font-bold text-slate-700">{inv.contract_no}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleRequest(inv.contract_no, "INVESTMENT")}
                                                disabled={isSubmitting === inv.contract_no}
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-purple-200 disabled:opacity-50"
                                            >
                                                {isSubmitting === inv.contract_no ? <Loader2 size={12} className="animate-spin" /> : "Submit"}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td className="p-4 text-center text-slate-400 text-xs">No pending loans</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BranchDetailsClient;