"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    Activity, Bell, Pencil, BadgeCheck,
    Mail, ArrowRight, Tractor, LogOut,
    Loader2
} from "lucide-react";

interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    credit?: number;
    is_verified?: boolean;
}

function DashboardContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user) {
                    const res = await api.post(`/api/auth/getuser`);
                    if (res.data?.user) {
                        setProfile(res.data.user);
                    }
                }
            } catch (err) {
                console.warn("Could not fetch user profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const displayName = profile?.name || user?.name || user?.email?.split("@")[0] || "User";
    const displayEmail = profile?.email || user?.email || "—";
    const displayCredits = profile?.credit !== undefined ? profile.credit : 5;
    const isVerified = profile?.is_verified ?? false;

    return (
        <div className="bg-background-light dark:bg-[#0a1511] font-display text-text-main antialiased min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>

            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl px-6 py-3 shadow-sm transition-all">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-inner group-hover:scale-105 transition-transform">
                        <Tractor className="h-6 w-6" />
                    </div>
                    <h2 className="text-text-main dark:text-white text-xl font-black tracking-tight">Gram<span className="text-primary">Setu</span></h2>
                </Link>
                <nav className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold">Home</Link>
                    <div className="relative">
                        <span className="text-primary dark:text-primary text-sm font-bold">Dashboard</span>
                        <div className="absolute -bottom-4 left-0 w-full h-1 bg-primary rounded-t-full"></div>
                    </div>
                </nav>
                <div className="flex items-center gap-5">
                    <Link href="/assistant" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 hover:from-primary hover:to-primary-dark text-primary hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-primary/20 shadow-sm hover:shadow-lg hover:shadow-primary/30">
                        <Activity className="h-5 w-5" />
                        <span>Ask AI</span>
                    </Link>
                    <button className="flex items-center justify-center rounded-full size-11 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white relative shadow-inner">
                        <Bell className="h-5 w-5" />
                    </button>
                    <div className="hidden sm:flex items-center gap-3 pl-5 border-l border-gray-200 dark:border-gray-800">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-text-main dark:text-white">{displayName}</p>
                            <p className="text-xs text-text-secondary dark:text-gray-400 font-medium tracking-wide">{displayEmail}</p>
                        </div>
                        <div className="size-11 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg font-black border-2 border-primary/50">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight">My Profile</h1>
                        <p className="mt-2 text-text-secondary dark:text-gray-400 text-lg">Your account information and settings.</p>
                    </div>
                    <Link href="/assistant" className="sm:hidden flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">
                        <Activity className="h-5 w-5" />
                        <span>Ask AI Now</span>
                    </Link>
                </div>

                {loadingProfile ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/80 to-primary-dark flex items-center justify-center text-white text-5xl font-black border-4 border-white dark:border-gray-800 shadow-xl relative z-10">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 w-full text-center sm:text-left gap-2 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight">{displayName}</h2>
                                            <p className="text-primary font-bold tracking-wide mt-1">{displayEmail}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 ${isVerified ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30' : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'} rounded-full text-xs font-bold uppercase tracking-widest self-center sm:self-start flex items-center gap-1 border`}>
                                            <BadgeCheck className="h-4 w-4" /> {isVerified ? "Verified" : "Unverified"}
                                        </span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <Mail className="text-primary h-5 w-5 flex-shrink-0" />
                                            <span className="font-medium truncate">{displayEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <Activity className="text-primary h-5 w-5 flex-shrink-0" />
                                            <span className="font-medium">{displayCredits} AI Credits Left</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link href="/assistant" className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center gap-5">
                                <div className="size-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                                    <Activity className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-text-main dark:text-white text-lg">AI Assistant</h3>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">Ask anything about farming</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center gap-5">
                                <div className="size-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                                    <Pencil className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-text-main dark:text-white text-lg">Edit Profile</h3>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">Update your information</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <button onClick={handleLogout} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:border-red-300 transition-all hover:-translate-y-1 hover:shadow-xl group cursor-pointer flex items-center gap-5 w-full text-left">
                                <div className="size-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-inner">
                                    <LogOut className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-text-main dark:text-white text-lg">Log Out</h3>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">Sign out of your account</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
