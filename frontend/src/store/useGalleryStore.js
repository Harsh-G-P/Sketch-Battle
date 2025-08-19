import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGalleryStore = create((set) => ({
  battles: [],
  loading: false,

  fetchGalleryBattles: async (filters = {}) => {
    set({ loading: true });
    try {
      // filters can have themeId, dateFrom, dateTo, result
      const res = await axiosInstance.get("/gallery/", { params: filters });
      set({ battles: res.data.battles });
      return res.data.battles;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load gallery battles");
      set({ battles: [] });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  clearGallery: () => set({ battles: [] }),
}));
