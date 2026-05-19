import {useState,useEffect} from "react"
import api from "../api/axiosInstance"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { IoPencilOutline, IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5"


function Settings(){

    const {user}=useAuth()
    const navigate=useNavigate()
    const [activeTab,setActiveTab]=useState("account")
    const [message,setMessage]=useState({text:"",type:""})
    const [editingField,setEditingField]=useState(null)
    const [isPasswordModalOpen,setIsPasswordModalOpen]=useState(false)
    const [username,setUsername]=useState(user.username)
    const [newPassword,setNewPassword]=useState("")
    const [fullname,setFullname]=useState(user.fullname)
    const [currentPassword,setCurrentPassword]=useState("")


    const handleSaveField=async(field)=>{
        try {
            const dataToSend=field==="username" ? {username} : {fullname}
            await api.patch("/user/update-profile",dataToSend) 
            setMessage({text:`${field} updated successfully`,type:"success"})
            setEditingField(null)
        } catch (error) {
            setMessage({text:"Something went wrong",type:"error"})
            console.log(error)
        }
    }

    const handleChangePassword=async(e)=>{
        e.preventDefault()
        try {
            await api.post("/user/change-password",{currentPassword,newPassword})
            setMessage({ text: "Password changed successfully!", type: "success" })
            setCurrentPassword("")
            setNewPassword("")
            setIsPasswordModalOpen(false)
        } catch (error) {
            setMessage({ text: "Something went wrong", type: "error" })
            console.log(error)
        }
    }

    useEffect(() => {
    
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: "", type: "" }) 
            }, 2000) 
            return () => clearTimeout(timer)
        }
    }, [message])

    if(!user) return null

return (
        <div className="min-h-screen bg-stone-950 text-white p-6 md:p-10 relative">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate("/")} className="p-2 hover:bg-stone-800 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>

                {/* Alert Message Box */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* LEFT SIDEBAR (Unchanged) */}
                    <div className="w-full md:w-64 shrink-0">
                        <nav className="flex flex-col gap-2">
                            <button onClick={() => setActiveTab('account')} className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'account' ? 'bg-orange-500 text-stone-950' : 'text-stone-400 hover:bg-stone-900'}`}>
                                Account Details
                            </button>
                            <button onClick={() => setActiveTab('security')} className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-orange-500 text-stone-950' : 'text-stone-400 hover:bg-stone-900'}`}>
                                Security
                            </button>
                        </nav>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="flex-1 bg-stone-900 rounded-2xl p-6 border border-stone-800">
                        
                        {/* TAB 1: INLINE ACCOUNT EDITING */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold border-b border-stone-800 pb-4">Account Details</h2>
                                
                                {/* USERNAME ROW */}
                                <div className="flex items-center justify-between p-4 bg-stone-950/50 rounded-xl border border-stone-800">
                                    <div className="flex-1">
                                        <p className="text-sm text-stone-400 mb-1">Username</p>
                                        
                                        {/* Toggle between text and input! */}
                                        {editingField === 'username' ? (
                                            <input 
                                                type="text" 
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full max-w-sm bg-stone-900 border border-orange-500 rounded px-3 py-1 text-white focus:outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <p className="text-lg font-medium">{username}</p>
                                        )}
                                    </div>
                                    
                                    {/* Toggle between Pencil and Save/Cancel buttons */}
                                    {editingField === 'username' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSaveField('username')} className="p-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 rounded-lg transition-colors">
                                                <IoCheckmarkOutline className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => { setEditingField(null); setUsername(user.username) }} className="p-2 bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors">
                                                <IoCloseOutline className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setEditingField('username')} className="p-2 text-stone-400 hover:text-orange-500 hover:bg-stone-800 rounded-lg transition-colors">
                                            <IoPencilOutline className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* FULLNAME ROW */}
                                <div className="flex items-center justify-between p-4 bg-stone-950/50 rounded-xl border border-stone-800">
                                    <div className="flex-1">
                                        <p className="text-sm text-stone-400 mb-1">Full Name</p>
                                        
                                        {editingField === 'fullname' ? (
                                            <input 
                                                type="text" 
                                                value={fullname} 
                                                onChange={(e) => setFullname(e.target.value)}
                                                className="w-full max-w-sm bg-stone-900 border border-orange-500 rounded px-3 py-1 text-white focus:outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <p className="text-lg font-medium">{fullname}</p>
                                        )}
                                    </div>
                                    
                                    {editingField === 'fullname' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSaveField('fullname')} className="p-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 rounded-lg transition-colors">
                                                <IoCheckmarkOutline className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => { setEditingField(null); setFullname(user.fullname) }} className="p-2 bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors">
                                                <IoCloseOutline className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setEditingField('fullname')} className="p-2 text-stone-400 hover:text-orange-500 hover:bg-stone-800 rounded-lg transition-colors">
                                            <IoPencilOutline className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                            </div>
                        )}

                        {/* TAB 2: SECURITY MODAL TRIGGER */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-bold border-b border-stone-800 pb-4 mb-6">Security</h2>
                                <div className="p-6 border border-stone-800 rounded-xl bg-stone-950/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-white mb-1">Account Password</p>
                                        <p className="text-sm text-stone-400">Ensure your account is using a long, random password to stay secure.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="whitespace-nowrap px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* THE PASSWORD POPUP MODAL */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Update Password</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-stone-400 hover:text-white">
                                <IoCloseOutline className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-400 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-400 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-2 rounded-lg font-medium bg-stone-800 hover:bg-stone-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2 rounded-lg font-medium bg-orange-600 hover:bg-orange-500 text-white transition-colors">
                                    Save Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}




export default Settings