import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ThumbsUp, Trash2, MessageSquare,Pencil } from 'lucide-react';


function ChannelTweets({ userId, currentUserId , userAvatar, userFullName}) {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTweetContent, setNewTweetContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTweetId, setEditingTweetId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                
                const response = await api.get(`/tweets/t/${userId}`);
                const fetchedData = response.data.data;
                setTweets(fetchedData.docs || []);
            } catch (error) {
                console.error("Error fetching tweets:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchTweets();
        }
    }, [userId]);

    
    const handleCreateTweet = async (e) => {
        e.preventDefault();
        if (!newTweetContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post("/tweets/t/", {
                content: newTweetContent
            });

            const newTweet = response.data.data;
            newTweet.userDetails = {
                fullname: userFullName,
                avatar: userAvatar
            };

            setTweets(prevTweets => {
                const safePrevTweets = Array.isArray(prevTweets) ? prevTweets : [];
                return [newTweet, ...safePrevTweets];
            })
            
            setNewTweetContent('');
        } catch (error) {
            console.error("Error creating tweet:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerEditMode = (tweetId, currentContent) => {
        setEditingTweetId(tweetId);
        setEditContent(currentContent);
    };

    const handleEditTweet=async(tweetId)=>{
        if (!editContent.trim()) return;
        
        setIsUpdating(true);
        try {
            await api.patch(`/tweets/t/${tweetId}`, {
                content: editContent
            });
            
            setTweets(tweets.map(tweet => 
                tweet._id === tweetId 
                ? { ...tweet, content: editContent } 
                : tweet
            ));
            
            setEditingTweetId(null);
        } catch (error) {
            console.error("Error updating tweet:", error);
        } finally {
            setIsUpdating(false);
        }
    }
    
    const handleDeleteTweet = async (tweetId) => {
        try {
            await api.delete(`/tweets/t/${tweetId}`);
            
            setTweets(tweets.filter(tweet => tweet._id !== tweetId));
        } catch (error) {
            console.error("Error deleting tweet:", error);
        }
    };

    const handleToggleLike = async (tweetId) => {
        if (!currentUserId) {
            toast.error("Please sign in to like posts!");
            return; 
        }
    setTweets(tweets.map(tweet => {
            if (tweet._id === tweetId) {
                
                const currentCount = tweet.likesCount || 0; 
                
                return {
                    ...tweet,
                    isLiked: !tweet.isLiked, 
                    likesCount: tweet.isLiked ? currentCount - 1 : currentCount + 1 
                };
            }
            return tweet;
        }));

        try {
            await api.post(`/likes/toggle/t/${tweetId}`); 
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
};

    
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) return <div className="text-stone-400 py-8 text-center">Loading community posts...</div>;

    
    const isOwner = currentUserId === userId;

    return (
        <div className="w-full max-w-4xl mx-auto py-6">
            
            {isOwner && (
                <div className="mb-8 bg-stone-900 rounded-xl p-4 border border-stone-800">
                    <form onSubmit={handleCreateTweet} className="flex flex-col gap-3">
                        <textarea
                            value={newTweetContent}
                            onChange={(e) => setNewTweetContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent text-white placeholder-stone-500 resize-none outline-none text-lg min-h-[80px]"
                            maxLength={500}
                        />
                        <div className="flex items-center justify-between border-t border-stone-800 pt-3">
                            <span className="text-xs text-stone-500 font-medium">
                                {newTweetContent.length}/500
                            </span>
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !newTweetContent.trim()}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            
            {!Array.isArray(tweets) || tweets.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                    <MessageSquare size={48} className="text-stone-700 mb-4" />
                    <p className="text-stone-400 text-lg">No posts yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {tweets.map((tweet) => (
                        <div key={tweet._id} className="bg-[#0c0a09] border border-stone-800 rounded-xl p-5 hover:bg-stone-900/50 transition-colors">
                            
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={tweet.userDetails?.avatar} 
                                        alt={tweet.userDetails?.fullname} 
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold leading-tight">
                                            {tweet.userDetails?.fullname}
                                        </span>
                                        <span className="text-stone-500 text-xs mt-0.5">
                                            {timeAgo(tweet.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {currentUserId === tweet.owner && (
                                    <div>
                                    <button 
                                        onClick={() => handleDeleteTweet(tweet._id)}
                                        className="text-stone-500 hover:text-red-500 p-2 rounded-full hover:bg-stone-800 transition-colors"
                                        title="Delete post"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button 
                                       onClick={() => triggerEditMode(tweet._id, tweet.content)}
                                        className="text-stone-500 hover:text-red-500 p-2 rounded-full hover:bg-stone-800 transition-colors"
                                        title="Edit post"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    </div>
                                )}
                            </div>

                            {editingTweetId === tweet._id ? (
                                <div className="mt-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full bg-stone-950 text-white border border-stone-700 rounded-lg p-3 outline-none focus:border-white resize-none min-h-[80px]"
                                    />
                                    <div className="flex justify-end gap-3 mt-3">
                                        <button 
                                            onClick={() => setEditingTweetId(null)}
                                            className="px-4 py-1.5 rounded-full text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleEditTweet(tweet._id)}
                                            disabled={isUpdating || !editContent.trim()}
                                            className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-black hover:bg-stone-200 disabled:opacity-50 transition-colors"
                                        >
                                            {isUpdating ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-stone-200 whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {tweet.content}
                                    </p>

                                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-stone-800/50">
                                        <button 
                                            onClick={() => handleToggleLike(tweet._id)}
                                            className={`flex items-center gap-2 transition-colors ${tweet.isLiked ? "text-white" : "text-stone-400 hover:text-white"}`}
                                        >
                                            <ThumbsUp size={18} fill={tweet.isLiked ? "white" : "none"} />
                                            <span className="text-sm font-medium">{tweet.likesCount || 0}</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChannelTweets;