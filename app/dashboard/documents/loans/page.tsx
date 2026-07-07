"use client";
import { useEffect, useState } from "react";
import { FileText, ChevronRight, Loader2, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function LoanFilesPage() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiUrl}/api/documents/loans`)
            .then(res => res.json())
            .then(result => {
                if (result.success) setLoans(result.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/dashboard/documents">Documents</Link> <ChevronRight size={14} /> 
                <span className="text-slate-800 font-bold">Loan Files</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">Loan Document Management</h1>

            <div className="grid grid-cols-1 gap-4">
                {loans.map((loan: any, index: number) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center hover:shadow-md transition cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{loan.type} Loans</h3>
                                <p className="text-xs text-slate-400">System Verified</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">{loan.count} Files</span>
                            <ChevronRight size={20} className="text-slate-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}