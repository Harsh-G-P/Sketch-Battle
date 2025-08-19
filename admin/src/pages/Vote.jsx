import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Vote = () => {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const res = await axiosInstance.get("/gallery");
        // Sort battles by newest first using createdAt
        const sortedBattles = res.data.battles.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBattles(sortedBattles);
      } catch (err) {
        console.error("Failed to load battles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBattles();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500 border-opacity-50"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8 font-sans text-cyan-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-[0_0_10px_cyan]">
          ⚔️ Completed Battles
        </h1>

        <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {battles.map((battle) => (
            <li
              key={battle._id}
              className="relative bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg transition hover:scale-[1.02] hover:border-cyan-500 hover:shadow-cyan-500/20"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-cyan-300">
                  {battle.themeId?.name || "Untitled Theme"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {battle.players.map((p) => p.user.username).join(" vs ")}
                </p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  {new Date(battle.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <Link
                to={`/admin/battles/${battle._id}/votes`}
                className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 rounded-full transition-all text-white shadow-md shadow-cyan-700/30"
              >
                🔍 Review Votes
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Vote;
