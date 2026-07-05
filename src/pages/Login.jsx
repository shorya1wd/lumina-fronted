import React,{useState} from 'react'
import axios from 'axios'
import {useNavigate,Link} from "react-router-dom"
import { useAuth } from '../context/AuthContext.jsx'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

function Login() {
    const navigate=useNavigate()
    
    const {login}=useAuth()

    const [formData,setFormData]=useState({
        email:"",
        username:"",
        password:"",

    })

    const [loading,setLoading]=useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange=(event)=>{
      
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
        })
    }

    const handleSubmit=async(event)=>{
        event.preventDefault()
        
         if ((!formData.email && !formData.username) || !formData.password) {
            toast.error("Please provide email or username and password.")
            return
        }
        setLoading(true)

        try {
            const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`,formData,{withCredentials:true})
            const userData=response?.data?.data?.user
            const token=response?.data?.data?.accessToken
            login(userData,token)
            toast.success("Welcome to Lumina! Account Logged In")
            setFormData({
                email:"",
                username:"",
                password:""
            })
            setTimeout(()=>{
                navigate("/")
            },2000)
        } catch (error) {
            if (error.response?.status === 403) {
                // Unverified email
                navigate(`/verify-email?email=${encodeURIComponent(formData.email || formData.username)}`);
            } else {
                toast.error(error.response?.data?.message || "Invalid credentials")
            }
        }finally{
            setLoading(false)
        }
    }


  return (
    <div className='w-full h-screen flex items-center justify-center bg-linear-to-br from-stone-900 via-orange-900 to-orange-950'>
        <div className='flex w-full max-w-5xl min-h-162.5 overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md'>

            <div className='hidden md:block md:w-1/2 bg-cover bg-center' style={{backgroundImage:"url('https://res.cloudinary.com/dktrehxcq/image/upload/q_auto/f_auto/v1778520328/pexels-marek-piwnicki-3907296-8991554_aux5fv.jpg')"}}>
            </div>

            <div className='w-full md:w-1/2 bg-black/40 flex flex-col justify-center p-10 lg:p-14'>

                <h1 className='text-4xl p-3 font-extrabold mb-8 uppercase  text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-200 to-orange-500 '>Lumina</h1>

                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                  
                        <div className='flex flex-col'>
                        <label htmlFor="email" className='text-sm text-stone-300 mb-1'>Email</label>
                        <input type="email" value={formData.email} onChange={handleChange} name="email" id="" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'/>
                        </div>

                    <div className='flex flex-col'>
                        <label htmlFor="username" className='text-sm text-stone-300 mb-1'>Username</label>
                        <input type="text" value={formData.username} onChange={handleChange} name="username" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors' />
                    </div>

                    <div className='flex flex-col'>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="Password" className='text-sm text-stone-300'>Password</label>
                            <Link to="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Forgot Password?</Link>
                        </div>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={handleChange} 
                                name="password" 
                                id="" 
                                className='w-full rounded-md border border-stone-600 bg-stone-800/50 p-2.5 pr-10 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`mt-4 rounded-md p-3 font-bold text-white transition-all shadow-lg shadow-orange-900/50 
                            ${loading ? 'bg-stone-500 cursor-not-allowed' : 'bg-linear-to-r from-orange-600 to-rose-600 hover:scale-[1.02]'}`}
                    >
                        {loading ? "Authenticating..." : "Log In"}
                    </button>  
                    <Link to="/signup"><p className="text-sm text-orange-300 underline hover:text-orange-500 transition-colors text-center">Don't have an account? Sign Up</p></Link>                 
                </form>
            </div>
        </div>
        
    </div>
  )
}

export default Login