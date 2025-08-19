import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBattleStore } from "../store/useBattleStore";
import { useThemeStore } from "../store/useThemeStore";
import { toast } from "react-toastify";

const BattleLobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);

  const [message, setMessage] = useState(null);
  const [openBattles, setOpenBattles] = useState([]);
  const [showBattles, setShowBattles] = useState(false);

  const { themes, getTheme } = useThemeStore();
  const { fetchOpenBattles, startOrJoinBattle, createBattle } = useBattleStore();

  useEffect(() => {
    getTheme();
  }, [getTheme]);

  useEffect(() => {
    if (location.state?.message && !toastShown.current) {
      toast.info(location.state.message, {
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });

      toastShown.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleShowBattles = async () => {
    setMessage(null);
    const battles = await fetchOpenBattles();
    setOpenBattles(battles || []);
    setShowBattles(true);
    if (!battles?.length) {
      setMessage("😕 No open battles found. Try creating one!");
    }
  };

  const handleJoinBattle = async (battleId) => {
    const battle = await startOrJoinBattle(null, battleId);
    if (battle) {
      navigate(`/battle/${battle._id}`);
    } else {
      setMessage("❌ Failed to join the battle.");
    }
  };

  const handleCreateBattle = async () => {
    if (!themes.length) return setMessage("⚠️ No themes available.");
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const battle = await createBattle(theme._id);
    if (battle) {
      navigate(`/waiting/${battle._id}`);
    } else {
      setMessage("❌ Failed to create battle.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 px-6 py-12 flex flex-col items-center justify-center font-sans">
      {/* Glow and Flicker Animations reused from Draw page */}
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

        .glow-flicker {
          animation: textGlow 4s ease-in-out infinite alternate;
          color: #a78bfa;
        }

        .glow-button {
          position: relative;
          z-index: 0;
          overflow: hidden;
          color: white;
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          box-shadow: 0 0 10px #7c3aed;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          font-weight: 600;
          padding: 0.75rem 1.75rem;
          border-radius: 0.75rem;
          user-select: none;
          outline-offset: 3px;
          border: none;
        }

        .glow-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #7c3aed, #ec4899, #f472b6);
          opacity: 0.6;
          filter: blur(12px);
          z-index: -1;
          transition: opacity 0.3s ease;
          animation: flicker 4s ease-in-out infinite alternate;
          border-radius: 0.75rem;
        }

        .glow-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #ec4899;
        }

        .glow-button:focus-visible {
          outline: 2px solid #ec4899;
          outline-offset: 4px;
          box-shadow: 0 0 25px #ec4899;
        }

        .focus-visible\:outline-neon-purple:focus-visible {
          outline: 2px solid #a855f7;
          outline-offset: 4px;
          box-shadow: 0 0 10px #a855f7;
        }
      `}</style>

      <div className="max-w-5xl w-full text-center space-y-10 mx-auto">
        <h1 className="text-6xl font-extrabold tracking-tight select-none glow-text">
          ⚔️ Battle{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={{ userSelect: "none" }}
          >
            Lobby
          </span>
        </h1>

        <p className="text-white text-lg max-w-xl mx-auto">
          Welcome to the Battle Lobby! Join or create battles and test your drawing
          skills against others.
        </p>

        {message && (
          <div className="bg-yellow-600 bg-opacity-20 text-yellow-300 px-6 py-3 rounded-xl shadow-md font-medium max-w-xl mx-auto">
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-xl mx-auto">
          <button
            onClick={handleShowBattles}
            className="glow-button"
            aria-label="Show open battles"
          >
            🔍 Show Open Battles
          </button>
          <button
            onClick={handleCreateBattle}
            className="glow-button"
            aria-label="Create new battle"
          >
            ➕ Create New Battle
          </button>
        </div>

        {/* Open Battles Grid */}
        {showBattles && openBattles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-white select-none glow-text drop-shadow-lg">
              🎮 Available Battles
            </h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {openBattles.map((battle) => (
                <div
                  key={battle._id}
                  onClick={() => handleJoinBattle(battle._id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleJoinBattle(battle._id);
                  }}
                  className="cursor-pointer bg-black bg-opacity-25 backdrop-blur-lg p-6 rounded-3xl border border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.04] hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-transform duration-300 outline-none focus:outline-neon-purple"
                >
                  <h3 className="text-xl font-semibold mb-3 text-purple-400 select-none">
                    Battle #{battle._id.slice(-5)}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    Theme:{" "}
                    <span className="text-white font-medium">
                      {battle.themeId?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Players:{" "}
                    <span className="text-white font-bold">
                      {battle.players.length}/2
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleLobby;
