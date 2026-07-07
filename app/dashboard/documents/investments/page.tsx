"use client";
import {useEffect,useState} from 'react';
import { Hash,TrendingUp,Filter,Download,UserCheck,Loader2 } from 'lucide-react';


export const Investmentpage = () => {

  const [investments,setInvestments] =useState([]);
  const [loading,setLoading] = useState(true);
  
  useEffect(() => {
    
     fetch('api/documents/investments')
     .then(res => res.json())
     .then(res =>{
        if(res.success) setInvestments(res.data);
        setLoading(false);
     });
  },[]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-purple-600"/>Investment Portfolios
            </h1>
            <p className="text-slate-500 text-sm">Review project and FD investment files</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((inv:any)=>(
                <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            {inv.type}
                        </span>
                        <span className="text-slate-300"><Hash size={16}/></span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-1">{inv.customer_name}</h3>

                    <div className="border-t pt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Date:{new Date(inv.uploadedAt).toLocaleDateString()}</span>
                        <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 transition">
                            <Download size={16}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
