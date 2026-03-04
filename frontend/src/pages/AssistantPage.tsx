import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import {
    ArrowLeft, Languages, ChevronDown, MoreVertical,
    Bot, FileText, Download, CheckCheck, Volume2,
    Keyboard, Mic, Paperclip, Send
} from "lucide-react";

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    audioUrl?: string;
    timestamp: string;
    pdfUrl?: string;
}

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "bot",
            text: "Namaste! 🙏 How can I help you with your crops or banking needs today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isKeyboardMode, setIsKeyboardMode] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const createSession = async () => {
            try {
                const res = await api.post("/api/chat/create");
                setChatId(res.data.chatId || res.data.id || "dummy_chat_id");
            } catch (err) {
                console.warn("Could not create chat session immediately.", err);
                setChatId("fallback_chat_id_" + Math.random().toString());
            }
        };
        createSession();
    }, []);

    const handleSendText = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!textInput.trim() || sending) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textInput.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setTextInput("");
        setSending(true);

        try {
            const formData = new FormData();
            formData.append("chatId", chatId || Date.now().toString());
            formData.append("message", newMsg.text);

            const res = await api.post("/api/chat/send", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: res.data.response || res.data.message || "I received your message, but could not parse my backend response properly.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                audioUrl: res.data.audioUrl || undefined,
                pdfUrl: res.data.pdfUrl || undefined
            };
            setMessages(prev => [...prev, responseMsg]);
        } catch (err: any) {
            console.error(err);
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: "I am having trouble connecting to the backend. Please try again later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMsg]);
        } finally {
            setSending(false);
        }
    };

    const handleMicInteract = () => {
        if (isRecording) {
            setIsRecording(false);
        } else {
            setIsRecording(true);
            setTimeout(() => {
                setIsRecording(false);
            }, 3000);
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#06150d] text-slate-900 dark:text-slate-100 font-display flex flex-col h-screen overflow-hidden relative">
            {/* Background WhatsApp-like pattern but more subtle and modern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <header className="flex-none glass dark:glass-dark border-b border-gray-200/50 dark:border-white/5 py-3 px-6 flex items-center justify-between z-20 shadow-sm relative">
                <Link to="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity group">
                    <div className="size-12 bg-white dark:bg-gray-800 shadow-md rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <ArrowLeft className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-forest-green dark:text-white flex items-center gap-2">
                            GramSetu AI
                            <span className="size-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(17,212,147,0.8)]"></span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-0.5">Always here to help</p>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden sm:block">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
                            <Languages className="text-primary h-5 w-5" />
                            <span>English</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                    <button className="size-12 rounded-full hover:bg-white dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center">
                        <MoreVertical className="h-6 w-6" />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full h-full z-10">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 pb-48 scroll-smooth">
                    <div className="flex justify-center my-6">
                        <span className="px-5 py-2 glass dark:glass-dark shadow-sm border border-gray-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest backdrop-blur-md">
                            Today • Conversation Secured
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 max-w-[90%] sm:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div
                                className={`size-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-sm
                  ${msg.sender === 'user' ? 'border-white hidden sm:flex shadow-orange-500/20' : 'bg-primary border-white hidden sm:flex shadow-primary/20'}`}
                            >
                                {msg.sender === 'user' ? (
                                    <img alt="Farmer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrNP1wF-cj_fZTV_ZDpF1yiTzUR708HY3HfZLeBYncBNJanjuaszqSTKDnnw9azHF7fzuR7_NvUKEHHzXNFM8_3FoaQVFwzJ_WLpzZ-pE5pbzJFAFwoUd-euxVU3cGIk1-Nz0zAdBI2EZ4fFf2ZP9GUvmdcaAyM8k7wF65-l2onQJgv_PYcasyHi6_K3KsBt19K-HH4XrtUQ7eVch5Kzs_wuU3D8r4cka7RnpotgZn9vHKRa2KCjzi1qF9N1lPRQIuAsbBSBMOxqCd" />
                                ) : (
                                    <Bot className="text-white h-6 w-6" />
                                )}
                            </div>
                            <div className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                                <div className={`px-6 py-4 rounded-[1.5rem] shadow-md relative text-[15px]
                  ${msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-[#ff9800] to-orange-600 text-white rounded-br-sm shadow-orange-500/20 border border-orange-400/50'
                                        : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-200 rounded-bl-sm border border-gray-100 dark:border-gray-800 shadow-gray-200/50 dark:shadow-none'}`}>

                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                    {msg.pdfUrl && (
                                        <div className="flex items-center gap-4 mt-4 p-3 bg-gray-50/50 dark:bg-black/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 transition-colors cursor-pointer group/pdf">
                                            <div className="size-12 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-inner">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate">Application_Form.pdf</h4>
                                                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-semibold">2.4 MB PDF Document</p>
                                            </div>
                                            <a href={msg.pdfUrl} target="_blank" rel="noopener noreferrer" className="size-10 bg-white dark:bg-gray-800 flex items-center justify-center rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-600 dark:text-slate-300 transition-all shadow-sm group-hover/pdf:scale-110">
                                                <Download className="h-5 w-5" />
                                            </a>
                                        </div>
                                    )}

                                    <span className={`flex items-center gap-1 text-[10px] font-bold mt-2 float-right opacity-60 ${msg.sender === 'user' ? 'text-white/80' : 'text-slate-400'} clear-both`}>
                                        {msg.timestamp}
                                        {msg.sender === 'user' && <CheckCheck className="h-3 w-3" />}
                                    </span>

                                    {msg.sender === 'bot' && msg.audioUrl && (
                                        <button className="absolute -right-14 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-gray-700 shadow-lg border border-gray-100 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-primary hover:scale-110">
                                            <Volume2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {sending && (
                        <div className="flex items-end gap-3 max-w-[80%] animate-in fade-in duration-300">
                            <div className="size-10 rounded-full bg-primary flex-shrink-0 hidden sm:flex items-center justify-center overflow-hidden border-2 border-white shadow-primary/20 shadow-sm">
                                <Bot className="text-white h-6 w-6" />
                            </div>
                            <div className="flex flex-col gap-1 justify-center">
                                <div className="bg-white dark:bg-surface-dark px-6 py-5 rounded-[1.5rem] rounded-bl-sm shadow-md border border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-2 items-center justify-center h-4">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-[0_0_5px_rgba(17,212,147,0.5)]" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-bounce shadow-[0_0_5px_rgba(17,212,147,0.5)]" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce shadow-[0_0_5px_rgba(17,212,147,0.5)]" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area - Redesigned to float and look premium */}
                <div className="absolute bottom-6 left-4 right-4 sm:left-10 sm:right-10 z-30">
                    <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">

                        {/* The Floating Mic Button */}
                        {!isKeyboardMode && (
                            <div className="relative">
                                {isRecording && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60 scale-150"></div>
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse">
                                            Listening... Speak now
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-6 justify-center bg-white/60 dark:bg-[#1a2e26]/60 backdrop-blur-xl p-3 rounded-full shadow-2xl border border-white/40 dark:border-white/10">
                                    <button
                                        onClick={() => setIsKeyboardMode(true)}
                                        className="size-12 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110 group"
                                    >
                                        <Keyboard className="h-6 w-6 group-hover:text-primary transition-colors" />
                                    </button>

                                    <button
                                        onMouseDown={() => handleMicInteract()}
                                        className={`relative z-10 size-[80px] rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden
                      ${isRecording
                                                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/50 scale-110 ring-4 ring-red-500/30'
                                                : 'bg-gradient-to-br from-[#ff9800] to-orange-600 hover:to-orange-500 shadow-xl shadow-orange-500/30 active:scale-95 ring-4 ring-white dark:ring-[#1a2e26]'}`}
                                    >
                                        <Mic className="h-10 w-10 text-white" />
                                    </button>

                                    <button className="size-12 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110 group">
                                        <Paperclip className="h-6 w-6 group-hover:text-primary transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {isKeyboardMode && (
                            <form className="w-full flex items-center gap-3 bg-white/70 dark:bg-[#1a2e26]/80 backdrop-blur-xl p-3 rounded-full shadow-2xl border border-white/40 dark:border-white/10" onSubmit={handleSendText}>
                                <button
                                    type="button"
                                    onClick={() => setIsKeyboardMode(false)}
                                    className="size-12 flex-shrink-0 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110"
                                >
                                    <Mic className="h-6 w-6 text-primary" />
                                </button>

                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={e => setTextInput(e.target.value)}
                                    className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 text-slate-900 dark:text-white rounded-full px-6 py-4 focus:outline-0 focus:ring-2 focus:ring-primary shadow-inner font-medium placeholder:text-slate-400"
                                    placeholder="Type a message..."
                                />

                                <button
                                    type="submit"
                                    disabled={!textInput.trim() || sending}
                                    className="size-14 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-primary-dark hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white flex items-center justify-center transition-all shadow-lg shadow-primary/30"
                                >
                                    <Send className="h-6 w-6" />
                                </button>
                            </form>
                        )}

                        {!isKeyboardMode && (
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2 glass dark:glass-dark px-4 py-1.5 rounded-full border border-white/20">
                                Tap to speak
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
