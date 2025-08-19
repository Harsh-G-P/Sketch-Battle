import React from "react";
import { Link } from "react-router-dom";

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
};

const Home = () => {
  return (
    <>
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: none; /* removed drop-shadow */
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
          /* no text-shadow here, so no blur */
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 px-6 py-12 flex flex-col items-center font-sans">
        <h1
          className="text-6xl sm:text-7xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
        >
          🎨 Welcome to{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={flickerAnimation}
          >
            SketchBattle
          </span>
        </h1>

        <p className="max-w-2xl text-center text-lg sm:text-xl mb-14 leading-relaxed text-white">
          Challenge friends or strangers to a drawing battle. Submit your sketch
          and let the world vote! Fun, fast, and totally artistic.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 items-center mb-20">
          <Link to="/gallery">
            <button
              aria-label="View Gallery"
              style={flickerAnimation}
              className="relative px-10 py-4 font-semibold text-lg rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
            >
              🎨 View Gallery
              <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 opacity-60 blur-xl animate-pulse"></span>
            </button>
          </Link>

          <Link to="/battle-lobby">
            <button
              aria-label="Start a Battle"
              className="relative px-10 py-4 font-semibold text-lg rounded-lg border-2 border-purple-600 text-purple-400 bg-black bg-opacity-25 hover:bg-purple-900 hover:text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
              style={{ textShadow: "0 0 8px rgba(139, 92, 246, 0.6)" }}
            >
              ⚔️ Start a Battle
              <span className="absolute inset-0 rounded-lg border border-purple-600 opacity-40 blur-sm animate-pulse"></span>
            </button>
          </Link>
        </div>

        {/* Glassmorphic Video Section */}
        <div className="w-full max-w-5xl bg-black bg-opacity-25 backdrop-blur-xl border border-purple-600 rounded-3xl p-8 shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-transform duration-300 hover:scale-[1.03]">
          <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide drop-shadow-[0_0_8px_rgba(139,92,246,0.7)] glow-text">
            📺 How to Play
          </h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-purple-700 shadow-lg">
            <video
              src="/videos/draw.mov"
              controls
              className="w-full h-full object-cover rounded-xl"
              preload="metadata"
            />
          </div>
        </div>

        <footer className="text-sm text-gray-400 opacity-70 mt-20 select-none glow-text">
          © 2025 SketchBattle — Crafted with ❤️ by Saiki
        </footer>
      </div>
    </>
  );
};

export default Home;
