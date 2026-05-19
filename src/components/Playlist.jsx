import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from "../api/axiosInstance";
import { Play, Trash2, Edit, ListVideo, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Playlist() {
    const { playlistId } = useParams();
    const navigate = useNavigate();

    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editIsPrivate, setEditIsPrivate] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const authData = useAuth();
    const activeUser = authData?.currentUser || authData?.user || authData?.userData;

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {

                const response = await api.get(`/playlists/p/${playlistId}`);
                const docs = response.data.data.docs;

                if (docs && docs.length > 0) {
                    setPlaylistInfo({
                        name: docs[0].name,
                        description: docs[0].description,
                        isPrivate: docs[0].isPrivate,
                        ownerDetails: docs[0].ownerDetails,
                        updatedAt: docs[0].updatedAt
                    });

                    const extractedVideos = docs
                        .map(doc => doc.videoDetails)
                        .filter(video => video != null && Object.keys(video).length > 0);
                    
                    setVideos(extractedVideos);
                }
            } catch (error) {
                console.error("Error fetching playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;

        setIsUpdating(true);
        try {
            await api.patch(`/playlists/${playlistId}`, {
                name: editName,
                description: editDescription,
                isPrivate: editIsPrivate
            });

            setPlaylistInfo(prev => ({
                ...prev,
                name: editName,
                description: editDescription,
                isPrivate: editIsPrivate
            }));
            
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating playlist:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletePlaylist = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entire playlist? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            await api.delete(`/playlists/${playlistId}`);
            navigate('/playlists');
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    };

    const openEditModal = () => {
        setEditName(playlistInfo.name);
        setEditDescription(playlistInfo.description);
        setEditIsPrivate(playlistInfo.isPrivate || false);
        setIsEditModalOpen(true);
    };

    if (loading) return <div className="text-white text-center py-20 text-xl font-bold animate-pulse">Loading Playlist...</div>;
    if (!playlistInfo) return <div className="text-white text-center py-20 text-xl font-bold">Playlist not found.</div>;

    const isOwnPlaylist = activeUser?._id === playlistInfo.ownerDetails?._id;

    return (
        <div className="min-h-screen bg-[#0f0f0f] p-4 sm:p-8 flex justify-center">
            <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8">
                
                <div className="w-full lg:w-[350px] shrink-0">
                    <div className="bg-[#1a1a1a] rounded-2xl p-6 sticky top-8 border border-stone-800">
                        
                        <div className="w-full aspect-video bg-stone-900 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                            {videos.length > 0 && videos[0].thumbnail ? (
                                <img src={videos[0].thumbnail} alt="Cover" className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <ListVideo size={48} className="text-stone-700" />
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2 wrap-break-word">
                            {playlistInfo.name}
                        </h1>
                        
                        <p className="text-stone-400 text-sm mb-6 whitespace-pre-wrap wrap-break-word">
                            {playlistInfo.description}
                        </p>

                        <div className="flex items-center gap-3 mb-6">
                            <img 
                                src={playlistInfo.ownerDetails?.avatar || "/default-avatar.png"} 
                                alt={playlistInfo.ownerDetails?.fullname} 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="text-sm">
                                <p className="text-white font-medium">{playlistInfo.ownerDetails?.fullname}</p>
                                <p className="text-stone-500">{videos.length} videos</p>
                            </div>
                        </div>

                        {isOwnPlaylist && (
                        <div className="flex gap-3">
                            <button 
                                onClick={openEditModal}
                                className="flex-1 flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-white py-2.5 rounded-full font-medium transition-colors"
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button 
                                onClick={handleDeletePlaylist}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 py-2.5 rounded-full font-medium transition-colors"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                <div className="grow">
                    {videos.length === 0 ? (
                        <div className="text-center py-20 bg-stone-900/20 rounded-2xl border border-stone-800 border-dashed">
                            <ListVideo size={48} className="mx-auto text-stone-700 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">This playlist is empty</h2>
                            <p className="text-stone-500 text-sm">Add videos to this playlist to see them here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {videos.map((vid, index) => (
                                <Link 
                                    to={`/watch/${vid._id}`} 
                                    key={vid._id} 
                                    className="flex gap-4 p-3 rounded-xl hover:bg-stone-900 transition-colors group"
                                >
                                    <div className="flex items-center text-stone-500 font-medium px-2 group-hover:text-white">
                                        {index + 1}
                                    </div>
                                    <div className="relative w-40 shrink-0 aspect-video bg-stone-800 rounded-lg overflow-hidden">
                                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                                            {Math.floor(vid.duration / 60)}:{Math.floor(vid.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="flex flex-col py-1">
                                        <h3 className="text-white font-medium line-clamp-2 leading-tight group-hover:text-blue-400">
                                            {vid.title}
                                        </h3>
                                        <div className="text-stone-400 text-xs mt-1.5 flex flex-col gap-0.5">
                                            <span className="hover:text-white">{vid.userDetails?.fullname}</span>
                                            <span>{vid.views} views</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-stone-800 shadow-2xl">
                        <div className="flex justify-between items-center p-5 border-b border-stone-800">
                            <h2 className="text-xl font-bold text-white">Edit Playlist</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-stone-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdatePlaylist} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Title</label>
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Description</label>
                                <textarea 
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none h-24"
                                />
                                
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <input 
                                    type="checkbox" 
                                    id="editIsPrivate"
                                    checked={editIsPrivate}
                                    onChange={(e) => setEditIsPrivate(e.target.checked)}
                                    className="w-5 h-5 rounded border-stone-700 bg-stone-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-stone-900 cursor-pointer"
                                />
                                <label htmlFor="editIsPrivate" className="text-stone-300 text-sm font-medium cursor-pointer select-none">
                                    Keep this playlist private
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-full font-bold text-stone-300 hover:bg-stone-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUpdating} className="px-5 py-2.5 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700">
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Playlist;