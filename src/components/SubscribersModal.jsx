import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { Link } from 'react-router-dom';
import { X } from 'lucide-react'; 

function SubscribersModal({ isOpen, onClose, channelId }) {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/subscriptions/s/${channelId}`);
                setSubscribers(response.data.data);
            } catch (error) {
                console.error("Error fetching subscribers:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (isOpen && channelId) {
            
            fetchSubscribers();
        }
    }, [isOpen, channelId]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

        
            <div className="relative w-full max-w-md bg-[#0c0a09] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                
            
                <div className="flex items-center justify-between p-4 border-b border-stone-800">
                    <h3 className="text-xl font-bold text-white">
                        Your Subscribers
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

            
                <div className="overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="text-stone-400 text-center py-8">Loading your audience...</div>
                    ) : subscribers.length === 0 ? (
                        <div className="text-stone-400 text-center py-8">No subscribers yet. Keep creating!</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {subscribers.map((sub) => {
                                const user = sub.subscribers; 
                                return (
                                    <Link 
                                        key={sub._id}
                                        to={`/channel/${user.username}`}
                                        onClick={onClose} 
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                                    >
                                        <img 
                                            src={user.avatar} 
                                            alt={user.fullname} 
                                            className="w-12 h-12 rounded-full object-cover bg-stone-900 border border-stone-700"
                                        />
                                        <div className="flex flex-col">
                                            <h4 className="text-white font-medium text-base leading-tight">
                                                {user.fullname}
                                            </h4>
                                            <p className="text-stone-400 text-sm mt-0.5">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubscribersModal;