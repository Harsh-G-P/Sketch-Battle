import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useBattleStore } from "../store/useBattleStore";
import { useAuthStore } from "../store/useAuthStore";

const useCurrentUserId = () => {
  const authUser = useAuthStore(state => state.authUser);
  return authUser?._id || null;
};

const VotePage = () => {
  const { battleId } = useParams();
  const { fetchBattle, submitVote, currentBattle, loading, calculateResult } = useBattleStore();
  const currentUserId = useCurrentUserId();

  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    fetchBattle(battleId);
    setHasVoted(false);
  }, [battleId]);

  useEffect(() => {
    if (!currentBattle || !currentBattle.votes || !currentUserId) return;
    const voted = currentBattle.votes.some(v => v.voter === currentUserId);
    setHasVoted(voted);
  }, [currentBattle, currentUserId]);

  useEffect(() => {
    if (!currentBattle?.votingEndTime) return;
    const votingEnd = new Date(currentBattle.votingEndTime);
    const now = new Date();
    const timeUntilEnd = votingEnd.getTime() - now.getTime();
    if (timeUntilEnd <= 0) {
      fetchBattle(battleId);
    } else {
      const timeout = setTimeout(() => fetchBattle(battleId), timeUntilEnd);
      return () => clearTimeout(timeout);
    }
  }, [battleId, currentBattle?.votingEndTime]);

  useEffect(() => {
    const checkVotingEnd = async () => {
      if (
        currentBattle?.votingEndTime &&
        new Date() > new Date(currentBattle.votingEndTime) &&
        !currentBattle.result
      ) {
        await calculateResult(battleId);
      }
    };
    checkVotingEnd();
  }, [currentBattle, battleId]);

  const votingStatus = useMemo(() => {
    if (!currentBattle || !currentBattle.votingStartTime || !currentBattle.votingEndTime) {
      return { open: false, message: "Voting time not set yet." };
    }
    const now = new Date();
    const votingStart = new Date(currentBattle.votingStartTime);
    const votingEnd = new Date(currentBattle.votingEndTime);
    if (now < votingStart) return { open: false, message: "Voting has not started yet." };
    if (now > votingEnd) return { open: false, message: "Voting period has ended." };
    return { open: true, message: "🟢 Voting is OPEN! Cast your vote below." };
  }, [currentBattle]);

  const handleVote = async (category, votedForId) => {
    if (hasVoted || !votingStatus.open) return;
    try {
      await submitVote(battleId, category, votedForId);
      setHasVoted(true);
    } catch {
      // error handled in submitVote
    }
  };

  if (loading || !currentBattle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center text-white p-6">
        <p className="text-lg animate-pulse">Loading battle...</p>
      </div>
    );
  }

  const { players, themeId } = currentBattle;

  return (
    <>
      <style>{`
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
          font-weight: 800;
          text-align: center;
        }
        .glow-flicker {
          animation: textGlow 4s ease-in-out infinite alternate;
          color: #a78bfa;
        }
        .btn-gradient {
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          box-shadow: 0 0 15px #a855f7;
          color: white;
          font-weight: 600;
          transition: box-shadow 0.3s ease;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          cursor: pointer;
          border: none;
          user-select: none;
        }
        .btn-gradient:hover:not(:disabled) {
          box-shadow: 0 0 25px #ec4899, 0 0 35px #a855f7;
        }
        .btn-gradient:disabled {
          background: #4b5563;
          cursor: not-allowed;
          box-shadow: none;
        }
        .image-hover-scale:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
          cursor: pointer;
          box-shadow: 0 0 15px #a855f7;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-6 py-12 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl glow-text mb-6">
            🎯 Vote for the Battle
          </h1>

          <h2 className="text-2xl text-center text-indigo-300 mb-8 italic tracking-wide animate-pulse">
            Theme: {themeId?.name || "Unknown"}
          </h2>

          <p
            className={`text-center mb-12 text-lg font-semibold ${
              votingStatus.open ? "text-green-400" : "text-red-400"
            }`}
          >
            {votingStatus.message}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {players.map((player, idx) => (
              <div
                key={player.user._id}
                className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-purple-700 rounded-xl p-6 shadow-xl"
              >
                <h3 className="text-2xl font-extrabold mb-5 glow-flicker">
                  Player {idx + 1}: {player.user.username}
                </h3>

                {player.image ? (
                  <img
                    src={player.image}
                    alt={`Drawing by ${player.user.username}`}
                    className="w-full max-w-xs aspect-square object-contain bg-white rounded-md border border-white shadow-md image-hover-scale mb-6"
                  />
                ) : (
                  <div className="w-full max-w-xs aspect-square bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-sm mb-6">
                    No Drawing Submitted
                  </div>
                )}

                <div className="space-y-4 w-full">
                  {["funniest", "weirdest", "saddest"].map(category => (
                    <button
                      key={category}
                      onClick={() => handleVote(category, player.user._id)}
                      disabled={hasVoted || !votingStatus.open}
                      className="btn-gradient"
                      type="button"
                    >
                      Vote {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {hasVoted && (
            <p className="mt-12 text-center text-green-400 font-semibold text-xl">
              ✅ Thanks! Your vote has been submitted.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default VotePage;
