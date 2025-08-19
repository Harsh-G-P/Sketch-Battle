import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useThemeStore = create((set,get)=>({

    themes:[],

    getTheme:async()=>{
        try {
            const res = await axiosInstance.get('/themes/get')
            set({themes:res.data.theme})
        } catch (error) {
            console.log(error)
        }
    },

    addTheme: async (name) => {
        try {
            const res = await axiosInstance.post('/themes/add', { name });
            get().getTheme();
            toast.success("Theme added");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding theme");
        }
    },

    updateTheme: async (id, name) => {
        try {
            await axiosInstance.put(`/themes/update/${id}`, { name });
            get().getTheme();
            toast.success("Theme updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating theme");
        }
    },

    deleteTheme: async (id) => {
        try {
            await axiosInstance.delete(`/themes/delete/${id}`);
            get().getTheme();
            toast.success("Theme deleted");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting theme");
        }
    },

}))