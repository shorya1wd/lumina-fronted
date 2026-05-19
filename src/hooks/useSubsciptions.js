import { useState, useEffect,useCallback } from 'react';
import api from '../api/axiosInstance';

export const useSubscriptions = () => {
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchSubs = useCallback(async () => {
        try {
            const response = await api.get("/subscriptions/s/");
            setSubscribedChannels(response.data.data);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            setLoading(false);
        }
    }, []); 

   useEffect(() => {
    
        const loadInitialData = async () => {
            await fetchSubs();
        };
        loadInitialData();

        window.addEventListener('subscriptionChanged', fetchSubs);

        return () => {
            window.removeEventListener('subscriptionChanged', fetchSubs);
        };
    }, [fetchSubs]);

    return { subscribedChannels, loading, fetchSubs };
};