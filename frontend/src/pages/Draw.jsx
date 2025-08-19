import React from 'react';
import DrawingCanvas from '../components/DrawingCanvas';

const flickerAnimation = {
  animation: 'flicker 4s ease-in-out infinite alternate',
};

const Draw = () => {
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
        {/* Header */}
        <div className="max-w-3xl w-full text-center mb-12">
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text">
            🖌️ Practice{' '}
            <span
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
              style={flickerAnimation}
            >
              Drawing
            </span>
          </h1>
          
          

          <p className="text-lg sm:text-xl max-w-xl mx-auto mb-2 leading-relaxed text-white">
            This is your space to experiment, practice, and sharpen your drawing skills.
          </p>
          <p className="text-sm text-white">
            Try different ideas, test your creativity — no pressure, just practice.
          </p>
        </div>

        {/* Drawing Canvas Container */}
        <div
          className="w-full max-w-5xl p-8 rounded-3xl border border-purple-600 bg-black bg-opacity-25 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.5)] sm:h-full h-[500px] transition-transform duration-300 hover:scale-[1.03]"
          tabIndex={0}
          aria-label="Drawing canvas"
        >
          <DrawingCanvas />
        </div>

        <footer className="text-sm text-gray-400 opacity-70 mt-20 select-none glow-text">
          © 2025 SketchBattle — Keep Creating!
        </footer>
      </div>
    </>
  );
};

export default Draw;
