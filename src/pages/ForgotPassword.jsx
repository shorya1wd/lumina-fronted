import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/forgot-password`, {
                email
            });
            setSuccessMessage(response.data.message || "Password reset link sent to your email!");
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-center bg-linear-to-br from-stone-900 via-orange-900 to-orange-950'>
            <div className='flex w-full max-w-md overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md p-10'>
                <div className='w-full flex flex-col justify-center'>
                    <h1 className='text-3xl font-extrabold mb-4 uppercase text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-200 to-orange-500 text-center'>
                        Forgot Password
                    </h1>
                    <p className="text-stone-400 mb-6 text-sm text-center">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {error && (<div className="bg-rose-500/10 border border-rose-500 text-rose-200 p-3 rounded-lg text-sm text-center mb-4 animate-pulse">{error}</div>)}
                    {successMessage && (<div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded-lg text-sm text-center mb-4">{successMessage}</div>)}

                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className='flex flex-col'>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(error) setError(null);
                                }} 
                                placeholder="Enter your email"
                                className='rounded-md border border-stone-600 bg-stone-800/50 p-3 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-2 rounded-md p-3 font-bold text-white transition-all shadow-lg shadow-orange-900/50 
                                ${loading ? 'bg-stone-500 cursor-not-allowed' : 'bg-linear-to-r from-orange-600 to-rose-600 hover:scale-[1.02]'}`}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>  
                        
                        <div className="flex justify-center items-center mt-4">
                            <Link to="/login" className="text-sm text-stone-400 hover:text-white transition-colors">Back to Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
