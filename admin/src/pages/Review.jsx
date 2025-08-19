import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

const Review = () => {
  const { battleId } = useParams();
  const { reviewVotes } = useAdminStore();
  const [voteData, setVoteData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await reviewVotes(battleId);
      if (data) setVoteData(data);
    };
    fetch();
  }, [battleId]);

  if (!voteData)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500 border-opacity-50"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4 drop-shadow">
            🗳️ Vote Review
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Battle ID: <span className="text-white">{voteData.battleId}</span>
          </p>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">
              🎨 Players & Their Drawings
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {voteData.players.map((p, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur text-center"
                >
                  {p.avatar && (
                    <img
                      src={p.avatar}
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400 mx-auto"
                    />
                  )}
                  <p className="text-white font-medium">{p.username}</p>
                  {p.drawing ? (
                    <img
                      src={p.drawing}
                      alt={`${p.username}'s drawing`}
                      className="w-full max-h-40 mt-3 rounded-lg border border-cyan-600 object-contain"
                    />
                  ) : (
                    <p className="text-gray-500 italic mt-3">No drawing</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(voteData.votes).map(([category, votes]) => (
            <div key={category} className="mb-10">
              <h3 className="text-lg font-semibold text-cyan-200 capitalize mb-4">
                {category} Votes
              </h3>
              <ul className="space-y-4">
                {votes.map((vote, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-lg backdrop-blur border border-white/10"
                  >
                    {vote.voter?.avatar ? (
                      <img
                        src={vote.voter.avatar}
                        alt="voter avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-700" />
                    )}
                    <span className="font-medium text-white">
                      {vote.voter?.username || "Unknown"}
                    </span>

                    <span className="text-gray-400">voted for</span>

                    {vote.votedFor?.avatar ? (
                      <img
                        src={vote.votedFor.avatar}
                        alt="voted for avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-700" />
                    )}
                    <span className="font-semibold text-cyan-300">
                      {vote.votedFor?.username || "Unknown"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
