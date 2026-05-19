import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

function LikedVideos() {
    const [likedVideos, setLikedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const response = await api.get("/likes/videos/");
                setLikedVideos(response.data.data.docs || []);
            } catch (error) {
                console.error("Error fetching liked videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    if (loading) {
        return <div className="text-white text-center py-20 text-xl font-bold">Loading your favorites...</div>;
    }

    return (
        <div className="min-h-screen bg-stone-950 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-stone-800">
                    <div className="w-13 h-13 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                        <ThumbsUp size={24} fill="black" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Liked Videos</h1>
                        <p className="text-stone-400 mt-1.5 text-sm font-medium">
                            {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'}
                        </p>
                    </div>
                </div>

                {likedVideos.length === 0 ? (
                    <div className="text-center py-20">
                        <ThumbsUp size={64} className="mx-auto text-stone-800 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No liked videos yet</h2>
                        <p className="text-stone-400">Videos you like will show up here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {likedVideos.map((item) => {
                            const vid = item.videoDetails;
                            if (!vid) return null;

                            return (
                                <Link to={`/watch/${vid._id}`} key={item._id} className="group cursor-pointer">
                                    <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-900 mb-3">
                                        <img 
                                            src={vid.thumbnail} 
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                            alt={vid.title}
                                        />
                                        <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-1 rounded font-medium text-white">
                                            {Math.floor(vid.duration / 60)}:{Math.floor(vid.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <img 
                                            src={vid.ownerDetails?.avatar || "/default-avatar.png"} 
                                            alt={vid.ownerDetails?.fullname}
                                            className="w-9 h-9 rounded-full object-cover mt-1"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="text-white font-bold line-clamp-2 text-sm leading-tight">
                                                {vid.title}
                                            </h3>
                                            <p className="text-stone-400 text-xs mt-1 hover:text-white">
                                                {vid.ownerDetails?.fullname}
                                            </p>
                                            <p className="text-stone-500 text-xs">
                                                {vid.views} views
                                            </p>
                                        </div>
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

export default LikedVideos;