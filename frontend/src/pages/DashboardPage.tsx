import { Link } from "react-router-dom";
import {
    Activity, Bell, Pencil, BadgeCheck, Phone, MapPin,
    Languages, Mail, ArrowRight, FileText, FileSpreadsheet,
    Download, ShieldCheck, AlertTriangle, Rocket, Headset, HelpCircle, Tractor
} from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="bg-background-light dark:bg-[#0a1511] font-display text-text-main antialiased min-h-screen flex flex-col relative overflow-hidden">
            {/* Subtle background ambient lights */}
            <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>

            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl px-6 py-3 shadow-sm transition-all">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-inner group-hover:scale-105 transition-transform">
                        <Tractor className="h-6 w-6" />
                    </div>
                    <h2 className="text-text-main dark:text-white text-xl font-black tracking-tight">Gram<span className="text-primary">Setu</span></h2>
                </Link>
                <nav className="hidden md:flex items-center gap-10">
                    <a className="text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold" href="#">Home</a>
                    <div className="relative">
                        <a className="text-primary dark:text-primary text-sm font-bold" href="#">Dashboard</a>
                        <div className="absolute -bottom-4 left-0 w-full h-1 bg-primary rounded-t-full"></div>
                    </div>
                    <a className="text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold" href="#">Beneficiaries</a>
                    <a className="text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold" href="#">Schemes</a>
                </nav>
                <div className="flex items-center gap-5">
                    <Link to="/assistant" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 hover:from-primary hover:to-primary-dark text-primary hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-primary/20 shadow-sm hover:shadow-lg hover:shadow-primary/30">
                        <Activity className="h-5 w-5" />
                        <span>Ask AI</span>
                    </Link>
                    <button className="flex items-center justify-center rounded-full size-11 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white relative shadow-inner">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2.5 right-2.5 size-2.5 bg-accent rounded-full border-2 border-surface-light dark:border-surface-dark animate-pulse"></span>
                    </button>
                    <div className="hidden sm:flex items-center gap-3 pl-5 border-l border-gray-200 dark:border-gray-800">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-text-main dark:text-white">Ramesh Kumar</p>
                            <p className="text-xs text-text-secondary dark:text-gray-400 font-medium tracking-wide uppercase">Sarpanch</p>
                        </div>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-11 border-2 border-primary/50 p-0.5">
                            <div className="w-full h-full rounded-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDMD79Sk5Hs2VLjdjhuw5iMVdrJ_nYLzdc49VqCPJBmu9BroWJeEzY4-WZlufHPQ5rhadp6O4TQApZSLgs-r9cGZik_zur_YfpHLz5TRR42fYss1UqNNf55z4HoKnT6o4r5wXsJJvEIf7jY0kXY8NeIIlssuwvvPatVXPJG1mqRl2gYtNo6xKoZkqTYhgKPeTLG1agxBde-Flg_ASJvMNgKzXObN3X1T15kATtbMcHyCbc_A6ySCgAJVvpTxYvyfQ1y6C6a2rTK5WsS")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight">Overview Dashboard</h1>
                        <p className="mt-2 text-text-secondary dark:text-gray-400 text-lg">Manage your Gram Panchayat operations and access AI tools.</p>
                    </div>

                    <Link to="/assistant" className="sm:hidden flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">
                        <Activity className="h-5 w-5" />
                        <span>Ask AI Now</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:border-gray-700">
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                                <div className="relative group perspective">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                                    <div className="bg-center bg-no-repeat bg-cover rounded-full w-36 h-36 border-4 border-white dark:border-gray-800 shadow-xl relative z-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPhOod14EiyecHU7NOlmVsStBb_ae345nIDJWXbeBVDsjUtY1hp06poXTWXtLZi2OfEHP_r3VO1kYfyQI0aoxCFBa8-Gaz8WHvHPfbHO3VbAmpV8y0PVwjVuRoLeBRX9uSk24LZTy-RxryfmazaYM4gSDMM1IVFDdxLAV80PXEgXM9pdQHl1K5UHqrzrf6WpUehjSeLw1wqPbGMbLalitl9NA0Vs1tNwKZN0LQz3c7DeAfw5a-Ql3_tznkS8Wllwp3De3QakGKDYot")' }}></div>
                                    <button className="absolute bottom-1 right-1 bg-gradient-to-r from-primary to-primary-dark hover:scale-110 text-white rounded-full p-2.5 shadow-xl transition-transform z-20">
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex flex-col flex-1 w-full text-center sm:text-left gap-2 pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-3xl font-black text-text-main dark:text-white tracking-tight">Ramesh Kumar</h2>
                                            <p className="text-primary font-bold tracking-wide mt-1">Gram Pradhan • ID: GP-2024-889</p>
                                        </div>
                                        <span className="px-4 py-1.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-widest self-center sm:self-start flex items-center gap-1 border border-green-200 dark:border-green-500/30">
                                            <BadgeCheck className="h-4 w-4" />
                                            Verified
                                        </span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <Phone className="text-primary h-5 w-5" />
                                            <span className="font-medium">+91 98765 43210</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <MapPin className="text-primary h-5 w-5" />
                                            <span className="font-medium">Varanasi District, UP</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <Languages className="text-primary h-5 w-5" />
                                            <span className="font-medium">Hindi (Primary), English</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-secondary dark:text-gray-300 bg-gray-50 dark:bg-[#11241d] p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                            <Mail className="text-primary h-5 w-5" />
                                            <span className="font-medium">ramesh.k@gramsetu.in</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-text-main dark:text-white">Recent Documents</h2>
                                <button className="text-primary hover:text-primary-dark font-bold text-sm flex items-center gap-1 bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                                    View All <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-background-light dark:bg-[#11241d] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group cursor-pointer hover:-translate-y-1 hover:shadow-md">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl text-red-600 dark:text-red-400 shadow-inner group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">PM-KISAN Application Form</h3>
                                            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 font-medium">Generated on Oct 15, 2023 • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <button className="p-3 text-text-secondary hover:text-white hover:bg-primary dark:hover:bg-primary rounded-full transition-all shadow-sm">
                                        <Download className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5 bg-background-light dark:bg-[#11241d] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group cursor-pointer hover:-translate-y-1 hover:shadow-md">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">Soil Health Card Report</h3>
                                            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 font-medium">Generated on Sep 28, 2023 • 1.1 MB</p>
                                        </div>
                                    </div>
                                    <button className="p-3 text-text-secondary hover:text-white hover:bg-primary dark:hover:bg-primary rounded-full transition-all shadow-sm">
                                        <Download className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5 bg-background-light dark:bg-[#11241d] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group cursor-pointer hover:-translate-y-1 hover:shadow-md">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-xl text-green-600 dark:text-green-400 shadow-inner group-hover:scale-110 transition-transform">
                                            <FileSpreadsheet className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">Beneficiary List - MNREGA</h3>
                                            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 font-medium">Generated on Aug 10, 2023 • 4.8 MB</p>
                                        </div>
                                    </div>
                                    <button className="p-3 text-text-secondary hover:text-white hover:bg-primary dark:hover:bg-primary rounded-full transition-all shadow-sm">
                                        <Download className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div>
                                    <p className="text-xs font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-1">Current Plan</p>
                                    <h3 className="text-3xl font-black text-text-main dark:text-white">Gram<br />Panchayat</h3>
                                </div>
                                <div className="bg-primary/10 text-primary dark:text-primary p-3 rounded-xl shadow-inner">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                            </div>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-semibold text-text-secondary dark:text-gray-400">License Status</span>
                                    <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-500/20 px-3 py-1 rounded-full">Active</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-semibold text-text-secondary dark:text-gray-400">Next Billing</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white">Nov 01, 2024</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-base font-bold text-text-main dark:text-white">Active Users</span>
                                        <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">480 / 500</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full relative">
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-3 font-medium flex items-center gap-1.5">
                                        <AlertTriangle className="text-accent h-4 w-4" />
                                        Limits almost reached. <a href="#" className="text-primary hover:underline">Upgrade</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-forest-green to-[#082218] rounded-[2rem] p-8 shadow-2xl shadow-forest-green/20 text-white border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-[50px] group-hover:bg-accent/30 transition-colors duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/30 transition-colors duration-500"></div>

                            <div className="relative z-10">
                                <div className="size-14 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-accent/30 transform group-hover:rotate-12 transition-transform duration-300">
                                    <Rocket className="text-white h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-3">Upgrade to Premium AI</h3>
                                <p className="text-white/70 text-base mb-8 leading-relaxed font-medium">
                                    Unlock unlimited accounts, drone analytics, and priority voice support for your entire village.
                                </p>
                                <button className="w-full bg-accent hover:bg-orange-500 text-white font-black text-lg py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-accent/40">
                                    Upgrade Now
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                            <h3 className="font-black text-text-main dark:text-white mb-6 text-xl">Need Help?</h3>
                            <div className="flex flex-col gap-4">
                                <a className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group border border-gray-100 dark:border-gray-700 hover:border-primary/20" href="#">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl text-text-secondary group-hover:text-primary shadow-sm transition-colors">
                                        <Headset className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="block text-base font-bold text-text-main dark:text-white">Contact Support</span>
                                        <span className="text-sm text-text-secondary dark:text-gray-400">24/7 technical help</span>
                                    </div>
                                </a>
                                <a className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group border border-gray-100 dark:border-gray-700 hover:border-primary/20" href="#">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl text-text-secondary group-hover:text-primary shadow-sm transition-colors">
                                        <HelpCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="block text-base font-bold text-text-main dark:text-white">FAQs & Tutorials</span>
                                        <span className="text-sm text-text-secondary dark:text-gray-400">Learn how to use GramSetu</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
