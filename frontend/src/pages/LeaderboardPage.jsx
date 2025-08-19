import React, { useEffect, useState, useRef } from "react";
import { useBattleStore } from "../store/useBattleStore";

const LeaderboardPage = ({ votingEndTime }) => {
  const [sortBy, setSortBy] = useState("battlesWon");
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const fetchLeaderboard = useBattleStore((state) => state.fetchLeaderboard);
  const timeoutRef = useRef(null);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchLeaderboard(sortBy);
    setLeaderboard(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!votingEndTime) return;

    const now = Date.now();
    const endTime = new Date(votingEndTime).getTime();
    const msUntilEnd = endTime - now;

    if (msUntilEnd > 0) {
      timeoutRef.current = setTimeout(() => {
        loadLeaderboard();
      }, msUntilEnd);
    } else {
      loadLeaderboard();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sortBy, fetchLeaderboard, votingEndTime]);

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
            filter: brightness(1.2);
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
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <h1
          className="text-6xl font-extrabold text-center mb-10 tracking-tight glow-text"
        >
          🏆 Leader
          <span
            className="glow-flicker bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent"
          >
            board
          </span>
        </h1>

        <div className="mb-8 flex items-center justify-center gap-3">
          <label htmlFor="sort" className="text-gray-300 font-semibold">
            Sort by:
          </label>
          <select
            id="sort"
            className="bg-gradient-to-br from-gray-800 to-black text-white rounded-md px-4 py-2 border border-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="battlesWon">Wins</option>
            <option value="funnyVotes">Funny Votes</option>
            <option value="battlesPlayed">Battles Played</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-yellow-400 font-semibold">
            Loading leaderboard...
          </p>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-gray-400 font-medium">
            No data available yet.
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block bg-white/5 backdrop-blur-md border border-indigo-500/30 rounded-xl shadow-2xl p-4 sm:p-6 mx-auto max-w-5xl">
              <div className="w-full overflow-x-auto">
                <table className="min-w-[600px] w-full text-left border-collapse">
                  <thead className="bg-gray-800/70 uppercase text-gray-300 text-sm tracking-wider rounded-t">
                    <tr>
                      <th className="py-3 px-6">Player</th>
                      <th className="py-3 px-6 text-center">Wins</th>
                      <th className="py-3 px-6 text-center">Funny Votes</th>
                      <th className="py-3 px-6 text-center">Battles Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, idx) => (
                      <tr
                        key={player._id}
                        className={`border-b border-gray-700 ${
                          idx % 2 === 0
                            ? "bg-gray-900/50"
                            : "bg-gray-800/50"
                        } hover:bg-purple-900/30 transition-colors duration-200`}
                      >
                        <td className="py-3 px-6 flex items-center gap-4 font-medium text-white">
                          {player.avatar ? (
                            <img
                              src={player.avatar}
                              alt={player.username}
                              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-lg font-bold text-gray-900 uppercase">
                              {player.username.charAt(0)}
                            </div>
                          )}
                          {player.username}
                        </td>
                        <td className="py-3 px-6 text-center text-indigo-300">
                          {player.battlesWon || 0}
                        </td>
                        <td className="py-3 px-6 text-center text-pink-300">
                          {player.funniestVotes || 0}
                        </td>
                        <td className="py-3 px-6 text-center text-purple-300">
                          {player.battlesPlayed || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-4 mt-8">
              {leaderboard.map((player) => (
                <div
                  key={player._id}
                  className="bg-white/5 backdrop-blur-md border border-indigo-400/40 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-lg font-bold text-gray-900 uppercase">
                        {player.username.charAt(0)}
                      </div>
                    )}
                    <span className="text-lg font-semibold text-white">
                      {player.username}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>
                      <span className="font-semibold text-indigo-300">
                        Wins:
                      </span>{" "}
                      {player.battlesWon || 0}
                    </div>
                    <div>
                      <span className="font-semibold text-pink-300">
                        Funny Votes:
                      </span>{" "}
                      {player.funniestVotes || 0}
                    </div>
                    <div>
                      <span className="font-semibold text-purple-300">
                        Battles Played:
                      </span>{" "}
                      {player.battlesPlayed || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage;
