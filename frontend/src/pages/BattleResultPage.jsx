import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
};

const BattleResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-center text-white p-6">
        <p className="text-xl font-semibold text-yellow-400 mb-4">⚠️ No battle data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-black font-semibold shadow transition"
        >
          🔙 Go Back and Draw
        </button>
      </div>
    );
  }

  const { theme, playerDrawing, opponentDrawing } = state;

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

        .glow-flicker {
          animation: textGlow 4s ease-in-out infinite alternate;
          color: #a78bfa;
        }

        .image-hover-scale:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
          cursor: pointer;
          box-shadow: 0 0 15px #a855f7;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-10 flex flex-col items-center">
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
        >
          🏆 Battle{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={flickerAnimation}
          >
            Results
          </span>
        </h1>

        <h2 className="text-2xl font-semibold text-indigo-300 mb-10 animate-pulse">
          🎨 Theme: {theme?.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-5xl">
          {/* Your Drawing */}
          <div className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-blue-500 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-400 glow-flicker">🧑 You</h3>
            <img
              src={playerDrawing}
              alt="Your Drawing"
              className="w-full max-w-xs aspect-square object-contain bg-white rounded-md border border-white shadow-md image-hover-scale"
            />
          </div>

          {/* Opponent Drawing */}
          <div className="flex flex-col items-center bg-white/5 backdrop-blur-md border border-pink-500 rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-3 text-pink-400 glow-flicker">👤 Opponent</h3>
            <img
              src={opponentDrawing}
              alt="Opponent Drawing"
              className="w-full max-w-xs aspect-square object-contain bg-white rounded-md border border-white shadow-md image-hover-scale"
            />
          </div>
        </div>

        <p className="text-yellow-300 text-lg font-medium mb-10">
          🗳 Voting & Results coming soon!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            🔙 Back to Home
          </button>
          <button
            onClick={() => navigate("/gallery")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            🖼 View Gallery
          </button>
        </div>
      </div>
    </>
  );
};

export default BattleResultPage;
