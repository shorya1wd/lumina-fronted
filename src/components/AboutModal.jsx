import React from 'react';
import { X, Code2, Database, ShieldCheck, Mail, Globe, MonitorPlay, Server } from 'lucide-react';

function AboutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#110e0d] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-800 bg-gradient-to-r from-[#110e0d] to-[#1a1514]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <MonitorPlay className="text-orange-500 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">About Lumina</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    
                    {/* Intro */}
                    <div className="space-y-3">
                        <p className="text-stone-300 leading-relaxed text-lg">
                            Lumina is a highly scalable, full-stack video streaming and social media platform. 
                            It was built to demonstrate enterprise-level architecture, secure authentication, and seamless user experiences.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#0c0a09] border border-stone-800/60 flex gap-4 items-start">
                            <ShieldCheck className="text-emerald-500 w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-stone-200 mb-1">Secure Auth</h3>
                                <p className="text-sm text-stone-400 leading-relaxed">JWT-based Access & Refresh tokens via HTTP-only cookies, plus Resend API for secure email verification.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0c0a09] border border-stone-800/60 flex gap-4 items-start">
                            <Database className="text-blue-500 w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-stone-200 mb-1">Advanced NoSQL</h3>
                                <p className="text-sm text-stone-400 leading-relaxed">Complex MongoDB aggregation pipelines for performant querying of relational social data.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0c0a09] border border-stone-800/60 flex gap-4 items-start">
                            <MonitorPlay className="text-purple-500 w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-stone-200 mb-1">Cloud Media</h3>
                                <p className="text-sm text-stone-400 leading-relaxed">Integration with Cloudinary & Multer for optimized video streaming and scalable asset storage.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0c0a09] border border-stone-800/60 flex gap-4 items-start">
                            <Code2 className="text-orange-500 w-6 h-6 shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-stone-200 mb-1">Modern Stack</h3>
                                <p className="text-sm text-stone-400 leading-relaxed">React 19, Vite, Tailwind CSS 4 on the frontend. Node.js & Express powering a RESTful backend API.</p>
                            </div>
                        </div>
                    </div>

                    {/* Developer Profile */}
                    <div className="bg-gradient-to-br from-stone-900 to-[#0c0a09] rounded-2xl p-6 border border-stone-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl"></div>
                        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4">Lead Developer</h3>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-white mb-1">Shorya Bhushan</h4>
                                <p className="text-stone-400 mb-4">Full Stack Web Developer</p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a 
                                        href="mailto:shoryabhushan0@gmail.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Mail size={16} />
                                        Email Me
                                    </a>
                                    <a 
                                        href="https://shoryabhushan.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-orange-900/20"
                                    >
                                        <Globe size={16} />
                                        Portfolio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AboutModal;
