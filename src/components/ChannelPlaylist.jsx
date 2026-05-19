import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import { ListVideo } from 'lucide-react';

function ChannelPlaylists({ userId }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!userId) return;
            setLoading(true)
            try {
            
                const response = await api.get(`/playlists/user/${userId}`);
                
                const allPlaylists = response.data.data || [];
                setPlaylists(allPlaylists);
            } catch (error) {
                console.error("Error fetching channel playlists:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [userId]);

    if (loading) return <div className="text-stone-400 py-10 text-center animate-pulse">Loading playlists...</div>;

    if (playlists.length === 0) {
        return (
            <div className="text-center py-16 flex flex-col items-center justify-center">
                <ListVideo size={48} className="text-stone-700 mb-4" />
                <p className="text-stone-400 text-lg">This channel has no public playlists.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {playlists.map((playlist) => (
                <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="group cursor-pointer">
                    <div className="relative w-full aspect-video rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden mb-3 group-hover:border-stone-600 transition-colors">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                        <ListVideo size={40} className="text-stone-700 group-hover:text-stone-500 transition-colors z-0" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/90 to-transparent z-20 flex justify-between items-end">
                            <span className="bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                                {playlist.totalVideos} videos
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col pr-2">
                        <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                            {playlist.name}
                        </h3>
                        <p className="text-stone-500 text-xs mt-1 font-medium">
                            Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ChannelPlaylists;