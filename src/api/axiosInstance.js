import axios from "axios"

const api=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
})


api.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        const originalRequest=error.config

        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true

            try {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`,{},{withCredentials:true})

                return api(originalRequest)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api