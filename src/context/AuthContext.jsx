import React,{useState,createContext,useContext,useEffect} from 'react'
import api from '../api/axiosInstance'

const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const checkLoggedInUser=async()=>{
            try {
                const response=await api.get(`/user/current-user`,{withCredentials:true})
                setUser(response.data.data)
            } catch (error) {
                setUser(null)
            }finally{
                setLoading(false)
            }
        }
        checkLoggedInUser()
    },[])
    
    const login=(userData,token)=>{
        setUser(userData)
        setAccessToken(token)
    }

    const logout=()=>{
        setUser(null)
        setAccessToken(null)
    }

    return (
        <AuthContext.Provider value={{user,accessToken,login,logout}}>
            {loading ? (
                <div className="w-full h-screen bg-stone-950 flex items-center justify-center text-orange-500 font-bold">
                    Loading Lumina...
                </div>
            ) : (
                children
            )}  
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
return useContext(AuthContext)
}