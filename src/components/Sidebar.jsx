import { Link, useLocation } from "react-router-dom";
import { Home, Tv, History, FolderOpen, ThumbsUp, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useSubscriptions } from '../hooks/useSubsciptions.js';
import { useState } from 'react';
import AboutModal from './AboutModal';

const SidebarLink = ({ to, icon, text, currentPath, closeSidebar }) => {
    const isActive = currentPath === to;
    
    return (
        <Link 
            to={to} 
            onClick={closeSidebar} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg mx-2 transition-colors duration-200 ${
                isActive 
                ? "bg-stone-800 text-white font-medium" 
                : "text-stone-400 hover:bg-stone-800/50 hover:text-white"
            }`}
        >
            <span className="flex items-center justify-center">
                {icon}
            </span>
            <span className="text-sm">{text}</span>
        </Link>
    );
};

function Sidebar({ isOpen, closeSidebar }) {
    const location = useLocation();
    const currentPath = location.pathname;
    const { subscribedChannels, loading } = useSubscriptions(); 
    const [isSubsExpanded, setIsSubsExpanded] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

           <aside 
                className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-64 bg-[#0c0a09] border-r border-stone-800 transform transition-transform duration-300 ease-in-out flex flex-col py-4 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/" icon={<Home size={20} />} text="Home" currentPath={currentPath} closeSidebar={closeSidebar} />
                    <div className="flex flex-col mx-2">
                        <button 
                            onClick={() => setIsSubsExpanded(!isSubsExpanded)}
                            className="flex items-center justify-between px-4 py-3 rounded-lg text-stone-400 hover:bg-stone-800/50 hover:text-white transition-colors duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <Tv size={20} />
                                <span className="text-sm">Subscriptions</span>
                            </div>
                            {/* Toggle Arrow */}
                            {isSubsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* The Dropped-down List */}
                        {isSubsExpanded && (
                            <div className="flex flex-col mt-1 mb-2">
                                {subscribedChannels.length === 0 ? (
                                    <p className="text-xs text-stone-500 px-12 py-2">No subscriptions yet.</p>
                                ) : (
                                    subscribedChannels.map((sub) => (
                                        <Link 
                                            key={sub._id}
                                            to={`/channel/${sub.channels.username}`}
                                            onClick={closeSidebar}
                                            className="flex items-center gap-3 px-4 py-2 ml-6 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
                                        >
                                            <img 
                                                src={sub.channels.avatar} 
                                                alt={sub.channels.fullname} 
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            <span className="text-sm truncate">{sub.channels.fullname}</span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <div className="my-4 border-t border-stone-800 mx-4"></div>
                    
                    <h3 className={`px-6 text-sm font-bold text-stone-200 mb-2`}>
                        You
                    </h3>
                    
                    <SidebarLink to="/history" icon={<History size={20} />} text="History" currentPath={currentPath} closeSidebar={closeSidebar} />
                    <SidebarLink to="/playlists" icon={<FolderOpen size={20} />} text="Playlists" currentPath={currentPath} closeSidebar={closeSidebar} />
                    <SidebarLink to="/liked" icon={<ThumbsUp size={20} />} text="Liked Videos" currentPath={currentPath} closeSidebar={closeSidebar} />
                </div>

                {/* About Lumina Section (Minimal) */}
                <div className="px-4 py-4 mt-auto border-t border-stone-800 shrink-0">
                    <button 
                        onClick={() => setIsAboutOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-stone-900/50 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl border border-stone-800 transition-colors mb-4 group"
                    >
                        <Info size={18} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
                        <span className="text-sm font-medium">About Lumina</span>
                    </button>

                    <div className="flex flex-col gap-1 items-center justify-center text-center">
                        <p className="text-stone-500 text-xs font-medium">Built by Shorya Bhushan</p>
                        <div className="flex items-center gap-3 mt-1">
                            <a href="mailto:shoryabhushan0@gmail.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#f97316] transition-colors" title="Email Me">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </a>
                            <a href="https://shoryabhushan.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#f97316] transition-colors" title="Portfolio">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Render the Modal */}
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </>
    );
}

export default Sidebar;