"use client";
import { Printer } from "lucide-react"

const PrintButton = () => {
  return (
    <button onClick={() => window.print()} className="flex items-center gap-2 bg-[#051139] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all print:hidden shadow-lg shadow-blue-900/20">
        <Printer size={18}/>
    </button>
  )
}

export default PrintButton