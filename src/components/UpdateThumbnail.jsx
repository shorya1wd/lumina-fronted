import { useState, useEffect } from 'react';
import api from '../api/axiosInstance.js';
import { IoCloseOutline, IoImageOutline } from "react-icons/io5";
import toast from 'react-hot-toast';

function UpdateThumbnail({ onClose, videoId ,onSuccess}) {
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null); 
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thumbnail) {
            toast.error("Please select a new thumbnail image.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("thumbnail", thumbnail);
            
            const response=await api.patch(`/videos/thumbnail/${videoId}`, formData);

            console.log(response.data)

            const newThumbnailUrl = response.data.data.thumbnail;

            if(newThumbnailUrl){
                toast.success("Thumbnail updated successfully!");
                onSuccess(videoId, newThumbnailUrl);
            }

            onClose();
            
        } catch (error) {
            console.error("Failed to update thumbnail:", error);
            toast.error(error.response?.data?.message || "Failed to upload thumbnail. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            
            <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative">

                <div className="flex items-center justify-between p-6 border-b border-stone-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <IoImageOutline className="text-orange-500 w-6 h-6"/>
                        Update Thumbnail
                    </h2>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="text-stone-400 hover:text-white transition-colors p-1"
                    >
                        <IoCloseOutline className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    <div className="w-full aspect-video bg-stone-950 border-2 border-dashed border-stone-700 rounded-xl overflow-hidden flex items-center justify-center relative group">
                        {preview ? (
                            <img src={preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-stone-500">
                                <IoImageOutline className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <span className="text-sm">No image selected</span>
                            </div>
                        )}
                        
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            title="Click to select a new thumbnail"
                        />
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white font-bold bg-stone-900/80 px-4 py-2 rounded-lg">
                                {preview ? "Change Image" : "Select Image"}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-full font-bold text-stone-300 hover:bg-stone-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !thumbnail} 
                            className={`px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg ${loading || !thumbnail ? 'bg-stone-700 text-stone-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                            {loading ? "Uploading..." : "Save Thumbnail"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateThumbnail;