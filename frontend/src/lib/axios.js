import axios from 'axios'

const BASE_URL = import.meta.env.MODE === 'development' ? 'https://sketch-battle-api.vercel.app/api' : '/api'

export const axiosInstance = axios.create({
    baseURL:BASE_URL,
    withCredentials:true,
})
