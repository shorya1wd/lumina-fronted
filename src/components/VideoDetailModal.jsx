import {useState} from 'react'
import api from '../api/axiosInstance'
import { IoCloseOutline, IoPencilOutline } from "react-icons/io5";

function VideoDetailModal({onClose,videoId,title,description,onSuccess}) {
  const [updatedTitle, setUpdatedTitle] = useState(title)
  const [updatedDescription, setUpdatedDescription] = useState(description)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
        const response=await api.patch(`/videos/${videoId}`, {
            newTitle: updatedTitle,
            newDescription: updatedDescription
        })
        if (response.data.data) {
            const { title, description } = response.data.data;
            onSuccess(videoId, title, description); 
        }
        onClose()
    } catch (error) {
        console.log(error)
    }finally{
        setLoading(false)
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            
            <div className="bg-stone-900 w-full max-w-2xl rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <IoPencilOutline className="text-orange-500 w-6 h-6"/>
                        Edit Video Details
                    </h2>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="text-stone-400 hover:text-white transition-colors p-1"
                    >
                        <IoCloseOutline className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-stone-300 mb-2">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            required
                            value={updatedTitle} 
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                    
                    {/* Description Textarea */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-stone-300 mb-2">Description</label>
                        <textarea 
                            id="description" 
                            rows="5"
                            required
                            value={updatedDescription} 
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-stone-800 flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-full font-bold text-stone-300 hover:bg-stone-800 transition-colors"
                        >
                            Cancel
                        </button>
                        {/* 4. Added Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg ${loading ? 'bg-stone-700 text-stone-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VideoDetailModal