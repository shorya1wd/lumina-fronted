import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react'
import api from '../api/axiosInstance'
import { Link } from 'react-router-dom'
import VideoComments from './VideoComments'
import { useAuth } from "../context/AuthContext";
import { ThumbsUp } from 'lucide-react';
import SaveToPlaylistModal from '../components/SaveToPlaylistModal'; 
import { ListPlus } from 'lucide-react';

function VideoPlayerPage() {
  const { user: currentUser } = useAuth();
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasViewed, setHasViewed] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/videos/${videoId}`)
        setVideo(response.data.data)
        if (response.data.data.ownerDetails?.isSubscribed) {
                    setIsSubscribed(true);
                } else {
                    setIsSubscribed(false);
                }
      } catch (error) {
        console.error('Error fetching video:', error)
      }finally{
        setLoading(false)
      }
    }
    
    fetchVideo()
  }, [videoId])

  const handleVideoPlay = async() => {
    if (hasViewed) {
      return
    }
    try {
      const response=await api.patch(`/videos/view/${videoId}`)
      const newTotalViews = response.data.data?.views;

      if (newTotalViews) {
            setVideo(prev => ({ ...prev, views: newTotalViews }));
        }
      setHasViewed(true)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const handleSubscribe=async()=>{
    try {
      await api.post(`/subscriptions/s/${video.ownerDetails._id}`)
      setIsSubscribed(!isSubscribed)

      setVideo(prev => ({
            ...prev,
            ownerDetails: {
                ...prev.ownerDetails,
                susbscribersCount: isSubscribed 
                    ? prev.ownerDetails.susbscribersCount - 1 
                    : prev.ownerDetails.susbscribersCount + 1
            }
        }));
    } catch (error) {
      console.error('Error subscribing to channel:', error)
    }
  }


      const handleToggleLike = async (videoId) => {
         if (!currentUser) {
            alert("Please sign in to like posts!");
            return; 
        }
      setVideo(prev => {
          if (prev._id === videoId) {
            const currentCount = prev.likesCount || 0;
                
                return {
                    ...prev,
                    isLiked: !prev.isLiked, 
                    likesCount: prev.isLiked ? currentCount - 1 : currentCount + 1 
                };
          }
          return prev;
      });
  
      try {
          await api.post(`/likes/toggle/v/${videoId}`); 
      } catch (error) {
          console.error("Failed to toggle like", error);
  
      }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading video...</div>;
if (!video) return <div className="text-white text-center mt-20">Video not found.</div>;
  
  return (
        <div className="max-w-6xl mx-auto p-4">
            
            {/* 1. VIDEO PLAYER */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                <video 
                    src={video.videoFile}
                    poster={video.thumbnail}
                    controls 
                    autoPlay
                    onPlay={handleVideoPlay}
                    className="w-full h-full object-contain bg-black"
                ></video>
            </div>

            {/* 2. TITLE (Full width, wraps safely) */}
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-4 leading-tight wrap-break-word">
                {video.title}
            </h1>

            {/* 3. ACTIONS ROW */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 mb-6">
                
                {/* LEFT SIDE: Channel Info + Subscribe */}
                <div className="flex items-center gap-4">
                    <Link to={`/channel/${video.ownerDetails?.username}`}>
                        <img 
                            src={video.ownerDetails?.avatar} 
                            alt={video.ownerDetails?.username} 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                    </Link>
        
                    <div className='flex flex-col pr-2'>
                        <Link to={`/channel/${video.ownerDetails?.username}`}>
                            <h3 className="text-white font-bold text-base sm:text-lg leading-none hover:text-stone-300 transition-colors">
                                {video.ownerDetails?.username}
                            </h3>
                        </Link>
                        <p className="text-stone-400 text-xs sm:text-sm mt-1">
                            {video.ownerDetails?.susbscribersCount} subscribers
                        </p>
                    </div>

                    <button 
                        onClick={handleSubscribe}
                        className={`font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm sm:text-base transition-colors ${
                        isSubscribed 
                        ? "bg-stone-800 text-stone-300 hover:bg-stone-700" 
                        : "bg-white text-black hover:bg-stone-200"         
                        }`}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </div>

                {/* RIGHT SIDE: Video Actions (Like, Save) */}
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
                    
                    <button 
                        onClick={() => handleToggleLike(video._id, video.isLiked)}
                        className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-stone-800 hover:bg-stone-700 rounded-full transition-colors whitespace-nowrap"
                    >
                        <ThumbsUp size={18} fill={video.isLiked ? "white" : "none"} className={video.isLiked ? "text-white" : "text-stone-400"} />
                        <span className={`text-sm sm:text-base font-medium ${video.isLiked ? "text-white" : "text-stone-300"}`}>
                            {video.likesCount || 0}
                        </span>
                    </button>

                    <button 
                        onClick={() => setIsSaveModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-stone-800 hover:bg-stone-700 rounded-full text-white font-medium transition-colors whitespace-nowrap"
                    >
                        <ListPlus size={18} />
                        <span className="text-sm sm:text-base">Save</span>
                    </button>

                    {/* MODAL MOVED HERE SO IT DOESN'T BREAK FLEXBOX */}
                    {isSaveModalOpen && (
                        <SaveToPlaylistModal 
                            videoId={videoId} 
                            onClose={() => setIsSaveModalOpen(false)} 
                        />
                    )}
                </div>

            </div>
            
            {/* 4. DESCRIPTION & COMMENTS */}
            <div className="mt-4 bg-stone-900 rounded-xl p-4 sm:p-5 text-stone-300">
                {/* Views and Date moved inside the description box! */}
                <div className="text-white font-bold text-sm sm:text-base mb-2">
                  {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                </div>
                
                <p className="whitespace-pre-wrap text-sm sm:text-base mb-6">{video.description}</p>
                
                <div className="border-t border-stone-800 pt-6">
                    <VideoComments 
                        videoId={videoId} 
                        currentUserId={currentUser?._id}
                        currentUserAvatar={currentUser?.avatar}
                        currentUserFullName={currentUser?.fullname}
                        currentUsername={currentUser?.username}
                    />
                </div>
            </div>

        </div>
    );
}

export default VideoPlayerPage