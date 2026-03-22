import React, { useEffect, useState, useRef } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

// Watch-inspired close button
export function CloseButton({ isActive, position, onClose }) {
  const { gl } = useThree();
  const [shouldShow, setShouldShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isActive) {
      timerRef.current = setTimeout(() => {
        setShouldShow(false);
        setIsClosing(false);
      }, 0);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
    timerRef.current = setTimeout(() => setShouldShow(true), 300);
    return () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  }, [isActive]);

  if (!isActive) return null;

  const [x, y, z] = position;

  const handleClick = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => onClose(), 600);
  };

  const size = 52;
  const c = size / 2; // center

  // Generate guilloche pattern points
  const guillochePoints = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i / 60) * Math.PI * 2;
    const wobble = Math.sin(i * 6) * 1.2;
    const r = 13 + wobble;
    return `${c + Math.cos(angle) * r},${c + Math.sin(angle) * r}`;
  }).join(" ");

  return (
    <Html
      position={[x, y, z]}
      center
      style={{ pointerEvents: "auto", transform: "translate(-50%, -180%)" }}
      occlude
    >
      <style>{`
        @keyframes outerBezel { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes midBezel { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes tourbillon { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes jewelMoon {
          0% { box-shadow: 0 0 3px rgba(255,215,0,0.3), 0 0 6px rgba(255,215,0,0.1); background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.4) 100%); }
          25% { box-shadow: 0 0 6px rgba(255,215,0,0.5), 0 0 12px rgba(255,215,0,0.2); background: radial-gradient(circle, #ffe8a0 0%, rgba(255,200,80,0.5) 100%); }
          50% { box-shadow: 0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.3); background: radial-gradient(circle, #ffd700 0%, rgba(255,165,0,0.6) 100%); }
          75% { box-shadow: 0 0 6px rgba(255,215,0,0.5), 0 0 12px rgba(255,215,0,0.2); background: radial-gradient(circle, #ffe8a0 0%, rgba(255,200,80,0.5) 100%); }
          100% { box-shadow: 0 0 3px rgba(255,215,0,0.3), 0 0 6px rgba(255,215,0,0.1); background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.4) 100%); }
        }
        @keyframes implodeV2 {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          40% { transform: scale(1.15) rotate(90deg); opacity: 0.9; }
          100% { transform: scale(0) rotate(270deg); opacity: 0; }
        }
        @keyframes handDraw1 {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes handDraw2 {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      <button
        onClick={handleClick}
        onMouseEnter={() => { setIsHovered(true); if (canvasRef.current) canvasRef.current.style.cursor = "pointer"; }}
        onMouseLeave={() => { setIsHovered(false); if (canvasRef.current) canvasRef.current.style.cursor = "grab"; }}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: shouldShow ? 1 : 0,
          transition: "opacity 0.5s ease",
          animation: isClosing ? "implodeV2 0.5s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards" : "none",
          position: "relative",
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", top: 0, left: 0 }}>

          {/* === LAYER 1: OUTER BEZEL — slow clockwise === */}
          <g style={{ transformOrigin: `${c}px ${c}px`, animation: `outerBezel ${isHovered ? "2s" : "12s"} linear infinite` }}>
            <circle cx={c} cy={c} r="23" fill="none"
              stroke={isHovered ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.15)"}
              strokeWidth="1" style={{ transition: "stroke 0.4s ease" }} />
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * Math.PI * 2 - Math.PI / 2;
              const isMain = i % 9 === 0;
              const isMid = i % 3 === 0;
              const r1 = isMain ? 18 : isMid ? 20 : 21.5;
              return (
                <line key={`o${i}`}
                  x1={c + Math.cos(a) * r1} y1={c + Math.sin(a) * r1}
                  x2={c + Math.cos(a) * 23} y2={c + Math.sin(a) * 23}
                  stroke={isMain
                    ? (isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)")
                    : isMid
                      ? (isHovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.25)")
                      : "rgba(255,255,255,0.08)"
                  }
                  strokeWidth={isMain ? "1.5" : isMid ? "1" : "0.5"}
                  style={{ transition: "stroke 0.4s ease" }}
                />
              );
            })}
          </g>

          {/* === LAYER 2: MIDDLE BEZEL — counter-rotating === */}
          <g style={{ transformOrigin: `${c}px ${c}px`, animation: `midBezel ${isHovered ? "3s" : "20s"} linear infinite` }}>
            <circle cx={c} cy={c} r="17" fill="none"
              stroke={isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}
              strokeWidth="0.5" strokeDasharray="2 4"
              style={{ transition: "stroke 0.4s ease" }} />
          </g>

          {/* === GUILLOCHE PATTERN — engraved inner ring === */}
          <polygon
            points={guillochePoints}
            fill="none"
            stroke={isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}
            strokeWidth="0.5"
            style={{ transition: "stroke 0.4s ease" }}
          />

          {/* === TOURBILLON CAGE — rotates the X hands === */}
          <g style={{ transformOrigin: `${c}px ${c}px`, animation: `tourbillon ${isHovered ? "4s" : "0s"} linear infinite` }}>
            {/* Hand 1: drawn like a tapered watch hand */}
            <line
              x1={c - 9} y1={c - 9}
              x2={c + 9} y2={c + 9}
              stroke={isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="30"
              style={{
                transition: "stroke 0.3s",
                animation: shouldShow ? "handDraw1 0.5s ease-out 0.1s both" : "none",
              }}
            />
            {/* Hand 2 */}
            <line
              x1={c + 9} y1={c - 9}
              x2={c - 9} y2={c + 9}
              stroke={isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="30"
              style={{
                transition: "stroke 0.3s",
                animation: shouldShow ? "handDraw2 0.5s ease-out 0.25s both" : "none",
              }}
            />
          </g>

          {/* === ORBITING CHRONOGRAPH DOTS === */}
          <g style={{ transformOrigin: `${c}px ${c}px`, animation: "outerBezel 3s linear infinite" }}>
            <circle cx={c} cy={c - 20} r="1.5"
              fill={isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)"}
              style={{ transition: "fill 0.3s ease" }} />
          </g>
          <g style={{ transformOrigin: `${c}px ${c}px`, animation: "midBezel 5s linear infinite" }}>
            <circle cx={c + 18} cy={c} r="1"
              fill={isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)"}
              style={{ transition: "fill 0.3s ease" }} />
          </g>
        </svg>

        {/* === CENTER JEWEL PIVOT === */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
          transform: "translate(-50%, -50%)",
          transition: "background 0.3s ease",
        }} />
      </button>
    </Html>
  );
}
