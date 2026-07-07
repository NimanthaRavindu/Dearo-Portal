interface DocTypeCardProps{
    label:string;
    id:string;
}

const DocTypeCard = ({label,id}:DocTypeCardProps) => {
  return (
    <label htmlFor={id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group active:scale-95">
        <input type="checkbox" id={id} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"/>
        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{label}</span>
    </label>
  )
}

export default DocTypeCard