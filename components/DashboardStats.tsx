"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, FileCheck, Users, ArrowUpRight, TrendingUp, ChevronRight } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  color: string;
  bg: string;
  href?: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
  branches: any[];
}

export default function DashboardStats({ stats, branches }: DashboardStatsProps) {
  const [showBranches, setShowBranches] = useState(false);

  // ලේබල් එක අනුව නිවැරදි Icon එක තෝරාගැනීමේ function එක
  const getIcon = (label: string) => {
    switch (label) {
      case "Active Branches": return Building2;
      case "Total Documents": return FileCheck;
      case "Total Accounts": return Users;
      case "Total Loans": return ArrowUpRight;
      case "Total Investments": return TrendingUp;
      default: return FileCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = getIcon(stat.label);
          const isBranchCard = stat.label === "Active Branches";

          const handleCardClick = (e: React.MouseEvent) => {
            if (isBranchCard) {
              e.preventDefault();
              setShowBranches(!showBranches);
            }
          };

          return (
            <Link
              href={stat.href || "#"}
              key={stat.label}
              onClick={handleCardClick}
              className={`block rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 
                ${isBranchCard ? "cursor-pointer select-none hover:border-blue-400 dark:hover:border-blue-500" : "cursor-pointer"}
                ${isBranchCard && showBranches ? "ring-2 ring-blue-500/20 border-blue-500 bg-blue-50/10 dark:bg-blue-950/20" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg w-fit ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {isBranchCard && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                    {showBranches ? "Hide" : "View"}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-4 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value.toLocaleString()}</h3>
            </Link>
          );
        })}
      </div>

      {/* Branch Directory Table */}
      {showBranches && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Active Branch Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status of connected operational branches</p>
            </div>
            <button 
              onClick={() => setShowBranches(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Close Directory
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-24">Branch Code</th>
                  <th className="py-2.5 px-4">Branch Name</th>
                  <th className="py-2.5 px-4 text-right">Total Files</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {branches.map((branch) => {
                  const totalBranchFiles =
                    (branch._count?.documentRequest || 0) +
                    (branch._count?.accounts || 0) +
                    (branch._count?.loans || 0) +
                    (branch._count?.investments || 0);

                  return (
                    <tr 
                      key={branch.id} 
                      className="group transition-colors relative hover:bg-blue-50/40 dark:hover:bg-blue-950/10 cursor-pointer"
                    >
                      {/* Branch Code */}
                      <td className="py-3 px-4 font-mono font-bold">
                        <Link href={`/dashboard/branches/${branch.id}`} className="absolute inset-0 z-10" />
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-700 transition-colors">
                          {branch.branch_code}
                        </span>
                      </td>

                      {/* Branch Name */}
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {branch.branch_name}
                      </td>

                      {/* Total Files Count */}
                      <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                        {totalBranchFiles} <span className="text-[10px] text-slate-400 font-normal">files</span>
                      </td>

                      {/* Action Arrow Indicator */}
                      <td className="py-3 px-4 text-slate-300 group-hover:text-blue-500 transition-colors text-right">
                        <ChevronRight size={14} className="inline group-hover:translate-x-0.5 transition-transform" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}