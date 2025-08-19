import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useBattleStore = create((set, get) => ({
  currentBattle: null,
  loading: false,


  startOrJoinBattle: async (themeId, battleId = null) => {
    set({ loading: true });
    try {
      let res;
      if (battleId) {
        // join specific battle
        res = await axiosInstance.post('/battles/join', { battleId });
      } else {
        // existing behavior: join random open battle
        res = await axiosInstance.post('/battles/start', { themeId });
      }

      const battle = res.data.battle;
      set({ currentBattle: battle });
      toast.success(res.data.message || 'Battle started or joined!');
      return battle;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start/join battle');
      return null;
    } finally {
      set({ loading: false });
    }
  },


  fetchOpenBattles: async (themeId) => {
    try {
      const res = await axiosInstance.get("/battles/open", {
        params: themeId ? { themeId } : {},
      });
      return res.data;
    } catch (error) {
      const banMessage = error.response?.data?.message;
    if (banMessage?.includes("banned")) {
      toast.error(banMessage); // shows specific ban reason
    } else {
      toast.error(banMessage || "Failed to load open battles");
    }
    }
  },


  fetchBattle: async (id) => {
    set({ loading: true })
    try {
      const res = await axiosInstance.get(`/battles/${id}`)
      set({ currentBattle: res.data.battle })
      return res.data.battle // <-- return the fetched battle!
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch battle')
      return null
    } finally {
      set({ loading: false })
    }
  },


  submitDrawing: async (battleId, drawingData) => {
    set({ loading: true })
    try {
      await axiosInstance.post(`/battles/${battleId}/submit`, { image: drawingData })
      toast.success('Drawing submitted successfully!')
      // Optionally refetch battle data here
      await get().fetchBattle(battleId)
    } catch (error) {
      console.error("Submit drawing error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit drawing')
    } finally {
      set({ loading: false })
    }
  },


  createBattle: async (themeId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post('/battles/create', { themeId });
      set({ currentBattle: res.data.battle });
      toast.success(res.data.message || 'Battle created!');
      return res.data.battle;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create battle');
      return null;
    } finally {
      set({ loading: false });
    }
  },


  submitVote: async (battleId, category, votedFor) => {
    set({ loading: true });
    try {
      await axiosInstance.post(`/battles/${battleId}/vote`, { category, votedFor });
      toast.success("Vote submitted!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit vote");
    } finally {
      set({ loading: false });
    }
  },


  calculateResult: async (battleId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post(`/battles/${battleId}/calculate-result`);
      toast.success(res.data.message || "Result calculated");

      // Optionally, refetch the updated battle with result and winner info
      const updatedBattle = await get().fetchBattle(battleId);

      set({ currentBattle: updatedBattle });

      return updatedBattle;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to calculate result");
      return null;
    } finally {
      set({ loading: false });
    }
  },


  fetchLeaderboard: async (sortBy = "battlesWon") => {
    try {
      const res = await axiosInstance.get("/battles/leaderboard", {
        params: { sortBy },
      });
      return res.data.leaderboard;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load leaderboard");
      return [];
    }
  },

  clearBattle: () => set({ currentBattle: null }),

}))