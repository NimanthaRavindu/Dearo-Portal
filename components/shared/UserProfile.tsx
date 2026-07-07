"use client";
import React, { useState,useEffect } from 'react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User,ShieldCheck,Loader2 } from "lucide-react";
import Link from "next/link";




const UserProfile=()=> {
     const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
    const  [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // localStorage එකෙන් දත්ත ලබා ගැනීම
        const fetchUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUserData(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (isLoading) {
        return <Loader2 className="animate-spin text-slate-300" size={20} />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-14 w-full justify-start gap-4 px-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <Avatar className="h-10 w-10 rounded-xl border-2 border-white shadow-sm">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                            {userData?.name?.substring(0, 2).toUpperCase() || "US"}
                        </AvatarFallback>
                    </Avatar>
                    
                    {/* මෙහි පෙන්වන්නේ ලොගින් වූ පුද්ගලයාගේ (ඉෂාන් හෝ නිමන්ත) දත්ත පමණි */}
                    <div className="flex flex-col items-start text-left overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate w-full tracking-tight">
                            {userData?.name || "Guest User"}
                        </p>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1">
                            {userData?.role || "Visitor"}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 p-2 rounded-[1.5rem] shadow-2xl border-slate-100" align="end">
                <DropdownMenuLabel className="px-4 py-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">My Account</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{userData?.name}</p>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-slate-50" />
                
                <Link href={`/dashboard/profile`}>
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors group">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
                            <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-700">My Profile</span>
                    </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator className="bg-slate-50" />
                
                <Link href="/">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors group">
                        <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-white transition-colors">
                            <LogOut size={16} />
                        </div>
                        <span className="text-sm font-bold text-red-600 group-hover:text-red-700">Log out</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserProfile;