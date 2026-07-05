import {useState} from 'react'
import api from '../api/axiosInstance'
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import toast from 'react-hot-toast';

function UploadModal({onClose,onUploadSuccess}) {

    const [thumbnail,setThumbnail]=useState(null)
    const [video,setVideo]=useState(null)
    const [title,setTitle]=useState("")
    const [description,setDescription]=useState("")
    const [loading,setLoading]=useState(false)

    const handleUpload = async(e) => {
        e.preventDefault()

        if (!video || !thumbnail || !title || !description) {
            toast.error("Please provide a title, video, description and thumbnail.");
            return;
        }
        setLoading(true)
        const formData=new FormData()
        formData.append("thumbnail",thumbnail)
        formData.append("videoFile",video)
        formData.append("title",title)
        formData.append("description",description)

        try {
            const response=await api.post("/videos", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success("Video uploaded successfully!");
            if (onUploadSuccess) {
                onUploadSuccess(response.data.data); 
            }
            onClose()
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to upload video");
        }finally{
            setLoading(false)
        }
    }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-stone-900 w-full max-w-2xl rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative">

            <div className="flex items-center justify-between p-6 border-b border-stone-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <IoCloudUploadOutline className="text-orange-500 w-6 h-6"/>
                        Upload Video
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-stone-400 hover:text-white transition-colors p-1"
                        disabled={loading}
                    >
                        <IoCloseOutline className="w-6 h-6" />
                    </button>
                </div>



            <form onSubmit={handleUpload} className="p-6 space-y-6">
                <div>
                <label htmlFor="title" className="block text-sm font-medium text-stone-300 mb-2">Title</label>
                <input type="text" id="title" required className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Video title..." value={title} onChange={(e)=>setTitle(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-stone-300 mb-2">Description</label>
                <input type="text" id="description" required className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Video description..." value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-stone-950 border border-dashed border-stone-700 rounded-xl p-4 text-center">
                <label htmlFor="video" className="block text-sm font-medium text-stone-300 mb-2">Video</label>
                <input type="file" name="video" accept='video/*' required onChange={(e)=>setVideo(e.target.files[0])} className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700 transition-all w-full"/>
            </div>
            <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-stone-300 mb-2">Thumbnail</label>
                <input type="file" name="thumbnail" accept='image/*' required onChange={(e)=>setThumbnail(e.target.files[0])} className="text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700 transition-all w-full"/>
            </div>
            </div>
            <div className="pt-4 border-t border-stone-800 flex justify-end">
            <button type="submit" disabled={loading} className={`px-6 py-2.5 rounded-full font-bold transition-colors ${loading ? 'bg-stone-700 text-stone-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                {loading ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            Uploading...
                        </span>
                    ) : (
                        "Upload"
                    )}
            </button>
            </div>
            </form>
            
        </div>
    </div>
  )
}

export default UploadModal