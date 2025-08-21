import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance, setAuthToken } from '../lib/axios'

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async (signupData) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post('/auth/sign', signupData)
            
            const { user, token } = res.data
            localStorage.setItem('token', token)   // store token
            setAuthToken(token)                     // set Axios header
            
            set({ authUser: user })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    login: async (loginData) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post('/auth/login', loginData)
            
            const { user, token } = res.data
            localStorage.setItem('token', token)   // store token
            setAuthToken(token)                     // set Axios header
            
            set({ authUser: user })
            toast.success("Login successful")
        } catch (error) {
            toast.error(error.response?.data?.message ||
                error.response?.data?.msg ||
                "Something went wrong")
        } finally {
            set({ loading: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            localStorage.removeItem('token')        // remove token
            setAuthToken(null)                       // remove Axios header
            set({ authUser: null })
            toast.success("Logout successful")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                setAuthToken(token)                 // set Axios header
                const res = await axiosInstance.get('/auth/me')
                set({ authUser: res.data.user })
            }
        } catch (error) {
            console.log(error)
            localStorage.removeItem('token')        // remove invalid token
            setAuthToken(null)
            set({ authUser: null })
        } finally {
            set({ checkingAuth: false })
        }
    },

    setAuthUser: (user) => set({ authUser: user }),
}))
