'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use, useTransition } from "react";
import { ArrowLeft, AlertCircle, RefreshCw, Check, X, FileText,Loader2, Info, Tag, Calendar, Activity, Clock, CheckCircle2 } from "lucide-react";

interface DocumentItem {
    id:number,
    docNumber:string,
    documentType:string;
    status:string;
    createdAt:string;

}

interface PageProps {
    params: Promise<{ type: string }>;
    initialData:DocumentItem[];
    typeTitle:string;
}

export default function DocumentTypePage({ params,initialData,typeTitle }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);
    const type = resolvedParams.type;

    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [datalist,setDataList] = useState<DocumentItem[]>(Array.isArray(initialData) ? initialData : []);
    const [isPending,startTransition] = useTransition();

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!type) return;

            try {
                setLoading(true);
                setError(null);

                
                const response = await fetch(`/api/document-request?type=${type}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                setDocuments(data);
            } catch (err: any) {
                console.error("Fetch Error:", err.message);
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [type]);

    const deleteAction = async (documentId: number, docNumber:string, action: "SUBMIT" | "DECLINE") => {
      
      if (isPending) return;
      
      const isConfirmed = window.confirm(
        action === "SUBMIT"
            ?`${docNumber} අංකය සහිත ලේඛනය ඉදිරිපත් කිරීමට ඔබට සහතිකද?`
            :`${docNumber} අංකය සහිත ලේඛනය ප්‍රතික්ෂේප කිරීමට ඔබට සහතිකද?`
        );

      if (!isConfirmed) return;

    
      const previousData = [...datalist];
      setDataList((prev) => prev.filter((item) => item.id !== documentId));
    
      startTransition(async () => {
         try {
                setActionLoading(documentId);
                
                const response = await fetch("/api/documents/delete", {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: Number(documentId),
                    }),
                });

                
                if (response.ok ) {
                    const result = await response.json();
                    
                    if (result.success) {    
                        alert(`${docNumber} අංකය සහිත ලේඛනය සාර්ථකව ඉදිරිපත් කරන ලදී.`);                    
                        router.refresh();
                        return;
                    } 
                } else {
                    
                    setDataList(previousData);
                    alert("ලේඛනය ඉවත් කිරීමට අපොහොසත් විය. කරුණාකර නැවත උත්සාහ කරන්න.");
                }
            } catch (error) {
                setDataList(previousData);
                alert("දෝෂයක් සිදු විය! කරුණාකර නැවත උත්සාහ කරන්න.");
            }
            finally{
                setActionLoading(null);
            }
      })
      
  };

  if (loading) {
        return(
            <div className="flex h-screen items-center justify-center font-bold text-slate-400 uppercase italic">
                <Loader2 className="animate-spin text-blue-600 " />Loading Records...
            </div>
        );    
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-slate-900 pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                        <FileText size={30}/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                            {type}   REQUESTS
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-widest">Document Management System</p>
                    </div>
                </div>
                <Link href="/dashboard" className="flex items-center gap-2 text-xs font-black uppercase italic text-slate-400 hover:text-slate-900">
                  <ArrowLeft size={16}/>Back                 
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-slate-200 rounded-[2.5rem] bg-white shadow-2xl">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] italic">
                            <th className="px-10 py-6"><Info size={14} className="inline mr-2"/>Document Details</th>
                            <th className="px-10 py-6"><Tag size={14} className="inline mr-2"/>Type</th>
                            <th className="px-10 py-6"><Calendar size={14} className="inline mr-2"/>Submitted Date</th>
                            <th className="px-10 py-6"><Activity size={14} className="inline mr-2"/>Status</th>
                            <th className="px-10 py-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic">
                        {documents.length > 0 ? (
                            documents.map((doc) =>(
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors"> 
                                   <td className="px-10 py-7">
                                      <div className="flex flex-col">
                                        <span className="font-black text-slate-700 text-sm">#{doc.docNumber}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">ID:{doc.id}</span>
                                      </div>
                                   </td>
                                   <td className="px-10 py-7">
                                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-200">{doc.documentType}</span>
                                   </td>
                                   <td className="px-10 py-7 text-slate-400 text-xs font-bold uppercase">
                                      {new Date(doc.createdAt || Date.now()).toLocaleDateString('en-GB')}
                                   </td> 
                                   <td className="px-10 py-7">
                                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${doc.status === 'PENDING' } `}>
                                        {doc.status === 'PENDING' ? <Clock size={12} className="animate-pulse"/>:<CheckCircle2 size={12}/>}
                                        {doc.status}
                                      </span>
                                   </td>
                                   <td className="px-10 py-7">
                                     <div className="flex items-center justify-center gap-4">
                                        <button 
                                           onClick={() => deleteAction(doc.id,doc.docNumber,'SUBMIT')}
                                           disabled={isPending}
                                           className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black"
                                        >
                                           {actionLoading === doc.id ? <Loader2 size={12} className="animate-spin"/>:<Check size={14}/>}Submit
                                        </button>
                                        <button 
                                           disabled={isPending}
                                           onClick={() => deleteAction(doc.id,doc.docNumber,'DECLINE')}
                                           className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black"
                                        >
                                           {actionLoading === doc.id ? <Loader2 size={12} className="animate-spin"/>:<X size={14}/>}Decline
                                        </button>
                                     </div>
                                   </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan={5} className="px-10 py-28 text-center text-slate-300 font-black uppercase text-xs tracking-[0.3em]">
                                    No records found in database
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}