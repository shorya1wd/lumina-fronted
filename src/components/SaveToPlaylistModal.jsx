import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { X, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SaveToPlaylistModal({ videoId, onClose }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const authData = useAuth(); 
    const activeUser = authData?.currentUser || authData?.user || authData?.userData;
    

    useEffect(() => {
        
        const fetchPlaylists = async () => {
            if (!activeUser?._id) return;
            try {
                const response = await api.get(`/playlists/user/${activeUser._id}`); 
                setPlaylists(response.data.data || []);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [activeUser._id]);

    const handleTogglePlaylist = async (playlist, isCurrentlyInPlaylist) => {
        setPlaylists(playlists.map(p => {
            if (p._id === playlist._id) {
                return {
                    ...p,
                    videos: isCurrentlyInPlaylist 
                        ? p.videos.filter(vid => {
                            const currentId = typeof vid === 'object' ? vid._id : vid;
                            return currentId.toString() !== videoId.toString();
                        }) 
                        : [...(p.videos || []), videoId] 
                };
            }
            return p;
        }));
        try {
            if (isCurrentlyInPlaylist) {
                await api.patch(`/playlists/remove/${playlist._id}/${videoId}`);
            } else {
                await api.patch(`/playlists/add/${videoId}/${playlist._id}`);
            }
        } catch (error) {
            console.error("Failed to update playlist:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-sm border border-stone-800 overflow-hidden shadow-2xl">
                

                <div className="flex justify-between items-center p-4 border-b border-stone-800">
                    <h2 className="text-lg font-bold text-white">Save to playlist</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8 text-stone-400 animate-pulse">Loading...</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center py-8 text-stone-400 text-sm">
                            You don't have any playlists yet.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {playlists.map(playlist => {
                                const isAdded = playlist.videos?.some(vid => {
                                    const currentId = typeof vid === 'object' ? vid._id : vid;
                                    return currentId.toString() === videoId.toString();
                                })

                                return (
                                    <button 
                                        key={playlist._id}
                                        onClick={() => handleTogglePlaylist(playlist, isAdded)}
                                        className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded-lg transition-colors text-left w-full group"
                                    >
                                        <div className="text-blue-500">
                                            {isAdded ? <CheckSquare size={20} /> : <Square size={20} className="text-stone-500 group-hover:text-stone-400" />}
                                        </div>
                                        <span className="text-white text-sm font-medium line-clamp-1">
                                            {playlist.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SaveToPlaylistModal;