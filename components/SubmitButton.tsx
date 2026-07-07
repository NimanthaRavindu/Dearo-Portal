"use client";

import { useState } from "react";
import { LayoutDashboard, LogOut, Settings, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ branches, nic, password }: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: `/dashboard?nic=${nic}&password=${password}`, active: true },
    { name: "Settings", icon: Settings, href: `/dashboard/settings?nic=${nic}&password=${password}`, active: false },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-md border border-slate-700"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Layout */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out border-r border-slate-800
        lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Mobile Close Button */}
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute right-4 top-4 p-1 hover:bg-slate-800 rounded-md">
          <X size={20} />
        </button>

        <div className="flex flex-col h-full">
          {/* Brand Identity */}
          <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-white font-black text-lg tracking-tight leading-none uppercase">Dearo App</h1>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Management v1.0</span>
            </div>
          </div>

          {/* Navigation Area */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={19} className={item.active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} />
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            ))}

            {/* Branch Selector Section */}
            <div className="pt-6 px-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Branch</span>
              <div className="mt-3 relative group">
                <select className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-xl px-4 py-3 appearance-none outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer">
                  <option value="">Choose Branch...</option>
                  {branches.map((b: any) => (
                    <option key={b.id} value={b.id} className="bg-slate-900">{b.branch_name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400" />
              </div>
            </div>
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-slate-800/50">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl font-bold transition-all group">
              <LogOut size={19} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}