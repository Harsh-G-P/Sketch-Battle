import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useThemeStore = create((set)=>({

    themes:[],

    getTheme:async()=>{
        try {
            const res = await axiosInstance.get('/themes/get')
            set({themes:res.data.theme})
        } catch (error) {
            console.log(error)
        }
    }

}))