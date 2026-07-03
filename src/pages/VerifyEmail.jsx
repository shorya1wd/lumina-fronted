import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || code.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/verify-email`, {
                email,
                code
            });
            setSuccessMessage(response.data.message || "Email verified successfully!");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/resend-verification`, {
                email
            });
            setSuccessMessage("A new verification code has been sent to your email.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend code.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-center bg-linear-to-br from-stone-900 via-orange-900 to-orange-950'>
            <div className='flex w-full max-w-md overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur-md p-10'>
                <div className='w-full flex flex-col justify-center'>
                    <h1 className='text-3xl font-extrabold mb-4 uppercase text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-orange-200 to-orange-500 text-center'>
                        Verify Email
                    </h1>
                    <p className="text-stone-400 mb-6 text-sm text-center">
                        We sent a 6-digit code to <span className="text-orange-300 font-bold">{email}</span>. Please enter it below to verify your account.
                    </p>

                    {error && (<div className="bg-rose-500/10 border border-rose-500 text-rose-200 p-3 rounded-lg text-sm text-center mb-4 animate-pulse">{error}</div>)}
                    {successMessage && (<div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded-lg text-sm text-center mb-4">{successMessage}</div>)}

                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className='flex flex-col'>
                            <input 
                                type="text" 
                                value={code} 
                                onChange={(e) => {
                                    setCode(e.target.value.replace(/[^0-9]/g, ''));
                                    if(error) setError(null);
                                }} 
                                maxLength={6}
                                placeholder="------"
                                className='rounded-md border border-stone-600 bg-stone-800/50 p-4 text-white text-center tracking-widest text-2xl font-bold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors'
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-2 rounded-md p-3 font-bold text-white transition-all shadow-lg shadow-orange-900/50 
                                ${loading ? 'bg-stone-500 cursor-not-allowed' : 'bg-linear-to-r from-orange-600 to-rose-600 hover:scale-[1.02]'}`}
                        >
                            {loading ? "Verifying..." : "Verify Account"}
                        </button>  
                        
                        <div className="flex justify-between items-center mt-4">
                            <Link to="/login" className="text-sm text-stone-400 hover:text-white transition-colors">Back to Login</Link>
                            <button 
                                type="button" 
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-sm text-orange-400 hover:text-orange-300 transition-colors disabled:text-stone-500"
                            >
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
