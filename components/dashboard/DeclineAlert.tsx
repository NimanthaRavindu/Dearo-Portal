import { AlertCircle,ArrowRightCircle } from "lucide-react"

interface DeclineAlertProps{ 
    branch : string;
    reason : string;
}

const DeclineAlert = ({branch,reason}:DeclineAlertProps) => {
  return (
    <div className="bg-red-50 p-6 rounded-[1.5rem] border border-red-100 flex gap-4 items-start shadow-sm shadow-red-50 animate-pulse-slow">
        <div className="bg-red-100 p-2 rounded-xl text-red-600">
            <AlertCircle size={24}/>
        </div>

        <div className="flex-1">
            <p className="text-xs font-black text-red-800 uppercase tracking-tighter">Decline Notice</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{branch}</p>
            <p className="text-[11px] font-medium text-red-600 mt-1 leading-relaxed">
                <strong>Note:</strong>{reason}
            </p>
            <button className="mt-3 flex items-center gap-2 text-[10px] font-black text-red-700 uppercase hover:underline">
                Resubmit Document<ArrowRightCircle size={14}/>
            </button>
        </div>
    </div>
  )
}

export default DeclineAlert