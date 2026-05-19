import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';

function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/user/watch-history"); 
                setHistory(response.data.data || []);
            } catch (error) {
                console.error("Error fetching watch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="text-white text-xl font-bold animate-pulse">Loading history...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-stone-800">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                        <History size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Watch History</h1>
                        <p className="text-stone-400 mt-1.5 text-sm font-medium">
                            Keep track of what you've watched
                        </p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <History size={64} className="text-stone-800 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No watch history</h2>
                        <p className="text-stone-400">Videos you watch will show up here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {history.map((item) => {
                            const vid = item.videoDetails;
                            if (!vid) return null; 

                            return (
                                <Link 
                                    to={`/watch/${vid._id}`} 
                                    key={item._id} 
                                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 group cursor-pointer hover:bg-stone-900/50 p-2 sm:p-3 rounded-xl transition-colors"
                                >
                                    <div className="relative w-full sm:w-64 shrink-0 aspect-video rounded-xl overflow-hidden bg-stone-800">
                                        <img 
                                            src={vid.thumbnail} 
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out" 
                                            alt={vid.title}
                                        />
                                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                            {Math.floor(vid.duration / 60)}:{Math.floor(vid.duration % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col grow py-1">
                                        <h3 className="text-white font-semibold text-lg sm:text-xl line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors mb-2">
                                            {vid.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
                                            <span className="hover:text-white transition-colors">{vid.owner?.fullname}</span>
                                            <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                                            <span>{vid.views} views</span>
                                        </div>

                                        <p className="text-stone-500 text-sm line-clamp-2 hidden sm:block">
                                            {vid.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WatchHistory;