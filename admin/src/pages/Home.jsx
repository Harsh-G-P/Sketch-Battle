import React, { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';

const Home = () => {
  const { stats, fetchStats, loading } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const winRate = stats.totalBattles ? (stats.totalWins / stats.totalBattles) * 100 : 0;
  const lossRate = stats.totalBattles ? (stats.totalLosses / stats.totalBattles) * 100 : 0;
  const drawRate = stats.totalBattles ? (stats.totalDraws / stats.totalBattles) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8 font-sans text-cyan-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-[0_0_10px_cyan]">
          🧠 Admin Dashboard Overview
        </h1>

        {loading ? (
          <div className="flex justify-center items-center space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-cyan-500 animate-ping" />
            ))}
          </div>
        ) : (
          <>
            {/* Admin Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: 'Total Users',
                  value: stats.totalUsers,
                  color: 'text-cyan-300',
                  border: 'border-cyan-500',
                },
                {
                  title: 'Total Battles',
                  value: stats.totalBattles,
                  color: 'text-purple-300',
                  border: 'border-purple-500',
                },
                {
                  title: 'Drawings Submitted',
                  value: stats.totalDrawingsSubmitted,
                  color: 'text-pink-300',
                  border: 'border-pink-500',
                },
                {
                  title: 'Avg Battles/User',
                  value: stats.totalUsers ? (stats.totalBattles / stats.totalUsers).toFixed(2) : 0,
                  color: 'text-yellow-300',
                  border: 'border-yellow-400',
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border-2 ${item.border} bg-white/5 backdrop-blur-md shadow-lg hover:scale-[1.01] transition duration-200`}
                >
                  <h3 className="text-sm text-gray-400 mb-2">{item.title}</h3>
                  <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Win/Loss/Draw Progress Bar */}
            <div className="mb-10 p-6 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 shadow-md shadow-cyan-500/10">
              <h2 className="text-xl font-semibold mb-4 text-cyan-200">Battle Outcome Breakdown</h2>
              <div className="w-full h-8 flex rounded-lg overflow-hidden bg-gray-800 shadow-inner mb-4">
                <div
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${winRate}%` }}
                  title={`Wins: ${stats.totalWins}`}
                />
                <div
                  className="bg-red-600 transition-all duration-500"
                  style={{ width: `${lossRate}%` }}
                  title={`Losses: ${stats.totalLosses}`}
                />
                <div
                  className="bg-yellow-400 transition-all duration-500"
                  style={{ width: `${drawRate}%` }}
                  title={`Draws: ${stats.totalDraws}`}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-400 font-mono">
                <span>Wins: <span className="text-green-400 font-semibold">{winRate.toFixed(1)}%</span></span>
                <span>Losses: <span className="text-red-500 font-semibold">{lossRate.toFixed(1)}%</span></span>
                <span>Draws: <span className="text-yellow-300 font-semibold">{drawRate.toFixed(1)}%</span></span>
              </div>
            </div>

            {/* Placeholder */}
            <div className="p-6 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 shadow-md shadow-cyan-500/10">
              <h2 className="text-xl font-semibold text-cyan-200 mb-2">🔍 Recent Activity</h2>
              <p className="text-gray-400 text-sm">
                Coming soon: user signups, new battles, voting trends...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
