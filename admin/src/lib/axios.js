import axios from 'axios'

const BASE_URL = import.meta.env.MODE === 'development'
    ? 'https://sketch-battle-backend.vercel.app/api'
    : 'https://sketch-battle-backend.vercel.app/api'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

// Helper to set/remove Authorization header
export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axiosInstance.defaults.headers.common['Authorization']
    }
}
