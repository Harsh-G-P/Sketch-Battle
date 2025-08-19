import React, { useRef, useState, useEffect } from "react";

const BattleDrawingCanvas = ({ theme, isDrawingActive, onDrawingComplete }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const hasDrawnRef = useRef(false);

  // Resize canvas to match container
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = width; // keep it square

    // Set display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set internal resolution for crisp lines on retina
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

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Clear canvas when theme or drawing state changes
  useEffect(() => {
    if (isDrawingActive) {
      resizeCanvas();
      hasDrawnRef.current = false;
    }
  }, [isDrawingActive, theme]);

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
    if (!isDrawingActive) return;
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e) => {
    if (!drawing || !isDrawingActive) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasDrawnRef.current = true;
  };

  const handlePointerUp = (e) => {
    if (!isDrawingActive) return;
    e.preventDefault();
    setDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.closePath();

    if (hasDrawnRef.current) {
      const dataUrl = canvas.toDataURL("image/png");
      onDrawingComplete(dataUrl);
      hasDrawnRef.current = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handlePointerDown, { passive: false });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    canvas.addEventListener("touchend", handlePointerUp, { passive: false });
    canvas.addEventListener("touchcancel", handlePointerUp, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerUp);
      canvas.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [drawing, isDrawingActive]);

  return (
    <>
      <style>{`
        /* Glow text animation */
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

        .canvas-container {
          border: 3px solid #7c3aed;
          box-shadow: 0 0 20px #8b5cf6;
          border-radius: 12px;
          background: white;
        }
      `}</style>

      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-2xl font-bold glow-text">🎨 Theme: {theme?.name || "Loading..."}</h2>

        <div
          ref={containerRef}
          className="canvas-container w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl aspect-square shadow-lg"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none rounded-md"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
          />
        </div>
      </div>
    </>
  );
};

export default BattleDrawingCanvas;
