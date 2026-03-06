"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Tractor, Lock, Mail, Key, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";

type AuthStep = "credentials" | "otp";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState<AuthStep>("credentials");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/assistant");
        }
    }, [isAuthenticated, router]);

    const handleCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const response = await api.post(endpoint, { email, password });
            setSuccessMsg(response.data?.message || "OTP sent to your email!");
            setStep("otp");
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const endpoint = isLogin ? "/api/auth/login-verify" : "/api/auth/register-verify";
            const response = await api.post(endpoint, { email, otp });
            const token = response.data?.token;
            const user = response.data?.user || { email };
            if (token) {
                login(token, user);
                router.push("/assistant");
            } else {
                setError("Verification successful but no token received. Please try logging in.");
                setStep("credentials");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            await api.post(endpoint, { email, password });
            setSuccessMsg("A new OTP has been sent to your email!");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep("credentials");
        setOtp("");
        setError(null);
        setSuccessMsg(null);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px]"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-forest-green/5 blur-[100px]"></div>
            </div>

            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/20 dark:border-white/5 bg-white/60 dark:bg-[#152e26]/60 backdrop-blur-xl px-10 py-4 shadow-sm relative z-20 transition-all">
                <Link href="/" className="flex items-center gap-4 text-forest-green dark:text-white group">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-inner group-hover:scale-105 transition-transform">
                        <Tractor className="h-6 w-6" />
                    </div>
                    <h2 className="text-forest-green dark:text-white text-2xl font-black leading-tight tracking-tight">Gram<span className="text-primary">Setu</span></h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-end gap-10 items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-slate-800 dark:text-slate-200 text-sm font-bold hover:text-primary transition-colors">Home</Link>
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-primary transition-colors" href="#">About</a>
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-primary transition-colors" href="#">Contact Support</a>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center relative w-full z-10 p-4 sm:p-8">
                <div className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <div className="hidden md:flex flex-col flex-1 max-w-lg gap-8 text-forest-green dark:text-white">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="rounded-[2rem] overflow-hidden shadow-2xl relative aspect-video w-full border-4 border-white/30 dark:border-white/10 dark:bg-surface-dark bg-white">
                                <img alt="Farmer holding a tablet" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAChwghJsN5ok2hlcmdhZ77Nck4IrNVAoQxanfh5T4oJ5eIt2fN7dQzkuVjRR1NXtPALaaT3Iea286idsbTMTSkDT8eP0cgkm0a3YumlQAYrc_w_bBXE4zKrVQBz_pCvGkd-5ysyFw4FlzUx-CuewDl8tgTdZmLyL1IRT24IVmQtE59JHDgxDMfSadkk72TnukxOC1gSmugLlKbGGiEMKLJ0KiQQ2WkyH1729-h_jDpCxdQOsh-HMZxXd2PPpDK49DD5LFW9PJ_m8Jj" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                    <p className="text-white font-medium text-xl leading-relaxed drop-shadow-lg">&quot;GramSetu helped me double my crop yield this season by giving me timely advice in my own language.&quot;</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <h3 className="text-4xl font-black mb-4 tracking-tight">Empowering<br /><span className="text-gradient">Rural India</span></h3>
                            <p className="text-lg opacity-80 leading-relaxed max-w-md">Connect with expert agricultural advice instantly using our AI voice assistant in your local dialect.</p>
                        </div>
                    </div>

                    <div className="w-full max-w-[460px] flex flex-col relative group perspective">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/30 to-accent/30 rounded-[2.5rem] blur opacity-50 z-0"></div>
                        <div className="glass dark:glass-dark rounded-[2rem] p-10 w-full relative z-10 shadow-2xl transition-all">
                            {step === "credentials" && (
                                <>
                                    <div className="text-center mb-10">
                                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-inner">
                                            <Lock className="h-8 w-8" />
                                        </div>
                                        <h1 className="text-forest-green dark:text-white tracking-tight text-3xl font-black leading-tight mb-3">
                                            {isLogin ? "Welcome Back" : "Create Account"}
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                            {isLogin ? "Login to access your personalized farming assistant." : "Register to start your journey with GramSetu."}
                                        </p>
                                    </div>

                                    <form onSubmit={handleCredentials} className="space-y-6">
                                        <div className="space-y-5">
                                            <div className="space-y-2 relative group">
                                                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1" htmlFor="email">Email Address</label>
                                                <div className="relative flex items-center">
                                                    <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border-2 border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm h-14 px-5 text-base font-medium placeholder:text-slate-400 transition-all hover:bg-white/80 dark:hover:bg-black/40 focus:bg-white dark:focus:bg-[#0a1511]" placeholder="Enter your email" />
                                                    <div className="absolute right-4 text-primary pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                                                        <Mail className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 relative group">
                                                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1" htmlFor="password">Password</label>
                                                <div className="relative flex items-center">
                                                    <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border-2 border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm h-14 px-5 text-base font-medium placeholder:text-slate-400 transition-all hover:bg-white/80 dark:hover:bg-black/40 focus:bg-white dark:focus:bg-[#0a1511]" placeholder="Enter your password" />
                                                    <div className="absolute right-4 text-primary pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                                                        <Key className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {error && <div className="text-red-500 text-sm font-medium bg-red-100/50 p-3 rounded-lg border border-red-200">{error}</div>}

                                        <button type="submit" disabled={loading} className="w-full mt-4 cursor-pointer flex items-center justify-center rounded-xl h-14 px-6 bg-gradient-to-r from-primary to-[#0ebf84] hover:to-[#0ca875] hover:scale-[1.02] active:scale-[0.98] transition-all text-white text-lg font-black leading-normal tracking-wide shadow-xl shadow-primary/30 disabled:opacity-70 disabled:hover:scale-100">
                                            <span>{loading ? "Processing..." : (isLogin ? "Send Login OTP" : "Register & Send OTP")}</span>
                                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                                        </button>

                                        <div className="relative flex py-4 items-center">
                                            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider bg-transparent">or</span>
                                            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                                        </div>

                                        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }} className="w-full cursor-pointer flex items-center justify-center rounded-xl h-12 px-4 bg-white/40 dark:bg-white/5 border-2 border-slate-300/50 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                                            {isLogin ? "Create an account" : "Login instead"}
                                        </button>

                                        <div className="text-center pt-2">
                                            <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                                                Back to Home
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            )}

                            {step === "otp" && (
                                <>
                                    <div className="text-center mb-10">
                                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center mb-6 text-primary shadow-inner">
                                            <ShieldCheck className="h-8 w-8" />
                                        </div>
                                        <h1 className="text-forest-green dark:text-white tracking-tight text-3xl font-black leading-tight mb-3">
                                            Verify OTP
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                            We&apos;ve sent a one-time password to<br />
                                            <span className="text-primary font-bold">{email}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleOtpVerify} className="space-y-6">
                                        <div className="space-y-2 relative group">
                                            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1" htmlFor="otp">Enter OTP</label>
                                            <div className="relative flex items-center">
                                                <input id="otp" name="otp" type="text" inputMode="numeric" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="form-input flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border-2 border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm h-14 px-5 text-center text-2xl font-black tracking-[0.5em] placeholder:text-slate-400 placeholder:text-base placeholder:tracking-normal placeholder:font-medium transition-all hover:bg-white/80 dark:hover:bg-black/40 focus:bg-white dark:focus:bg-[#0a1511]" placeholder="Enter 6-digit OTP" autoFocus />
                                                <div className="absolute right-4 text-primary pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>

                                        {successMsg && <div className="text-green-600 text-sm font-medium bg-green-100/50 p-3 rounded-lg border border-green-200 flex items-center gap-2"><ShieldCheck className="h-4 w-4 flex-shrink-0" />{successMsg}</div>}
                                        {error && <div className="text-red-500 text-sm font-medium bg-red-100/50 p-3 rounded-lg border border-red-200">{error}</div>}

                                        <button type="submit" disabled={loading || otp.length < 4} className="w-full mt-4 cursor-pointer flex items-center justify-center rounded-xl h-14 px-6 bg-gradient-to-r from-primary to-[#0ebf84] hover:to-[#0ca875] hover:scale-[1.02] active:scale-[0.98] transition-all text-white text-lg font-black leading-normal tracking-wide shadow-xl shadow-primary/30 disabled:opacity-70 disabled:hover:scale-100">
                                            <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
                                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                                        </button>

                                        <div className="flex items-center justify-between pt-2">
                                            <button type="button" onClick={handleBack} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                                                <ArrowLeft className="mr-1 h-4 w-4" /> Back
                                            </button>
                                            <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm font-bold text-primary hover:text-primary-dark transition-colors disabled:opacity-50">
                                                Resend OTP
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
