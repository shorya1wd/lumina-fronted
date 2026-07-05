import { useState, useEffect } from 'react';
import api from "../api/axiosInstance";
import { ThumbsUp, Trash2, Pencil, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function VideoComments({ videoId, currentUserId, currentUserAvatar, currentUserFullName, currentUsername, videoOwnerId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/comments/c/${videoId}`);
            
                const fetchedData = response.data.data;
                setComments(fetchedData.docs || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchComments();
    }, [videoId]);

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post(`/comments/c/${videoId}`, {
                content: newCommentContent
            });
            
            const newComment = response.data.data;
            newComment.userDetails = {
                fullname: currentUserFullName,
                avatar: currentUserAvatar,
                username: currentUsername
            };
            
            setComments(prev => [newComment, ...(Array.isArray(prev) ? prev : [])]);
            setNewCommentContent(''); 
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerEditMode = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
    };

    const handleUpdateComment = async (commentId) => {
        if (!editContent.trim()) return;
        
        setIsUpdating(true);
        try {
            await api.patch(`/comments/c/${commentId}`, {
                content: editContent
            });
            
            setComments(comments.map(comment => 
                comment._id === commentId ? { ...comment, content: editContent } : comment
            ));
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error updating comment:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/c/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleToggleLike = async (commentId) => {
         if (!currentUserId) {
            toast.error("Please sign in to like posts!");
            return; 
        }
        
        setComments(comments.map(comment => {
            if (comment._id === commentId) {
                const currentCount = comment.likesCount || 0;
                return {
                    ...comment,
                    isLiked: !comment.isLiked, 
                    likesCount: comment.isLiked ? currentCount - 1 : currentCount + 1 
                };
            }
            return comment;
        }));
    
        try {
            await api.post(`/likes/toggle/c/${commentId}`); 
        } catch (error) {
            console.error("Failed to toggle like", error);
    
        }
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="w-full mt-6">
            <h3 className="text-xl font-bold text-white mb-6">
                {comments.length} Comments
            </h3>

            {currentUserId ? (
                <div className="flex gap-4 mb-10">
                    <img 
                        src={currentUserAvatar || "/default-avatar.png"} 
                        alt="Your Avatar" 
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <form onSubmit={handleCreateComment} className="flex-1 flex flex-col items-end gap-2">
                        <textarea
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-transparent text-white border-b border-stone-700 pb-2 outline-none focus:border-white resize-none min-h-[30px] transition-colors"
                            rows={newCommentContent.split('\n').length || 1}
                        />
                        {newCommentContent.trim() && (
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-full text-sm font-bold bg-white text-black hover:bg-stone-200 disabled:opacity-50 transition-colors mt-2"
                            >
                                {isSubmitting ? "Commenting..." : "Comment"}
                            </button>
                        )}
                    </form>
                </div>
            ) : (
                <p className="text-stone-400 mb-8">Please log in to leave a comment.</p>
            )}

            {loading ? (
                <div className="text-stone-400 py-4">Loading comments...</div>
            ) : (
                <div className="flex flex-col gap-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group">
                    
                            <Link to={`/channel/${comment.userDetails?.username}`}>
                                <img 
                                    src={comment.userDetails?.avatar || "/default-avatar.png"} 
                                    alt={comment.userDetails?.fullname} 
                                    className="w-10 h-10 rounded-full object-cover shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            </Link>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Link to={`/channel/${comment.userDetails?.username}`}>
                                        <span className="text-white font-medium text-[13px] leading-none hover:text-stone-300 transition-colors cursor-pointer">
                                            @{comment.userDetails?.username || "user"}
                                        </span>
                                    </Link>
                                    <span className="text-stone-500 text-xs">
                                        {timeAgo(comment.createdAt)}
                                    </span>
                                </div>

                                {editingCommentId === comment._id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full bg-stone-950 text-white border-b border-stone-500 pb-2 outline-none focus:border-white resize-none"
                                        />
                                        <div className="flex justify-end gap-3 mt-3">
                                            <button 
                                                onClick={() => setEditingCommentId(null)}
                                                className="px-4 py-1.5 rounded-full text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateComment(comment._id)}
                                                disabled={isUpdating || !editContent.trim()}
                                                className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-black hover:bg-stone-200 disabled:opacity-50 transition-colors"
                                            >
                                                {isUpdating ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-stone-200 text-sm whitespace-pre-wrap leading-relaxed">
                                            {comment.content}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2">
                                            <button 
                                            onClick={() => handleToggleLike(comment._id)}
                                            className={`flex items-center gap-1.5 transition-colors ${comment.isLiked ? "text-white" : "text-stone-400 hover:text-white"}`}>
                                                <ThumbsUp size={14} fill={comment.isLiked ? "white" : "none"} />
                                                <span className="text-xs font-medium">{comment.likesCount || 0}</span>
                                            </button>
                                            
                                            {(String(currentUserId) === String(comment.owner) || String(currentUserId) === String(videoOwnerId)) && (
                                                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    {String(currentUserId) === String(comment.owner) && (
                                                        <button 
                                                            onClick={() => triggerEditMode(comment._id, comment.content)}
                                                            className="text-stone-500 hover:text-white p-1.5 rounded-full hover:bg-stone-800 transition-colors"
                                                            title="Edit comment"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-stone-500 hover:text-red-500 p-1.5 rounded-full hover:bg-stone-800 transition-colors"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VideoComments;