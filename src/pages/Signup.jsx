import React,{ useState} from 'react'
import axios from 'axios'
import {useNavigate,Link} from "react-router-dom"
function Signup() {
    const navigate=useNavigate()

    const [step,setStep]=useState(1)

    const [formData,setFormData]=useState({
        email:"",
        username:"",
        fullname:"",
        password:"",
        avatar:null,
        coverImage:null
    })

    const [error,setError]=useState(null)
    const [loading,setLoading]=useState(false)
    const [successMessage,setSuccessMessage]=useState(null)

    const handleChange=(event)=>{
        const {name,value,type,files}=event.target
        setFormData({
            ...formData,
            [name]:type==="file" ? files[0] : value
        })
        if(error) setError(null)
    }

    const handleNextStep=(event)=>{
        event.preventDefault()
        if (!formData.email || !formData.username || !formData.fullname || !formData.password) {
            setError("Please fill all the details.")
            return
        }
        setError(null)
        setStep(2)
    }

    const handleSubmit=async(event)=>{
        event.preventDefault()
        setLoading(true)

        const dataToSend=new FormData()
        dataToSend.append("email",formData.email)
        dataToSend.append("username",formData.username)
        dataToSend.append("fullname",formData.fullname)
        dataToSend.append("password",formData.password)
        if(formData.avatar) dataToSend.append("avatar",formData.avatar)
        if(formData.coverImage) dataToSend.append("coverImage",formData.coverImage)

        try {
            const response=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/register`,dataToSend,{headers:{"Content-Type":"multipart/form-data"}})
            setSuccessMessage("Welcome to Lumina! Account Created")
            setStep(1)
            setFormData({
                email:"",
                username:"",
                fullname:"",
                password:""
            })
            setTimeout(()=>{
                navigate("/login")
            },2000)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
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

                <p className="text-stone-400 mb-8 text-sm">
                    {step === 1 ? "Create your account" : "Customize your channel"}
                </p>

                {error && (<div className="bg-rose-500/10 border border-rose-500 text-rose-200 p-3 rounded-lg text-sm text-center mb-4 animate-pulse">{error}</div>)}
                {successMessage && (<div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded-lg text-sm text-center mb-4">{successMessage}</div>)}

                <form className='flex flex-col gap-4' onSubmit={step === 1 ? handleNextStep : handleSubmit}>


                    {step === 1 && (
                        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className='flex flex-col'>
                        <label htmlFor="email" className='text-sm text-stone-300 mb-1'>Email</label>
                        <input type="email" value={formData.email} onChange={handleChange} name="email" id="" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'/>
                        </div>

                    <div className='flex flex-col'>
                        <label htmlFor="username" className='text-sm text-stone-300 mb-1'>Username</label>
                        <input type="text" value={formData.username} onChange={handleChange} name="username" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="fullname" className='text-sm text-stone-300 mb-1'>Fullname</label>
                        <input type="text" value={formData.fullname} onChange={handleChange} name="fullname" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'/>
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="Password" className='text-sm text-stone-300 mb-1'>Password</label>
                        <input type="password" value={formData.password} onChange={handleChange} name="password" id="" className='rounded-md border border-stone-600 bg-stone-800/50 p-2.5 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'/>
                    </div>
                    <button className="mt-4 rounded-md bg-linear-to-r from-orange-600 to-rose-600 p-3 font-bold text-white hover:scale-[1.02] transition-transform">
                        Next
                    </button>
                    <Link to="/login" className="text-sm text-orange-300 underline hover:text-orange-500 transition-colors text-center"><p>Already have an account? Log In</p></Link>
                    
                    </div>
                    )}

                   {step === 2 && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            
                            <div className='flex flex-col'>
                                <label className='text-sm text-stone-300 mb-2 ml-1'>Profile Avatar</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-600 border-dashed rounded-lg cursor-pointer bg-stone-800/30 hover:bg-stone-800/60 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="text-sm text-stone-400">
                                            {formData.avatar ? <span className="text-orange-400 font-bold">{formData.avatar.name}</span> : "Click to upload avatar"}
                                        </p>
                                    </div>
                                    <input type="file" name="avatar" className="hidden" accept="image/*" onChange={handleChange} />
                                </label>
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-sm text-stone-300 mb-2 ml-1'>Cover Image</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-600 border-dashed rounded-lg cursor-pointer bg-stone-800/30 hover:bg-stone-800/60 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="text-sm text-stone-400">
                                            {formData.coverImage ? <span className="text-orange-400 font-bold">{formData.coverImage.name}</span> : "Click to upload cover"}
                                        </p>
                                    </div>
                                    <input type="file" name="coverImage" className="hidden" accept="image/*" onChange={handleChange} />
                                </label>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button type="button" onClick={() => setStep(1)} className="w-1/3 rounded-lg border border-stone-600 p-3.5 font-bold text-stone-300 hover:bg-stone-800 transition-colors">
                                    Back
                                </button>
                                <button type="submit" disabled={loading} className="w-2/3 rounded-lg bg-linear-to-r from-orange-600 to-rose-600 p-3.5 font-bold text-white hover:scale-[1.02] shadow-lg shadow-orange-900/50 transition-all disabled:opacity-50">
                                    {loading ? "Creating..." : (formData.avatar || formData.coverImage ? "Upload & Finish" : "Skip & Finish")}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
        
    </div>
  )
}

export default Signup