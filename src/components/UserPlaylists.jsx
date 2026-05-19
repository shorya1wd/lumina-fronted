import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import { ListVideo, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function UserPlaylists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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
    }, [activeUser?._id]);


    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) return;

        setIsCreating(true);
        try {
            const response = await api.post("/playlists/", {
                name,
                description,
                isPrivate
            });

            const newPlaylist = response.data.data;
            newPlaylist.totalVideos = 0; 
            newPlaylist.totalViews = 0;

            setPlaylists([newPlaylist, ...playlists])

            setName('');
            setIsPrivate(false);
            setDescription('');
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating playlist:", error);
        } finally {
            setIsCreating(false);
        }
    };

    if (!activeUser) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-4">
                <ListVideo size={64} className="text-stone-700 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Sign in to see your playlists</h2>
                <p className="text-stone-400 mb-6 text-center">Please log in to create and manage your video collections.</p>
            </div>
        );
    }

    if (loading) return <div className="text-white text-center py-20 text-xl font-bold animate-pulse">Loading Playlists...</div>;

    return (
        <div className="min-h-screen bg-[#0f0f0f] p-4 sm:p-8 relative">
            <div className="max-w-7xl mx-auto">
                
    
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-stone-800">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                            <ListVideo size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Your Playlists</h1>
                            <p className="text-stone-400 mt-1.5 text-sm font-medium">
                                {playlists.length} {playlists.length === 1 ? 'Collection' : 'Collections'}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-colors"
                    >
                        <Plus size={20} />
                        <span>New Playlist</span>
                    </button>
                </div>

                
                {playlists.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center justify-center">
                        <ListVideo size={64} className="text-stone-800 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No playlists created</h2>
                        <p className="text-stone-400">Click 'New Playlist' to start organizing your favorite videos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlists.map((playlist) => (
                            <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="group cursor-pointer">
                                <div className="relative w-full aspect-video rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden mb-3 group-hover:border-stone-600 transition-colors">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                                    <ListVideo size={48} className="text-stone-700 group-hover:text-stone-500 transition-colors z-0" />
                                    
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/90 to-transparent z-20 flex justify-between items-end">
                                        <span className="bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                                            {playlist.totalVideos} videos
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col pr-6">
                                    <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                                        {playlist.name}
                                    </h3>
                                    <p className="text-stone-400 text-sm mt-1 line-clamp-2">
                                        {playlist.description}
                                    </p>
                                    <p className="text-stone-500 text-xs mt-2 font-medium">
                                        Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-stone-800 overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-stone-800">
                            <h2 className="text-xl font-bold text-white">Create a New Playlist</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreatePlaylist} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Title</label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Next.js Tutorials"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this playlist about?"
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                                <input 
                                    type="checkbox" 
                                    id="isPrivate"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="w-5 h-5 rounded border-stone-700 bg-stone-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-stone-900 cursor-pointer"
                                />
                                <label htmlFor="isPrivate" className="text-stone-300 text-sm font-medium cursor-pointer select-none">
                                    Keep this playlist private
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full font-bold text-stone-300 hover:bg-stone-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isCreating || !name.trim()}
                                    className="px-5 py-2.5 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isCreating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserPlaylists;