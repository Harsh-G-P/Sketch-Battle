import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBattleStore } from "../store/useBattleStore";

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
};

const WaitingPage = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { fetchBattle } = useBattleStore();
  const [battle, setBattle] = useState(null);

  useEffect(() => {
    const pollBattle = async () => {
      const fetchedBattle = await fetchBattle(battleId);
      setBattle(fetchedBattle);

      if (fetchedBattle?.players?.length === 2) {
        navigate(`/battle/${battleId}`);
      }
    };

    pollBattle(); // Initial call
    const interval = setInterval(pollBattle, 3000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      navigate("/battle-lobby");
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [battleId, fetchBattle, navigate]);

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

        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1f2937, #111827);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 1.5rem;
          font-family: 'Inter', sans-serif;
          color: #ddd6fe;
          text-align: center;
        }

        .glow-pulse-box {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(15px);
          border: 2px solid #7c3aed;
          border-radius: 1rem;
          color: #d8b4fe;
          font-weight: 600;
          padding: 1rem 2rem;
          box-shadow: 0 0 15px #7c3aedaa;
          user-select: text;
        }

        .redirect-text {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>

      <div className="page-container">
        <h1
          className="text-3xl sm:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
        >
          ⏳ Waiting for <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={flickerAnimation}
          >
            Opponent
          </span>
        </h1>

        <p className="imax-w-2xl text-center text-lg sm:text-xl mb-7 leading-relaxed text-white">
          Share your battle link or sit tight while we find someone to join!
        </p>

        <div className="glow-pulse-box">
          Battle ID: <span className="text-white select-all">{battleId}</span>
        </div>

        <p className="redirect-text">
          You'll be redirected automatically once your opponent joins.
        </p>
      </div>
    </>
  );
};

export default WaitingPage;
