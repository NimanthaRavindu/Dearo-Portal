"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Branch {
  id: number;
  branch_name: string;
  branch_code: string;
}

interface BranchSearchProps {
  branches: Branch[];
}

export default function BranchSearch({ branches }: BranchSearchProps) {
  const [query, setQuery] = useState("");
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // පිටත ක්ලික් කළ විට ලැයිස්තුව වැසීමට
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // සෙවුම් තර්කනය (Search Logic)
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredBranches(branches); // හිස්ව ඇති විට සියලුම ශාඛා පෙන්වීමට
      return;
    }

    const results = branches.filter(
      (branch) =>
        branch.branch_name.toLowerCase().includes(query.toLowerCase()) ||
        branch.branch_code.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBranches(results);
  }, [query, branches]);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by branch name or code..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold shadow-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {/* සෙවුම් ප්‍රතිඵල සහ All Branches ලැයිස්තුව (Dropdown පමණි) */}
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-[999] max-h-[350px] overflow-y-auto">
          
          {/* "All Branches" විකල්පය - සැමවිටම ලැයිස්තුවේ ඉහළින් */}
          <div
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 group transition-colors"
            onClick={() => {
              router.push("/dashboard/all-branches");
              setIsOpen(false);
              setQuery("");
            }}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                <Search size={14} className="font-black" />
              </div>
              <div>
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-tight">
                  🌐 ALL BRANCHES OVERVIEW (A26)
                </p>
                <p className="text-[9px] font-bold text-slate-400 leading-none">View all branch documents & stats</p>
              </div>
            </div>
          </div>

          {/* Branches List*/}
          <div className="py-1">
            <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">Select Branch</p>
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex justify-between items-center group border-b border-slate-50 last:border-none"
                  onClick={() => {
                    router.push(`/dashboard/branches/${branch.id}`); //
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase">
                      {branch.branch_name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">{branch.branch_code}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    <Search size={12} />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No branches matching your search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}