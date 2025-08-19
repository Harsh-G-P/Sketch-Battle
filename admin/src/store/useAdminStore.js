import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set,get) => ({
  stats: {
    totalUsers: 0,
    totalBattles: 0,
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    totalDrawingsSubmitted: 0,  // add here
  },
  users: [],
  loading: false,

  fetchStats: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/admin/stats");
      set({ stats: res.data.stats });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get('/admin/users')
      set({ users: res.data.users })
    } catch (err) {
      toast.error("Failed to fetch users")
    } finally {
      set({ loading: false })
    }
  },

  promoteToAdmin: async (userId) => {
    try {
      const res = await axiosInstance.put(`/admin/promote/${userId}`)
      toast.success(res.data.message)
      // Refresh user list
      const refreshed = await axiosInstance.get('/admin/users')
      set({ users: refreshed.data.users })
    } catch (err) {
      toast.error(err.response?.data?.message || "Promotion failed")
    }
  },

  deleteUser: async (userId) => {
  try {
    const res = await axiosInstance.delete(`/admin/user/${userId}`);
    toast.success(res.data.message);

    // Refresh user list
    const refreshed = await axiosInstance.get('/admin/users');
    set({ users: refreshed.data.users });
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete user");
  }
},

reviewVotes: async (battleId) => {
  try {
    set({ loading: true });
    const res = await axiosInstance.get(`/admin/battles/${battleId}/votes`);
    return res.data; // return battle vote data to use in page
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to fetch vote data");
    return null;
  } finally {
    set({ loading: false });
  }
},

unbanUser: async (userId) => {
  try {
    const res = await axiosInstance.post(`/admin/users/${userId}/unban`);
    await get().fetchUsers();
    return res.data.success === true;
  } catch (err) {
    console.error("Unban error", err.response?.data || err);
    return false;
  }
},

banUser: async (userId, days, reason) => {
  try {
    const res = await axiosInstance.post(`/admin/users/${userId}/ban`, { days, reason });
    await get().fetchUsers();
    return res.data.success === true;
  } catch (err) {
    console.error("Ban error", err.response?.data || err);
    return false;
  }
},




}));

