"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";

export default function RequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiUrl}/api/requests`)
            .then(res => res.json())
            .then(result => {
                if (result.success) setRequests(result.data);
                setLoading(false);
            });
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
            case "DECLINED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#051139] text-white rounded-2xl shadow-lg">
                    <ArrowRightLeft size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Document Requests</h1>
                    <p className="text-sm text-slate-500">Branch to Branch document movement history</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">From Branch</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">To Branch</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doc Type</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-10 text-center text-slate-400">Loading requests...</td></tr>
                        ) : requests.map((req: any) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4 text-sm font-semibold text-slate-700">{req.fromBranch.branch_name}</td>
                                <td className="p-4 text-sm font-semibold text-slate-700">{req.toBranch.branch_name}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                        {req.documentType}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(req.requestedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}