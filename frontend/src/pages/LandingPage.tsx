import { Link } from "react-router-dom";
import {
    Tractor, Mic, Rocket, PlayCircle, Activity, BadgeCheck, Users,
    Megaphone, Wallet, Compass, FilePlus, ArrowRight, Download, Handshake
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-forest-green antialiased">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                {/* Navbar */}
                <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/20 dark:border-white/5 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl px-6 py-4 lg:px-20 transition-all shadow-sm">
                    <div className="flex items-center gap-3 text-forest-green dark:text-white group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shadow-inner group-hover:scale-105 transition-transform duration-300">
                            <Tractor className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-forest-green dark:text-white">Gram<span className="text-primary">Setu</span></h2>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center gap-10">
                        <a className="text-sm font-semibold hover:text-primary dark:text-slate-300 transition-colors text-forest-green/80" href="#features">Features</a>
                        <a className="text-sm font-semibold hover:text-primary dark:text-slate-300 transition-colors text-forest-green/80" href="#impact">Impact</a>
                        <a className="text-sm font-semibold hover:text-primary dark:text-slate-300 transition-colors text-forest-green/80" href="#roadmap">Roadmap</a>
                        <a className="text-sm font-semibold hover:text-primary dark:text-slate-300 transition-colors text-forest-green/80" href="#about">About Us</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="flex items-center justify-center rounded-xl bg-gradient-to-r from-primary flex-none to-primary-dark px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="mr-1">Launch App</span>
                            <Rocket className="h-4 w-4" />
                        </Link>
                    </div>
                </header>

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-[#0a1511] px-6 py-16 lg:px-20 lg:py-28">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[80px] animate-pulse-slow"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                        <div className="container mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div className="flex flex-col gap-6 text-left relative z-10">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest shadow-[0_0_15px_rgba(17,212,147,0.15)]">
                                    <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                                    AI for Rural India
                                </div>
                                <h1 className="text-5xl font-black leading-[1.15] tracking-tight text-forest-green dark:text-white lg:text-[4.5rem]">
                                    GramSetu: <br />
                                    <span className="text-gradient font-black">Giving Voice</span> to Rural India
                                </h1>
                                <p className="text-lg leading-relaxed text-forest-green/70 dark:text-slate-300 lg:text-xl max-w-[540px]">
                                    Bridging the digital gap for millions of farmers with AI-powered vernacular voice assistance. Access schemes, market prices, and farming advice in your local dialect seamlessly.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <Link to="/login" className="flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-primary/50 relative overflow-hidden group">
                                        <span className="relative z-10">Get Started Now</span>
                                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    </Link>
                                    <button className="flex items-center justify-center rounded-xl border-2 border-forest-green/10 dark:border-white/10 glass dark:glass-dark px-8 py-3.5 text-base font-bold text-forest-green dark:text-white hover:bg-forest-green/5 dark:hover:bg-white/5 transition-all hover:-translate-y-1">
                                        Watch Demo
                                        <PlayCircle className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative mx-auto w-full max-w-[600px] lg:ml-auto z-10 animate-float">
                                <div
                                    className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl shadow-forest-green/20 ring-1 ring-white/20 border-8 border-white dark:border-surface-dark"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1NJn-mmqM65lqhD6PsiqhJm4UVvO5ni3KwXyxszttohX0udBbrQMjeFuZ2MbWX9EX6uqj-gCnwyMRx4NZmvpZ5eGil32BZ_ZVpeyBTeu8e0sKluC2gUmHgPVi_tp4R9X7kne_8pRIn2lk3B4Nj-MdgMBHgXgmuPzOFR3a4uQSwG-NT5yEt4vAeC4yxb_kZvo-E85OW-V_yprloWowTnyNjpMeVB2sVgCVb-ogQzBauw1mV4L2hwKMPxJrD_QgPAReCDwsLdInE2tw')", backgroundSize: "cover", backgroundPosition: "center" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-forest-green/90 via-forest-green/20 to-transparent"></div>

                                    {/* Floating glassmorphism card over image */}
                                    <div className="absolute bottom-6 left-6 right-6 rounded-2xl glass p-5 dark:glass-dark border border-white/40 shadow-2xl transform transition-transform hover:scale-[1.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary animate-glow">
                                                <Activity className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Voice Assistant Active</p>
                                                <p className="text-sm font-bold text-forest-green dark:text-white line-clamp-2 leading-tight mt-1">"Can you show me PM Kisan Samman Nidhi Yojana details?"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative floating elements */}
                                <div className="absolute -top-6 -right-6 glass dark:glass-dark p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                                    <BadgeCheck className="text-green-500 h-8 w-8" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Trusted By</p>
                                        <p className="text-sm font-black text-forest-green dark:text-white">100K+ Farmers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section with glass cards */}
                    <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0d1c16] px-6 py-16 lg:px-20 relative z-20" id="impact">
                        <div className="container mx-auto">
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="group flex flex-col items-center text-center gap-3 rounded-3xl bg-background-light dark:bg-surface-dark px-6 py-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 dark:border-gray-800">
                                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg text-secondary group-hover:scale-110 transition-transform duration-300">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <p className="text-5xl font-black tracking-tight text-forest-green dark:text-white">488<span className="text-primary">M</span></p>
                                    <p className="text-base font-bold text-forest-green/50 dark:text-slate-400">Rural Internet Users</p>
                                </div>
                                <div className="group flex flex-col items-center text-center gap-3 rounded-3xl bg-background-light dark:bg-surface-dark px-6 py-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 dark:border-gray-800">
                                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg text-primary group-hover:scale-110 transition-transform duration-300">
                                        <Megaphone className="h-8 w-8" />
                                    </div>
                                    <p className="text-5xl font-black tracking-tight text-forest-green dark:text-white">71<span className="text-primary">%</span></p>
                                    <p className="text-base font-bold text-forest-green/50 dark:text-slate-400">Lack Scheme Awareness</p>
                                </div>
                                <div className="group flex flex-col items-center text-center gap-3 rounded-3xl bg-background-light dark:bg-surface-dark px-6 py-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 dark:border-gray-800">
                                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg text-accent group-hover:scale-110 transition-transform duration-300">
                                        <Wallet className="h-8 w-8" />
                                    </div>
                                    <p className="text-4xl font-black tracking-tight text-forest-green dark:text-white mt-2">₹5 Lakh <span className="text-primary text-2xl">Cr</span></p>
                                    <p className="text-base font-bold text-forest-green/50 dark:text-slate-400">Ecosystem Value</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section - Premium Cards */}
                    <section className="bg-background-light dark:bg-background-dark px-6 py-24 lg:px-20 relative overflow-hidden" id="features">
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        <div className="container mx-auto max-w-6xl relative z-10">
                            <div className="mb-20 text-center">
                                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-3 block">Powerful Features</span>
                                <h2 className="mb-6 text-4xl font-black text-forest-green dark:text-white lg:text-5xl">Empowering Rural India</h2>
                                <p className="mx-auto max-w-2xl text-xl text-forest-green/70 dark:text-slate-300 leading-relaxed">Designed for accessibility and ease of use in local dialects, bridging the technology gap one voice command at a time.</p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="relative flex flex-col rounded-[2rem] bg-white dark:bg-surface-dark p-10 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 border border-gray-100 dark:border-gray-800 group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary relative z-10">
                                        <Mic className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-black text-forest-green dark:text-white relative z-10">Voice-First AI</h3>
                                    <p className="text-forest-green/70 dark:text-slate-400 leading-relaxed relative z-10 text-lg">
                                        Interact naturally in your local language without typing. Our AI understands diverse dialects and accents.
                                    </p>
                                    <div className="mt-auto pt-8 relative z-10">
                                        <a className="inline-flex items-center text-sm font-bold text-primary group-hover:text-primary-dark transition-colors" href="#">
                                            Try Demo <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                <div className="relative flex flex-col rounded-[2rem] bg-white dark:bg-surface-dark p-10 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-secondary/20 border border-gray-100 dark:border-gray-800 group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary relative z-10">
                                        <Compass className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-black text-forest-green dark:text-white relative z-10">Scheme Discovery</h3>
                                    <p className="text-forest-green/70 dark:text-slate-400 leading-relaxed relative z-10 text-lg">
                                        Find relevant government schemes tailored to your profile. Get notified about new opportunities instantly.
                                    </p>
                                    <div className="mt-auto pt-8 relative z-10">
                                        <a className="inline-flex items-center text-sm font-bold text-secondary group-hover:text-amber-600 transition-colors" href="#">
                                            Explore Schemes <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                <div className="relative flex flex-col rounded-[2rem] bg-white dark:bg-surface-dark p-10 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 border border-gray-100 dark:border-gray-800 group overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary relative z-10">
                                        <FilePlus className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-black text-forest-green dark:text-white relative z-10">Auto-Form Filling</h3>
                                    <p className="text-forest-green/70 dark:text-slate-400 leading-relaxed relative z-10 text-lg">
                                        Automatically fill complex application forms using voice data. Say goodbye to paperwork hurdles altogether.
                                    </p>
                                    <div className="mt-auto pt-8 relative z-10">
                                        <a className="inline-flex items-center text-sm font-bold text-primary group-hover:text-primary-dark transition-colors" href="#">
                                            See How <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section - Make it pop */}
                    <section className="bg-gradient-to-br from-forest-green to-[#06261b] px-6 py-24 text-white lg:px-20 relative overflow-hidden">
                        {/* Ambient gradients */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-primary/20 blur-[100px] rounded-full transform -rotate-12"></div>
                            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-accent/20 blur-[120px] rounded-full"></div>
                        </div>

                        <div className="container mx-auto relative z-10">
                            <div className="glass-dark rounded-[3rem] p-10 md:p-16 lg:p-20 text-center border border-white/10 shadow-2xl backdrop-blur-2xl">
                                <h2 className="mb-6 text-4xl font-black md:text-6xl tracking-tight text-white">Ready to bridge the gap?</h2>
                                <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80 leading-relaxed">
                                    Join thousands of farmers already using GramSetu to access better opportunities and transform their agricultural practices today.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                                    <Link to="/login" className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary to-primary-dark px-10 py-5 text-lg font-bold text-white shadow-xl shadow-primary/40 transition-all hover:shadow-primary/60 hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                                        <Download className="h-6 w-6" />
                                        Get GramSetu
                                    </Link>
                                    <button className="w-full sm:w-auto rounded-xl bg-white/10 border border-white/20 px-10 py-5 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-1 flex items-center justify-center gap-2">
                                        <Handshake className="h-6 w-6" />
                                        Partner with Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#08120e] dark:bg-black py-16 text-white/60">
                    <div className="container mx-auto px-6 lg:px-20">
                        <div className="flex flex-col justify-between gap-12 md:flex-row border-b border-white/10 pb-12">
                            <div className="flex flex-col gap-6 max-w-xs">
                                <div className="flex items-center gap-2 text-white">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                        <Tractor className="h-6 w-6" />
                                    </div>
                                    <span className="text-2xl font-black tracking-tight">Gram<span className="text-primary">Setu</span></span>
                                </div>
                                <p className="text-sm leading-relaxed text-white/50">Empowering rural India with intuitive voice-first technology. Made with ❤️ for Bharat.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-white tracking-widest text-sm uppercase">Product</h4>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Features</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Voice AI</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Security</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-white tracking-widest text-sm uppercase">Company</h4>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">About Us</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Careers</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Press</a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-white tracking-widest text-sm uppercase">Support</h4>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Help Center</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Contact</a>
                                    <a className="text-sm hover:text-primary transition-colors" href="#">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col items-center justify-between text-sm md:flex-row gap-4">
                            <p>© 2024 GramSetu Technologies Pvt Ltd. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
