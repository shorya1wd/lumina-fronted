import { useState } from "react"
import api from "../api/axiosInstance"
import { IoCloseOutline } from "react-icons/io5"

function PublishModal({onClose,videoId,initialStatus=false,onSuccess}) {


  const [isPublished, setPublish] = useState(initialStatus)
  const [loading, setLoading] = useState(false)


  const handlePublish = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.patch(`/videos/publish-status/${videoId}`,{isPublished})
      onClose()
      const newStatus =response.data.data ? response.data.data.isPublished : !initialStatus
      onSuccess(videoId, newStatus)

    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
    
  }

return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            
          
            <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative">
                
            
                <div className="flex items-center justify-between p-6 border-b border-stone-800">
                    <h2 className="text-xl font-bold text-white">Video Visibility</h2>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="text-stone-400 hover:text-white transition-colors p-1"
                    >
                        <IoCloseOutline className="w-6 h-6" />
                    </button>
                </div>

            
                <form onSubmit={handlePublish} className="p-6 space-y-6">
                    
                
                    <div className="flex items-center justify-between bg-stone-950 p-4 rounded-xl border border-stone-800">
                        <div>
                            <h3 className="text-white font-medium">Publish Video</h3>
                            <p className="text-sm text-stone-500 mt-1">
                                {isPublished ? "This video will be visible to everyone." : "This video is private."}
                            </p>
                        </div>
                        
                    
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isPublished} 
                                onChange={() => setPublish(!isPublished)} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

            
                    <div className="pt-4 flex justify-end gap-4">
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
                            disabled={loading} 
                            className={`px-6 py-2.5 rounded-full font-bold transition-colors shadow-lg ${loading ? 'bg-stone-700 text-stone-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>  
            </div>   
        </div>
    );
}

export default PublishModal