"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    ArrowLeft, Languages, ChevronDown, MoreVertical,
    Bot, FileText, Download, CheckCheck, Volume2,
    Keyboard, Mic, Paperclip, Send, Play, Pause, User,
    Menu, Plus, Search, Image as ImageIcon, MessageSquare, Trash2
} from "lucide-react";

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    audioUrl?: string;
    timestamp: string;
    pdfUrl?: string;
}

interface ChatSession {
    id: string;
    conversation_title: string;
    updated_at: string;
}

function AssistantContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoadingChat, setIsLoadingChat] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Default initial message
        setMessages([
            {
                id: "1",
                sender: "bot",
                text: "Namaste! 🙏 How can I help you with your crops or banking needs today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await api.get("/api/chat/my-chats");
            if (Array.isArray(res.data)) {
                setChats(res.data);
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    };
    const [isKeyboardMode, setIsKeyboardMode] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playAudio = (audioUrl: string, msgId: string) => {
        if (playingAudioId === msgId) {
            audioPlayerRef.current?.pause();
            setPlayingAudioId(null);
            return;
        }
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
        }
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        setPlayingAudioId(msgId);
        audio.play().catch(err => console.warn("Playback failed:", err));
        audio.onended = () => setPlayingAudioId(null);
    };

    const getOrCreateSession = async (): Promise<string | null> => {
        if (chatId) return chatId;
        try {
            const res = await api.post("/api/chat/create");
            const newId = res.data?.chat?.id || res.data?.chatId || res.data?.id;
            if (newId) {
                setChatId(newId);
                fetchChats();
                return newId;
            }
        } catch (err: any) {
            console.error("Session creation failed:", err?.response?.data || err.message);
        }
        return null;
    };

    const handleNewChat = () => {
        setChatId(null);
        setMessages([
            {
                id: Date.now().toString(),
                sender: "bot",
                text: "Namaste! 🙏 How can I help you with your crops or banking needs today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setSidebarOpen(false);
    };

    const handleSelectChat = async (id: string) => {
        if (chatId === id) {
            setSidebarOpen(false);
            return;
        }
        setIsLoadingChat(true);
        try {
            const res = await api.get(`/api/chat/${id}`);
            const chatObj = res.data;
            setChatId(id);
            if (chatObj && chatObj.messages) {
                const formattedOptions = chatObj.messages.map((m: any) => ({
                    id: m.id,
                    sender: m.role === 'user' ? 'user' : 'bot',
                    text: m.content || "",
                    timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                // Ensure at least the initial message is there if empty
                if (formattedOptions.length === 0) {
                    setMessages([
                        {
                            id: Date.now().toString(),
                            sender: "bot",
                            text: "Namaste! 🙏 How can I help you with your crops or banking needs today?",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ]);
                } else {
                    setMessages(formattedOptions);
                }
            }
            setSidebarOpen(false);
        } catch (err) {
            console.error("Failed to load chat:", err);
        } finally {
            setIsLoadingChat(false);
        }
    };

    const handleSendText = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!textInput.trim() || sending) return;

        setSending(true);
        const activeChatId = await getOrCreateSession();

        if (!activeChatId) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                sender: 'bot',
                text: "⚠️ Chat session not available. Please make sure you're logged in with a valid account and try refreshing the page.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
            setSending(false);
            return;
        }

        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textInput.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setTextInput("");

        try {
            const formData = new FormData();
            formData.append("chatId", activeChatId);
            formData.append("message", newMsg.text);

            const res = await api.post("/api/chat/send", formData);

            let textAudioUrl: string | undefined;
            if (res.data.audio) {
                textAudioUrl = `data:audio/mp3;base64,${res.data.audio}`;
            } else if (res.data.audioUrl) {
                textAudioUrl = res.data.audioUrl;
            }

            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: res.data.aiMessage || res.data.response || res.data.message || "Received your message but couldn't parse the response.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                audioUrl: textAudioUrl,
                pdfUrl: res.data.pdfUrl || undefined
            };
            setMessages(prev => [...prev, responseMsg]);
        } catch (err: any) {
            console.error("Chat send error:", err?.response?.data || err.message);
            const errText = err?.response?.status === 401
                ? "🔒 Your session has expired. Please log in again."
                : err?.response?.data?.error || err?.response?.data?.message || "I'm having trouble connecting to the AI service. Please try again.";
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: errText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMsg]);
        } finally {
            setSending(false);
        }
    };

    const startRecording = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const errorMsg: Message = {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: "🔒 Microphone access requires a secure connection (HTTPS). You're currently on HTTP. Please access this site via HTTPS or localhost to use voice features.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, errorMsg]);
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
                if (audioBlob.size > 0) {
                    sendAudio(audioBlob);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic access error:", err);
            const errorMsg: Message = {
                id: Date.now().toString(),
                sender: 'bot',
                text: "🎤 Microphone access denied. Please allow microphone permission in your browser settings.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const sendAudio = async (audioBlob: Blob) => {
        setSending(true);
        const activeChatId = await getOrCreateSession();

        if (!activeChatId) {
            const errorMsg: Message = {
                id: Date.now().toString(),
                sender: 'bot',
                text: "⚠️ Chat session not available. Please make sure you're logged in and try refreshing.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
            setSending(false);
            return;
        }

        const userAudioUrl = URL.createObjectURL(audioBlob);
        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: "🎤 Voice message",
            audioUrl: userAudioUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            const formData = new FormData();
            formData.append("chatId", activeChatId);
            formData.append("message", "");
            formData.append("audio", audioBlob, "recording.webm");

            const res = await api.post("/api/chat/send", formData);

            let audioDataUrl: string | undefined;
            if (res.data.audio) {
                audioDataUrl = `data:audio/mp3;base64,${res.data.audio}`;
            }

            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: res.data.aiMessage || "I heard you, but couldn't generate a text response.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                audioUrl: audioDataUrl
            };
            setMessages(prev => [...prev, responseMsg]);

            if (audioDataUrl) {
                const audio = new Audio(audioDataUrl);
                audio.play().catch(err => console.warn("Auto-play blocked:", err));
            }
        } catch (err: any) {
            console.error("Voice send error:", err?.response?.data || err.message);
            const errText = err?.response?.data?.error || err?.response?.data?.message || "Voice message failed to send. Please try again.";
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: errText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, responseMsg]);
        } finally {
            setSending(false);
        }
    };

    const handleMicInteract = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="bg-white dark:bg-[#212121] text-slate-900 dark:text-slate-100 font-display flex overflow-hidden relative" style={{ height: '100dvh' }}>
            
            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#171717] text-white flex flex-col transition-transform duration-300 ease-in-out transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-3 flex items-center justify-between">
                    <button 
                        onClick={handleNewChat}
                        className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202123] transition-colors text-sm font-medium"
                    >
                        <Bot className="h-5 w-5 opacity-70" />
                        <span className="flex-1 text-left">New chat</span>
                        <Plus className="h-5 w-5 opacity-70" />
                    </button>
                    <button 
                        className="md:hidden ml-2 p-2 rounded-xl border border-white/20 hover:bg-white/10"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="px-3 flex flex-col gap-1 mt-2">
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202123] transition-colors text-sm font-medium text-white/90">
                        <Search className="h-5 w-5 opacity-70" />
                        Search chats
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202123] transition-colors text-sm font-medium text-white/90">
                        <ImageIcon className="h-5 w-5 opacity-70" />
                        Images
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto mt-6 px-3 no-scrollbar pb-4 gap-1 flex flex-col">
                    <h3 className="text-xs font-semibold text-white/50 px-3 pb-2 uppercase tracking-wide">Your chats</h3>
                    {chats.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => handleSelectChat(chat.id)}
                            className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg text-sm transition-colors group relative
                                ${chatId === chat.id ? 'bg-[#343541] text-white' : 'text-white/80 hover:bg-[#2A2B32]'}`}
                        >
                            <MessageSquare className={`h-4 w-4 shrink-0 ${chatId === chat.id ? 'opacity-100 text-primary' : 'opacity-60'}`} />
                            <div className="flex-1 min-w-0">
                                <span className="block truncate font-medium">{chat.conversation_title || "New Chat"}</span>
                            </div>
                            {chatId === chat.id && (
                                <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                                    <Trash2 className="h-4 w-4 text-white/60 hover:text-red-400 shrink-0" />
                                </div>
                            )}
                        </button>
                    ))}
                    {chats.length === 0 && !isLoadingChat && (
                        <p className="text-xs text-center text-white/40 mt-4 px-4 italic">No previous chats. Start by saying hello!</p>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative w-full z-10 min-w-0">
                <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <header className="flex-none glass dark:glass-dark border-b border-gray-200/50 dark:border-white/5 py-2 px-3 sm:py-3 sm:px-6 flex items-center justify-between z-20 shadow-sm relative">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity group">
                        <div className="size-10 sm:size-12 bg-white dark:bg-gray-800 shadow-md rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-xl font-black tracking-tight text-forest-green dark:text-white flex items-center gap-2">
                                GramSetu AI
                                <span className="size-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(17,212,147,0.8)]"></span>
                            </h1>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-0.5">Always here to help</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group hidden sm:block">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
                            <Languages className="text-primary h-5 w-5" />
                            <span>English</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                    <Link href="/dashboard" className="size-10 sm:size-12 rounded-full hover:bg-white dark:hover:bg-gray-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center group/profile">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover/profile:scale-110 group-hover/profile:text-primary" />
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col relative w-full z-10 min-h-0">
                {isLoadingChat ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="size-5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="size-5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="size-5 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                ) : (
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 sm:px-[15%] space-y-4 sm:space-y-8 pb-4 scroll-smooth no-scrollbar pt-4">
                        <div className="flex justify-center my-4 sm:my-6">
                            <span className="px-5 py-2 glass dark:glass-dark shadow-sm border border-gray-200 dark:border-white/10 rounded-full text-[10px] sm:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest backdrop-blur-md">
                                Conversation Secured
                            </span>
                        </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 sm:gap-3 max-w-[95%] sm:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''} group`}>
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
                                <div className={`px-4 py-3 sm:px-6 sm:py-4 rounded-[1.25rem] sm:rounded-[1.5rem] shadow-md relative text-sm sm:text-[15px]
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

                                    {msg.audioUrl && (
                                        <div className={`flex items-center gap-3 mt-3 p-2 rounded-xl ${msg.sender === 'user' ? 'bg-white/20' : 'bg-gray-100 dark:bg-black/20'}`}>
                                            <button
                                                onClick={() => playAudio(msg.audioUrl!, msg.id)}
                                                className={`size-9 sm:size-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm hover:scale-110 ${msg.sender === 'user'
                                                    ? 'bg-white/30 hover:bg-white/50 text-white'
                                                    : 'bg-primary/10 hover:bg-primary/20 text-primary'}`}
                                            >
                                                {playingAudioId === msg.id
                                                    ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
                                            </button>
                                            <div className="flex-1 flex items-center gap-1">
                                                {[...Array(12)].map((_, i) => {
                                                    // Use a deterministic pseudo-random sequence based on msg.id and index
                                                    // so it always renders the same on server and client
                                                    const seed = msg.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + i;
                                                    const pseudoRandom = (Math.sin(seed * 9999) + 1) / 2;
                                                    const height = 8 + Math.sin(i * 0.8) * 10 + pseudoRandom * 6;
                                                    
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex-1 rounded-full transition-all duration-300 ${playingAudioId === msg.id ? 'animate-pulse' : ''} ${msg.sender === 'user' ? 'bg-white/50' : 'bg-primary/30'}`}
                                                            style={{ height: `${height}px` }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <span className={`text-[10px] font-bold flex-shrink-0 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                                                {msg.sender === 'user' ? '🎤' : '🔊'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {sending && (
                        <div className="flex items-end gap-3 max-w-[80%]">
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
                )}

                <div className="flex-none px-2 sm:px-[5%] w-full max-w-4xl mx-auto py-2 sm:py-3 z-30" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                    <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 sm:gap-4">
                        {!isKeyboardMode && (
                            <div className="relative">
                                {isRecording && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60 scale-150"></div>
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                            <div className="whitespace-nowrap bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse mb-1">
                                                Listening... Speak now
                                            </div>
                                            <span className="text-sm font-black text-slate-700 dark:text-white/90 drop-shadow-sm font-mono">
                                                {formatTime(recordingTime)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-center gap-3 sm:gap-6 justify-center bg-white/60 dark:bg-[#1a2e26]/60 backdrop-blur-xl p-2 sm:p-3 rounded-full shadow-2xl border border-white/40 dark:border-white/10">
                                    <button
                                        onClick={() => setIsKeyboardMode(true)}
                                        className="size-10 sm:size-12 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110 group"
                                    >
                                        <Keyboard className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-primary transition-colors" />
                                    </button>

                                    <button
                                        onClick={() => handleMicInteract()}
                                        className={`relative z-10 size-16 sm:size-[80px] rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden
                      ${isRecording
                                                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/50 scale-110 ring-4 ring-red-500/30'
                                                : 'bg-gradient-to-br from-[#ff9800] to-orange-600 hover:to-orange-500 shadow-xl shadow-orange-500/30 active:scale-95 ring-4 ring-white dark:ring-[#1a2e26]'}`}
                                    >
                                        <Mic className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                    </button>

                                    <button className="size-10 sm:size-12 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110 group">
                                        <Paperclip className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-primary transition-colors" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {isKeyboardMode && (
                            <form className="w-full flex items-center gap-1.5 sm:gap-3 bg-white/70 dark:bg-[#1a2e26]/80 backdrop-blur-xl p-2 sm:p-3 rounded-full shadow-2xl border border-white/40 dark:border-white/10" onSubmit={handleSendText}>
                                <button
                                    type="button"
                                    onClick={() => setIsKeyboardMode(false)}
                                    className="size-10 sm:size-12 flex-shrink-0 rounded-full bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-110"
                                >
                                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </button>

                                <input
                                    id="chat-input"
                                    name="message"
                                    type="text"
                                    value={textInput}
                                    onChange={e => setTextInput(e.target.value)}
                                    className="flex-1 min-w-0 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/50 text-slate-900 dark:text-white rounded-full px-4 py-3 sm:px-6 sm:py-4 focus:outline-0 focus:ring-2 focus:ring-primary shadow-inner font-medium placeholder:text-slate-400 text-sm sm:text-base"
                                    placeholder="Type a message..."
                                />

                                <button
                                    type="submit"
                                    disabled={!textInput.trim() || sending}
                                    className="size-11 sm:size-14 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-primary-dark hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-white flex items-center justify-center transition-all shadow-lg shadow-primary/30"
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
        </div>
    );
}

export default function AssistantPage() {
    return (
        <ProtectedRoute>
            <AssistantContent />
        </ProtectedRoute>
    );
}
