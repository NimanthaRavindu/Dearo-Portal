import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Globe, Bell, LogOut } from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import BranchSearch from './BranchSearch';
import UserProfile from './UserProfile';


const prisma = new PrismaClient();

const Navbar = async () => {
    const branches = await prisma.branch.findMany() as any[];

    return (
        <header className="w-full sticky top-0 z-50 shadow-md">
            {/* Top Bar */}
            <div className="w-full bg-[#1e2a3b] text-white py-1.5 px-6 lg:px-16 flex justify-between items-center text-[12px] print:hidden">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-blue-400" />
                        <Link href="https://www.dearoinvestment.com/contact" className="hover:text-blue-400 transition-colors">011 478 2400</Link>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Mail size={14} className="text-blue-400" />
                        <span>
                            <Link href="https://www.dearoinvestment.com" className="hover:text-blue-400 transition-colors">info@dearoinvestment.com</Link>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 text-white cursor-pointer hover:text-blue-400 transition-colors">
                        <Globe size={14} className="text-blue-400" />
                        <span>English</span>
                    </div>
                    <Link href="/" className="flex items-center gap-2 font-bold hover:text-red-400 transition-colors">
                        <LogOut size={14} />
                        Logout
                    </Link>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 px-6 lg:px-16 flex items-center justify-between transition-colors duration-300 print:hidden">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative w-11 h-11 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-100 dark:border-slate-700">
                        <Image src="/dearo2.png" alt="Logo" width={40} height={40} className="object-contain" />
                    </div>
                    <div className="flex flex-col uppercase">
                        <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">DEARO</span>
                        <span className="text-[10px] font-bold text-blue-600 tracking-wider">Investment Limited</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6 ">
                    
                        <BranchSearch branches={branches} />
                    
                    <div className="flex items-center gap-6">
                        
                        <button className="relative p-2 text-slate-400 dark:text-slate-300 hover:text-blue-600 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900">
                                2
                            </span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                        <UserProfile />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;