
import { Link } from 'react-router-dom'
import { useSubscriptions } from '../hooks/useSubsciptions.js';

function SubscribedChannels() {

     const { subscribedChannels, loading } = useSubscriptions(); 

    if (loading) {
        return <div className="text-white text-center mt-20 font-bold">Loading your favorite creators...</div>;
    }


  return (
    
       <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Subscriptions</h2>

            <div className="flex flex-col gap-2">
                {subscribedChannels.map((sub) => {
            
                    const channel = sub.channels; 

                    return (
                        <Link 
                            key={sub._id} 
                            to={`/channel/${channel.username}`} 
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                            <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-stone-900">
                                <img 
                                    src={channel.avatar} 
                                    alt={channel.fullname} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <h3 className="text-white font-medium text-base sm:text-lg leading-tight">
                                    {channel.fullname}
                                </h3>
                                <p className="text-stone-400 text-sm mt-0.5">
                                    @{channel.username}
                                </p>
                            </div>
                            
                        </Link>
                    );
                })}
            </div>
        </div>

  )
}

export default SubscribedChannels