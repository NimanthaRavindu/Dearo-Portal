"use client";

import { useState } from 'react';
import { Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AccountSettings() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        
        if (!newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: "කරුණාකර මුරපද ඇතුළත් කරන්න." });
            return;
        }

        
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: "මුරපද දෙක එකිනෙකට නොගැලපේ." });
            return;
        }

        setLoading(true);

        try {
            
            const response = await fetch("/api/settings", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: "මුරපදය සාර්ථකව යාවත්කාලීන විය!" });
                setNewPassword("");
                setConfirmPassword("");
            } else {
                
                setMessage({ type: 'error', text: data.message || "යාවත්කාලීන කිරීම අසාර්ථකයි." });
            }
        } catch (error : any) {
            console.error("DATABASE ERROR:", error);
            setMessage({ type: 'error', text: "Internal Server Error: සර්වර් එක සමඟ සම්බන්ධ විය නොහැක." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Lock className="text-blue-600" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
                    <p className="text-slate-500">Manage your security settings</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Lock size={18} /> Change Password
                    </h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
                    {/* Message Box */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${
                            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-blue-300"
                    >
                        <Save size={18} />
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}