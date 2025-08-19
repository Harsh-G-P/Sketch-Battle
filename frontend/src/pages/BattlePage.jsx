import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BattleDrawingCanvas from "../components/BattleDrawingCanvas";
import { useThemeStore } from "../store/useThemeStore";
import { useBattleStore } from "../store/useBattleStore";
import { useAuthStore } from "../store/useAuthStore";

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
};

const BattlePage = () => {
  const navigate = useNavigate();
  const { battleId } = useParams();
  const { themes, getTheme } = useThemeStore();
  const { currentBattle, fetchBattle, submitDrawing } = useBattleStore();
  const { authUser } = useAuthStore();

  const [theme, setTheme] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [startTime, setStartTime] = useState(null);
  const [drawingData, setDrawingData] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (battleId) fetchBattle(battleId);
  }, [battleId, fetchBattle]);

  useEffect(() => {
    getTheme();
  }, [getTheme]);

  useEffect(() => {
    if (currentBattle?.startTime) {
      setStartTime(new Date(currentBattle.startTime).getTime());
    }
  }, [currentBattle]);

  useEffect(() => {
    if (themes.length === 0) return;
    const index = parseInt(battleId, 10) % themes.length;
    setTheme(themes[index]);
  }, [themes, battleId]);

  useEffect(() => {
    if (startTime === null) return;

    const drawingEndTime = startTime + 20000;
    const drawingEnded = now >= drawingEndTime;

    if (drawingEnded && drawingData && !waitingForOpponent) {
      const timeSinceEnd = now - drawingEndTime;
      const delay = Math.max(0, 20000 - timeSinceEnd);

      if (!redirectTimeoutRef.current) {
        redirectTimeoutRef.current = setTimeout(() => {
          navigate("/battle-lobby", {
            state: { message: "You did not submit your drawing in time." },
          });
        }, delay);
      }
    } else {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [now, startTime, drawingData, waitingForOpponent, navigate]);

  useEffect(() => {
    if (!waitingForOpponent) return;

    let redirectTimer = null;

    const checkBattleStatus = async () => {
      const updatedBattle = await fetchBattle(battleId);
      const players = updatedBattle?.players || [];

      const me = players.find((p) => p.user._id === authUser._id);
      const opponent = players.find((p) => p.user._id !== authUser._id);

      if (me?.image && opponent?.image) {
        navigate("/battle-result", {
          state: {
            theme,
            playerDrawing: me.image,
            opponentDrawing: opponent.image,
          },
        });
      } else if (me?.image && !opponent?.image) {
        if (!redirectTimer) {
          redirectTimer = setTimeout(() => {
            navigate("/battle-lobby", {
              state: { message: "Opponent did not submit drawing in time." },
            });
          }, 20000);
        }
      }
    };

    checkBattleStatus();
    const intervalId = setInterval(checkBattleStatus, 3000);

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
      clearInterval(intervalId);
    };
  }, [waitingForOpponent, battleId, fetchBattle, authUser._id, navigate, theme]);

  const secondsUntilStart = startTime ? Math.max(0, Math.floor((startTime - now) / 1000)) : null;
  const drawingStarted = startTime && now >= startTime;
  const drawingEnded = startTime && now >= startTime + 20000;
  const timeLeft = startTime ? Math.max(0, Math.floor((startTime + 20000 - now) / 1000)) : 0;

  const handleDrawingComplete = (imageData) => {
    setDrawingData(imageData);
  };

  const handleSubmitDrawing = async () => {
    if (!drawingData) return;
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    await submitDrawing(battleId, drawingData);
    setWaitingForOpponent(true);
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
        .glow-text {
          animation: textGlow 3s ease-in-out infinite;
          color: #c084fc;
          text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
        }
        .glow-flicker {
          animation: textGlow 4s ease-in-out infinite alternate;
          color: #a78bfa;
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
        .glass-container {
          background: rgba(17, 17, 17, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
          border-radius: 24px;
          padding: 1.5rem;
          max-width: 70rem;
          width: 100%;
          margin: auto;
          transition: transform 0.3s ease;
        }
        .glass-container:hover {
          transform: scale(1.03);
        }
        .btn-gradient {
          background: linear-gradient(90deg, #a855f7, #ec4899);
          box-shadow: 0 0 10px #a855f7, 0 0 20px #ec4899;
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          transition: filter 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .btn-gradient:hover {
          filter: brightness(1.2);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-10 flex flex-col items-center justify-center text-center gap-6">
        <h1
          className="text-3xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
        >
          🎨 Battle #{" "} <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={flickerAnimation}
          >
            {battleId.slice(-5)}
          </span>
        </h1>

        {!startTime ? (
          <p className="text-yellow-400 font-bold text-lg animate-pulse">
            Waiting for opponent to start...
          </p>
        ) : !drawingStarted ? (
          <p className="text-3xl font-bold text-yellow-400 animate-pulse">
            Get ready... {secondsUntilStart}s
          </p>
        ) : !drawingEnded ? (
          <>
            <p className="text-red-400 font-bold text-lg">⏱ Time Left: {timeLeft}s</p>
            <div className="glass-container">
              <BattleDrawingCanvas
                theme={theme}
                isDrawingActive={true}
                timeLimit={timeLeft}
                onDrawingComplete={handleDrawingComplete}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-yellow-400 font-semibold text-lg">
              🕒 Time's up! Submit your drawing.
            </p>
            {drawingData ? (
              <>
                <img
                  src={drawingData}
                  alt="Your drawing"
                  className="border-2 border-indigo-500 rounded-lg shadow-lg max-w-xs my-4 bg-white p-2"
                />
                <button
                  onClick={handleSubmitDrawing}
                  className="btn-gradient"
                >
                  ✅ Submit Drawing
                </button>
              </>
            ) : (
              <div className="mt-4">
                <p className="text-gray-400">No drawing submitted.</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 btn-gradient"
                >
                  🔙 Back to Home
                </button>
              </div>
            )}
          </>
        )}

        {waitingForOpponent && (
          <p className="text-blue-400 font-semibold text-xl animate-pulse">
            ✨ Drawing submitted. Waiting for opponent...
          </p>
        )}
      </div>
    </>
  );
};

export default BattlePage;
