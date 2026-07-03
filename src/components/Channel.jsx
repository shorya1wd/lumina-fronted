import {useState,useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { IoCameraOutline } from "react-icons/io5";
import UploadModal from "./UploadModal";
import {IoCloudUploadOutline} from "react-icons/io5";
import PublishModal from "./PublishModal";
import { IoEllipsisVertical } from "react-icons/io5";
import VideoDetailModal from "./VideoDetailModal";
import UpdateThumbnail from "./UpdateThumbnail";
import { Link } from 'react-router-dom';
import ChannelTweets from "./ChannelTweets";
import ChannelPlaylist from './ChannelPlaylist'

function Channel(){
    const {username}=useParams()
    const {user:currentUser}=useAuth()

    const [channel,setChannel]=useState(null)
    const [loading,setLoading]=useState(true)
    const [video,setVideo]=useState([])
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [publishingVideoId, setPublishingVideoId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editDetailVideoId,setEditDetailVideoId] = useState(null);
    const [updateThumbnailVideoId,setUpdateThumbnailVideoId] = useState(null);
    const [activeTab, setActiveTab] = useState('videos');

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

    const avatarInputRef=useRef(null)
    const coverImageInputRef=useRef(null)

    const isOwnProfile=currentUser?.username===username

    const handleImageUpload=async(e,type)=>{
        const file=e.target.files[0]
        if(!file) return

        const formData=new FormData()
        formData.append(type,file)

        try {
            setLoading(true)
            const endpoint=type==='avatar' ? 'user/update-avatar' : 'user/update-coverimage'
            const response=await api.patch(endpoint,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            setChannel(prev=>({...prev,[type]:response.data.data[type]}))
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleDeleteVideo = async (videoId) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this video? This action cannot be undone.");
    
    if (!isConfirmed) return; 

    try {
        await api.delete(`/videos/${videoId}`); 
        
        setVideo((prevVideos) => prevVideos.filter((vid) => vid._id !== videoId));
        
        setOpenMenuId(null);
        
    } catch (error) {
        console.error("Failed to delete video:", error);
        alert("Something went wrong while trying to delete the video.");
    }
};

    const handlePublishToggleSuccess = (videoId, newStatus) => {
    setVideo((prevVideos) => 
        prevVideos.map((vid) => 
            vid._id === videoId ? { ...vid, isPublished: newStatus } : vid
        )
    );
};

const handleThumbnailUpdateSuccess = (videoId, newThumbnailUrl) => {
    setVideo((prevVideos) => 
        prevVideos.map((vid) => 
            vid._id === videoId ? { ...vid, thumbnail: newThumbnailUrl } : vid
        )
    );
};

const handleDetailsUpdateSuccess = (videoId, newTitle, newDescription) => {
    setVideo((prevVideos) => 
        prevVideos.map((vid) => 
            vid._id === videoId 
                ? { ...vid, title: newTitle, description: newDescription } 
                : vid
        )
    );
};

const handleNewVideoUploaded = (newVideo) => {
        setVideo(prevVideos => [newVideo, ...prevVideos]);
    };

    useEffect(()=>{
        const fetchChannelProfile=async()=>{
            try {
               const response= await api.get(`/user/channel/${username}`)
               setChannel(response.data.data)
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchChannelProfile()
    },[username])

    useEffect(()=>{
    
        const fetchUserChannelVideos=async()=>{
            try {
                const response=await api.get(`/videos/u/${username}`)
                setVideo(response.data.data || []) 
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserChannelVideos()
    },[username])

    const handleSubscribe = async () => {
        try {

            await api.post(`/subscriptions/s/${channel._id}`);
            
            setChannel(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed 
                    ? prev.subscribersCount - 1 
                    : prev.subscribersCount + 1
            }));
            window.dispatchEvent(new Event('subscriptionChanged'));
        } catch (error) {
            console.error("Error toggling subscription:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); 
            }
        };
        
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    if(loading){
        return(
        <div className="h-screen bg-stone-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
        )
    }

    if (!channel) return (
        <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
            <h2 className="text-2xl font-bold text-stone-500">Channel not found.</h2>
        </div>
    )

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 pb-8">
            <div className="w-full h-48 md:h-80 bg-stone-900 relative group">
                <img src={channel.coverImage} alt="coverImage" className="w-full h-full object-cover"/>

                {isOwnProfile &&(
                    <>
                        <input
                            type="file"
                            ref={coverImageInputRef}
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'coverImage')} 
                        />
                        <button
                            onClick={() => coverImageInputRef.current.click()}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <IoCameraOutline className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}
            </div>

            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8" >
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 sm:-mt-16 mb-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                        <div className="relative group flex shrink-0 ">
                            <img src={channel.avatar} alt="Avatar" className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4  border-stone-950 object-cover bg-stone-900 " />

                            {isOwnProfile && (
                                <>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, 'avatar')} 
                                    />
                                    <button
                                        onClick={() => avatarInputRef.current.click()}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <IoCameraOutline className="w-6 h-6 text-white" />
                                    </button>
                                </>
                            )}

                            
                        </div>

                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-extrabold">{channel.fullname}</h1>
                            <p className="text-stone-400 font-medium">@{channel.username}</p>
                            <p className="text-sm text-stone-500 mt-1"><span className="text-stone-300 font-bold">{channel.subscribersCount}</span> subscribers</p>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:mb-4 w-full sm:w-auto">
                            {isOwnProfile ?(
                                <>
                                    <button 
                                        onClick={() => setIsUploadOpen(true)}
                                        className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold transition-colors bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center gap-2 shadow-lg"
                                        >
                                        <IoCloudUploadOutline className="w-5 h-5" />
                                        Upload Video
                                    </button>
                                    {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUploadSuccess={handleNewVideoUploaded}/>}
                                </>
                            ):(
                                <button 
                                    onClick={handleSubscribe}
                                    className={`font-bold px-6 py-2.5 rounded-full text-base transition-colors ${
                                    channel.isSubscribed 
                                    ? "bg-stone-800 text-stone-300 hover:bg-stone-700" 
                                    : "bg-white text-black hover:bg-stone-200"         
                                    }`}
                                >
                                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                            )}
                    </div>
                </div>


                {/* --- 1. THE NAVIGATION TABS --- */}
                <div className="border-b border-stone-800 mb-6">
                    <nav className="flex gap-8">
                        <button 
                            onClick={() => setActiveTab('videos')} 
                            className={`pb-3 font-medium transition-colors ${activeTab === 'videos' ? 'text-white border-b-2 border-white' : 'text-stone-500 hover:text-stone-300 border-b-2 border-transparent'}`}
                        >
                            Videos
                        </button>
                        <button onClick={() => setActiveTab('playlists')} className="text-stone-500 hover:text-stone-300 pb-3 font-medium transition-colors border-b-2 border-transparent">
                            Playlists
                        </button>
                        <button 
                            onClick={() => setActiveTab('tweets')} 
                            className={`pb-3 font-medium transition-colors ${activeTab === 'tweets' ? 'text-white border-b-2 border-white' : 'text-stone-500 hover:text-stone-300 border-b-2 border-transparent'}`}
                        >
                            Posts
                        </button>
                    </nav>
                </div>

                {activeTab === 'playlists' && (
                    <ChannelPlaylist userId={channel._id} />
                )}


                {/* --- 2. TWEETS TAB CONTENT --- */}
                {activeTab === 'tweets' && (
                    <ChannelTweets 
                        userId={channel._id} 
                        currentUserId={currentUser?._id}
                        userAvatar={channel.avatar}
                        userFullName={channel.fullname} 
                    />
                )}


                {/* --- 3. VIDEOS TAB CONTENT --- */}
                {activeTab === 'videos' && (
                    <div className="mb-8">
                        {video.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-36">
                                
                                {video.map((vid) => (
                                    <div key={vid._id} className="group cursor-pointer">

                                        <Link to={`/watch/${vid._id}`}>
                                            <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-900 mb-3 cursor-pointer group">
                                                <img 
                                                    src={vid.thumbnail} 
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                                    alt={vid.title}
                                                />
                                    
                                                <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-1 rounded font-medium">
                                                    {Math.floor(vid.duration / 60)}:{Math.floor(vid.duration % 60).toString().padStart(2, '0')}
                                                </span>
                                    
                                                {!vid.isPublished && (
                                                    <span className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded font-bold">
                                                        Private
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                        
                                        <div className="flex gap-3 relative mt-3">
                                            <div className="w-full pr-8">
                                                <h3 className="font-bold line-clamp-2">{vid.title}</h3>
                                                <p className="text-stone-500 text-xs mb-2">{vid.views} views • {new Date(vid.createdAt).toLocaleDateString()}</p>
                                                
                                                {isOwnProfile && (
                                                    <div className="absolute top-0 right-0" >
                                                        <button 
                                                            onClick={() => setOpenMenuId(openMenuId === vid._id ? null : vid._id)}
                                                            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                                                        >
                                                            <IoEllipsisVertical className="w-5 h-5" />
                                                        </button>

                                                        {openMenuId === vid._id && (
                                                            <>
                                                            <div 
                                                                    className="fixed inset-0 z-40" 
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                ></div>
                                                            <div className="absolute right-0 mt-1 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                                                                <button 
                                                                    onClick={() => { setPublishingVideoId(vid._id); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors border-b border-stone-800/50"
                                                                >
                                                                    Edit Visibility
                                                                </button>

                                                                <button 
                                                                    onClick={() => { setUpdateThumbnailVideoId(vid._id); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors border-b border-stone-800/50"
                                                                >
                                                                    Change Thumbnail
                                                                </button>

                                                                <button 
                                                                    onClick={() => { setEditDetailVideoId(vid._id); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition-colors border-b border-stone-800/50"
                                                                >
                                                                    Edit Details
                                                                </button>
                                    
                                                                <button 
                                                                    onClick={() => { handleDeleteVideo(vid._id); setOpenMenuId(null); }}
                                                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-900/20 transition-colors"
                                                                >
                                                                    Delete Video
                                                                </button>
                                                            </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Modals for this specific video */}
                                        {publishingVideoId === vid._id && (
                                            <PublishModal 
                                                videoId={vid._id} 
                                                initialStatus={vid.isPublished} 
                                                onClose={() => setPublishingVideoId(null)} 
                                                onSuccess={handlePublishToggleSuccess}
                                            />
                                        )}
                                        {editDetailVideoId === vid._id && (
                                            <VideoDetailModal 
                                                videoId={vid._id}
                                                onClose={() => setEditDetailVideoId(null)} 
                                                title={vid.title}
                                                description={vid.description}
                                                onSuccess={handleDetailsUpdateSuccess}
                                            />
                                        )}
                                        {updateThumbnailVideoId === vid._id && (
                                            <UpdateThumbnail 
                                                videoId={vid._id}
                                                onClose={() => setUpdateThumbnailVideoId(null)}
                                                onSuccess={handleThumbnailUpdateSuccess}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="col-span-full text-stone-500 text-center py-20 border-2 border-dashed border-stone-800 rounded-xl">
                                <h1 className="text-xl">This channel has no videos yet.</h1>
                            </div>      
                        )}
                    </div>
                )}


            </div>
        </div>
    )
}

export default Channel