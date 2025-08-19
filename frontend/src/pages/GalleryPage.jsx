import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGalleryStore } from "../store/useGalleryStore";
import { useThemeStore } from "../store/useThemeStore";
import FilterSection from "../components/FilterSection";

const GalleryPage = () => {
  const { battles, loading, fetchGalleryBattles, clearGallery } = useGalleryStore();
  const { themes, getTheme } = useThemeStore();

  const [filters, setFilters] = useState({
    themeId: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    getTheme();
  }, [getTheme]);

  useEffect(() => {
    fetchGalleryBattles(filters);
    return () => clearGallery();
  }, [filters, fetchGalleryBattles, clearGallery]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const isVotingOpen = (battle) => {
    if (!battle.votingStartTime || !battle.votingEndTime) return false;
    const now = Date.now();
    const start = new Date(battle.votingStartTime).getTime();
    const end = new Date(battle.votingEndTime).getTime();
    return now >= start && now <= end;
  };

  return (
    <>
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: none;
          }
          50% {
            opacity: 0.9;
            filter: none;
          }
        }

        @keyframes textGlow {
          0% {
            text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
            color: #c084fc;
          }
          50% {
            text-shadow: 0 0 12px #8b5cf6, 0 0 24px #f9a8d4;
            color: #f472b6;
          }
          100% {
            text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
            color: #c084fc;
          }
        }

        .glow-text {
          animation: textGlow 3s ease-in-out infinite;
        }

        .flicker {
          animation: flicker 4s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Glowing Page Title */}
          <h1 className="text-6xl font-extrabold text-center mb-12 glow-text">
            🫟 Battle{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent flicker">
              Gallery
            </span>
          </h1>

          {/* Filters Section */}
          <div className="mb-12 animate-fadeIn delay-[200ms]">
            <FilterSection
              filters={filters}
              setFilters={setFilters}
              themes={themes}
              handleFilterChange={handleFilterChange}
            />
          </div>

          {/* Gallery */}
          {loading ? (
            <p className="text-center text-yellow-400 font-semibold glow-text">Loading gallery...</p>
          ) : battles.length === 0 ? (
            <p className="text-center text-gray-400 glow-text">
              No drawings to show. Join a battle to submit!
            </p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {battles.map((battle, idx) => (
                <div
                  key={battle._id}
                  className="bg-white/5 backdrop-blur-md rounded-3xl border border-purple-500/30 shadow-xl p-6 transition-transform hover:scale-[1.02] glow-text"
                >
                  {/* Battle Info */}
                  <div className="mb-4 border-b border-gray-700 pb-3">
                    <h3 className="text-xl font-bold text-pink-400">
                      🎨 {battle.themeId?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      🗓 {new Date(battle.createdAt).toLocaleDateString()} @{" "}
                      {new Date(battle.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Player Drawings */}
                  <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {battle.players.map((player, idx) =>
                      player.image ? (
                        <div
                          key={idx}
                          className="w-32 h-32 bg-white rounded border border-white shadow-md overflow-hidden"
                        >
                          <img
                            src={player.image}
                            alt={`Player ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className="w-32 h-32 bg-gray-800 text-gray-400 text-xs flex items-center justify-center rounded border border-gray-600"
                        >
                          No Drawing
                        </div>
                      )
                    )}
                  </div>

                  {/* Voting Button or Closed */}
                  {isVotingOpen(battle) ? (
                    <Link to={`/vote/${battle._id}`} className="relative block">
                      <button
                        className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-transform hover:scale-105 shadow-lg relative z-10"
                        style={{
                          animation: "flicker 4s ease-in-out infinite alternate",
                        }}
                      >
                        🗳 Vote Now
                        <span className="absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 opacity-60 blur-xl animate-pulse"></span>
                      </button>
                    </Link>
                  ) : (
                    <p className="text-center text-sm text-gray-400 font-medium">Voting Closed</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
