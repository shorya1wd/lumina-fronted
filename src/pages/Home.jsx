import {useState,useEffect} from 'react'
import api from '../api/axiosInstance'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Home() {

  const [videos,setVideos]=useState([])
  const [loading,setLoading]=useState(true)
  const [sortOption, setSortOption] = useState('latest')

  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('query') || ""

  useEffect(()=>{
    const fetchVideos=async()=>{
      setLoading(true)
      try {
        const response=await api.get("/videos/",{
          params:{
            query:searchQuery,
            sortBy: sortOption === 'popular' ? 'views' : 'createdAt',
            sortType: sortOption === 'oldest' ? 'asc' : 'desc'
          }
        })
        setVideos(response.data.data.docs || [])
      } 
      catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
    fetchVideos()
  },[searchQuery, sortOption])

  if (loading) return (
        <div className="h-screen bg-stone-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
    )

  return (
    <div className='min-h-screen bg-stone-900 text-white p-8'>
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setSortOption('latest')} 
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${sortOption === 'latest' ? 'bg-white text-black' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
          >
            Latest
          </button>
          <button 
            onClick={() => setSortOption('popular')} 
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${sortOption === 'popular' ? 'bg-white text-black' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
          >
            Popular
          </button>
          <button 
            onClick={() => setSortOption('oldest')} 
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${sortOption === 'oldest' ? 'bg-white text-black' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}
          >
            Oldest
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 '>

          {videos.map((video)=>(
            <div key={video._id} className='group cursor-pointer'>
              <Link to={`/watch/${video._id}`}>
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-900 mb-3 cursor-pointer group">
                    <img 
                        src={video.thumbnail} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                        alt={video.title}
                    />
        
                    <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-1 rounded font-medium">
                        {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                    </span>
        
                    {!video.isPublished && (
                        <span className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded font-bold">
                            Private
                        </span>
                    )}
                  </div>
              </Link>

              <div className='flex gap-3'>
                <img src={video.ownerDetails?.avatar} className='w-9 h-9 rounded-full object-cover shrink-0' />
  
                <div className="min-w-0 flex-1">
                  <h3 className='font-bold line-clamp-2 leading-tight text-white text-sm sm:text-base'>{video.title}</h3>
  
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1 min-w-0">
  
                      <Link to={`/channel/${video.ownerDetails?.username}`} className="hover:text-white transition-colors duration-200 truncate font-medium max-w-[45%] shrink-0">
                        {video.ownerDetails?.username}
                      </Link>
        
                      <span className="text-stone-600  shrink-0">•</span>
        
    
                      <div className="flex items-center gap-1.5 text-stone-500 truncate shrink-0">
                        <span>{video.views} views</span>
                        <span className="text-stone-600">•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ))}

        </div>
    </div>
  )
}

export default Home