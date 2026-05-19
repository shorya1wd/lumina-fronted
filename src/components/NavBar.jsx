import {useState} from "react"
import api from "../api/axiosInstance"
import { useNavigate ,Link} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5"
import SubscribersModal from "./SubscribersModal"

function NavBar({toggleSidebar}){

    const {user,logout}=useAuth()
    const navigate=useNavigate()

    const [isMenuOpen,setIsMenuOpen]=useState(false)
    const [searchQuery,setSearchQuery]=useState("")
    const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);

    const handleLogout=async()=>{
        try {
            await api.post(`/user/logout`)
            logout()
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch=(event)=>{
        event.preventDefault()
        if(searchQuery.trim()){
            navigate(`/?query=${searchQuery.trim()}`)
            setIsMenuOpen(false)
        }
    }

    const deleteQuery=(event)=>{
        event.preventDefault()
        setSearchQuery("")
    }

    return(
        <nav className="w-full bg-stone-900 border-b border-stone-800 py-3 px-3 sm:px-4 sticky top-0 z-50">

            <div className="w-full mx-auto flex justify-between items-center">

               <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-stone-800 transition-colors text-stone-300 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-none"> 
                        <Link to="/" className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
                            Lumina
                        </Link>
                    </div>
                </div>


                <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-4 relative">
                    
                    <div className="relative w-full flex">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-stone-950 text-stone-200 border border-stone-700 rounded-l-full pl-5 pr-10 py-2 focus:outline-none focus:border-orange-500 transition-colors placeholder-stone-500"
                        />
                        
        
                        {searchQuery && (
                            <button 
                                type="button" 
                                onClick={deleteQuery} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors p-1"
                            >
                                <IoCloseOutline className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="bg-stone-800 border border-stone-700 border-l-0 text-stone-300 rounded-r-full px-6 py-2 hover:bg-stone-700 transition-colors flex items-center justify-center"
                    >
                        <IoSearchOutline className="w-5 h-5" />
                    </button>
                </form>

                {user ? (

                    <div className="relative">
                        <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 p-1.5 pr-3 pl-3 rounded-3xl focus:outline-none hover:bg-stone-800 border border-transparent hover:border-stone-600 transition-all duration-200"> 
                            <p className="text-stone-200 font-medium text-sm">{user.username}</p>
                            <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full shadow-sm object-cover"/>
                        </button>

                        {isMenuOpen &&(

                            <div className="absolute right-0 mt-2 w-48 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-2 overflow-hidden flex flex-col">
                                <div className="px-4 py-2 border-b border-stone-800 b-1">
                                    <p className="text-sm font-bold text-white truncate">{user.fullname}</p>
                                </div>

                                <button onClick={()=>{setIsMenuOpen(false); navigate(`/channel/${user.username}`)}} className="text-left px-4 py-2 text-sm text-stone-300 bg-stone-800 hover:text-white transition-colors">Your Channel</button>

                                <button onClick={()=>{setIsMenuOpen(false); navigate('/settings')}} className="text-left px-4 py-2 text-sm text-stone-300 bg-stone-800 hover:text-white transition-colors">Settings</button>

                                <button 
                                    onClick={() => setIsSubscribersModalOpen(true)}
                                    className="text-left px-4 py-2 text-sm text-stone-300 bg-stone-800 hover:text-white transition-colors"
                                >
                                    My Subscribers
                                </button>

                                <div className="border-t border-stone-800 mt-1 pt-1 ">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-stone-800 transition-colors font-semibold">Sign out</button>
                                </div>
                            </div>

                        )}
                    </div>

                ):(
                    <button onClick={()=>navigate("/login")} className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-bold transition-colors">
                        Sign In
                    </button>
                )
            }

            </div>
            <SubscribersModal 
                isOpen={isSubscribersModalOpen} 
                onClose={() => setIsSubscribersModalOpen(false)} 
                channelId={user?._id} 
            />
        </nav>
    )


}


export default NavBar
