import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../store/useThemeStore";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState(null);

  const { themes, getTheme } = useThemeStore();

  useEffect(() => {
    getTheme();
  }, []);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = width;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#7c3aed"; // purple stroke
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const startDrawing = () => {
    if (!themes || themes.length === 0) {
      alert("No themes available. Please try again later.");
      return;
    }
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
    setTimeLeft(20);
    setStarted(true);
    resizeCanvas();
  };

  const getPos = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  const handlePointerDown = (e) => {
    if (!started) return;
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerUp = (e) => {
    if (!started) return;
    e.preventDefault();
    setDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.closePath();
  };

  const handlePointerMove = (e) => {
    if (!drawing || !started) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handlePointerDown, { passive: false });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    canvas.addEventListener("touchend", handlePointerUp, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerUp);
    };
  }, [drawing, started]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "my-drawing.png";
    link.click();
  };

  return (
    <>
      <style>{`
        /* Reusing glow animation from Draw page */

        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: none; /* no heavy blur on white background */
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
          /* no text-shadow blur for clarity */
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
        }

        .glow-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #ec4899;
        }
      `}</style>

      <div className="flex flex-col items-center gap-6 w-full">
        <h2 className="text-2xl font-bold glow-text">🎨 Practice Drawing</h2>

        <button
          onClick={startDrawing}
          className="glow-button px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
        >
          Start Drawing
        </button>

        {started && (
          <>
            <p className="text-red-400 font-semibold text-lg glow-text">
              ⏱️ Time Left: {timeLeft}s
            </p>
            {theme && (
              <p className="text-indigo-400 font-semibold text-lg glow-text">
                Theme: {theme.name}
              </p>
            )}
          </>
        )}

        <div
          ref={containerRef}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl aspect-square border-2 border-purple-600 rounded-md shadow-lg bg-white"
        >
          <canvas
            ref={canvasRef}
            className="touch-none w-full h-full rounded-md"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
          />
        </div>

        {!started && timeLeft === 0 && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-yellow-400 font-semibold text-lg glow-text">⏰ Time’s up!</p>
            <button
              onClick={downloadImage}
              className="glow-button px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2"
            >
              Download Your Drawing
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DrawingCanvas;
