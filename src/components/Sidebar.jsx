import { Link, useLocation } from "react-router-dom";
import { Home, Tv, History, FolderOpen, ThumbsUp ,ChevronDown,ChevronUp} from "lucide-react";
import { useSubscriptions } from '../hooks/useSubsciptions.js';
import { useState } from 'react';

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
            </aside>
        </>
    );
}

export default Sidebar;