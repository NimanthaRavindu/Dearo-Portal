"use client";
import { useEffect, useState } from "react";
import { Wallet, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiUrl}/api/documents/accounts`)
            .then(res => res.json())
            .then(result => {
                if (result.success) setAccounts(result.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/dashboard/documents">Documents</Link> <ChevronRight size={14} /> 
                <span className="text-slate-800 font-bold">Account Files</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">Account Document Management</h1>

            <div className="grid grid-cols-1 gap-4">
                {accounts.map((acc: any, index: number) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center hover:border-green-300 transition cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{acc.type} Documents</h3>
                                <p className="text-xs text-slate-400">Updated: Real-time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold">{acc.count} Records</span>
                            <ChevronRight size={20} className="text-slate-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}