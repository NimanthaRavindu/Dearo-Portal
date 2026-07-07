"use client";

import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Shield, IdCard, ArrowLeft, 
  Loader2, Camera, Calendar, CheckCircle2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserType {
    name: string;
    role: string;
    nic: string;
    email?: string;
    createdAt?: string;
}

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("User data parsing error:", error);
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Profile</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans italic">
            {/* Top Navigation */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Account</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
                {/* Profile Header Card */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="h-40 w-40 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-1">
                                <div className="h-full w-full bg-slate-900 rounded-full flex items-center justify-center text-white text-5xl font-black border-4 border-slate-800">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-full border-4 border-slate-900 shadow-lg">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="text-center md:text-left space-y-3">
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                                {user?.name || "Member Name"}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {user?.role || "USER"}
                                </span>
                                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    Verified Status
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard 
                        icon={<User className="text-blue-500" size={20} />} 
                        label="Full Name" 
                        value={user?.name || "Not Set"} 
                        subValue="Official System Name"
                    />
                    <InfoCard 
                        icon={<IdCard className="text-indigo-500" size={20} />} 
                        label="NIC Number" 
                        value={user?.nic || "Not Registered"} 
                        subValue="National Identity"
                    />
                    <InfoCard 
                        icon={<Shield className="text-purple-500" size={20} />} 
                        label="Designation" 
                        value={user?.role || "USER"} 
                        subValue="System Role Tier"
                        isHighlight
                    />
                    <InfoCard 
                        icon={<Mail className="text-rose-500" size={20} />} 
                        label="Email Address" 
                        value={user?.email || "No Email Provided"} 
                        subValue="Communication Contact"
                    />
                    <InfoCard 
                        icon={<Calendar className="text-amber-500" size={20} />} 
                        label="Member Since" 
                        value={user?.createdAt || "April 2026"} 
                        subValue="Account Created"
                    />
                    {/* Status Card */}
                    <div className="bg-white p-7 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col justify-center items-center text-center space-y-2">
                        <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection Status</p>
                        <p className="text-sm font-black text-emerald-600 uppercase italic tracking-tighter">Secure & Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Professional InfoCard Component
const InfoCard = ({ icon, label, value, subValue, isHighlight = false }: any) => (
    <div className={`bg-white p-7 rounded-[2rem] border transition-all hover:shadow-xl group ${isHighlight ? 'border-blue-100' : 'border-slate-200/60'}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {icon}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="space-y-1">
            <p className={`text-lg font-black uppercase tracking-tight ${isHighlight ? 'text-blue-600' : 'text-slate-800'} break-words`}>
                {value}
            </p>
            <p className="text-[9px] font-bold text-slate-300 uppercase italic tracking-tighter">{subValue}</p>
        </div>
    </div>
);

export default ProfilePage;