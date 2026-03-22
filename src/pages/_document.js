import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
        {/* Inline critical CSS for instant loading screen */}
        <style dangerouslySetInnerHTML={{ __html: `
          #preloader {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 99999;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: opacity 1s ease-out;
          }
          #preloader.hidden {
            opacity: 0;
            pointer-events: none;
          }
          #preloader .clock-ring {
            width: 160px; height: 160px;
            position: relative;
            margin-bottom: 48px;
          }
          #preloader .clock-ring svg {
            position: absolute; top: 0; left: 0;
          }
          #preloader .clock-hand-sec {
            position: absolute;
            top: 50%; left: 50%;
            width: 2px; height: 60px;
            background: linear-gradient(to top, rgba(255,255,255,0) 0%, #fff 100%);
            transform-origin: bottom center;
            margin-top: -60px; margin-left: -1px;
            animation: spin-sec 2s linear infinite;
          }
          #preloader .clock-hand-min {
            position: absolute;
            top: 50%; left: 50%;
            width: 2px; height: 35px;
            background: rgba(255,255,255,0.5);
            transform-origin: bottom center;
            margin-top: -35px; margin-left: -1px;
            animation: spin-min 12s linear infinite;
          }
          #preloader .clock-pivot {
            position: absolute;
            top: 50%; left: 50%;
            width: 6px; height: 6px;
            background: #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
          #preloader .brand-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 8px;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            margin: 0;
            animation: fade-in-up 1.2s ease-out 0.2s both;
          }
          #preloader .brand-sub {
            font-family: 'Cormorant Garamond', serif;
            font-size: 13px;
            font-weight: 300;
            letter-spacing: 6px;
            color: rgba(255, 255, 255, 0.3);
            text-transform: uppercase;
            margin-top: 8px;
            font-style: italic;
            animation: fade-in-up 1.2s ease-out 0.5s both;
          }
          #preloader .big-number {
            position: absolute;
            bottom: 2vh; right: 4vw;
            font-family: 'Cormorant Garamond', serif;
            font-size: 22vh;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.2);
            line-height: 1;
            letter-spacing: -0.03em;
            display: flex;
            align-items: baseline;
          }
          #preloader .big-number .pct {
            font-size: 10vh;
            margin-left: 8px;
            color: rgba(255, 255, 255, 0.1);
          }
          @keyframes spin-sec {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-min {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes count-pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.35; }
          }
        `}} />
      </Head>
      <body>
        {/* Instant preloader - rendered in HTML before any JS */}
        <div id="preloader">
          <div className="clock-ring">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="80" y1={i % 3 === 0 ? "8" : "12"}
                  x2="80" y2={i % 3 === 0 ? "22" : "18"}
                  stroke={i % 3 === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
                  strokeWidth={i % 3 === 0 ? "2" : "1"}
                  transform={`rotate(${i * 30} 80 80)`}
                />
              ))}
            </svg>
            <div className="clock-hand-sec" />
            <div className="clock-hand-min" />
            <div className="clock-pivot" />
          </div>
          <p className="brand-text">Chrono Vault</p>
          <p className="brand-sub">curated timepieces</p>
          <div className="big-number">
            <span id="preloader-count">0</span>
            <span className="pct">%</span>
          </div>
        </div>
        <Main />
        <NextScript />
        {/* Inline script to animate the counter before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var el = document.getElementById('preloader-count');
            var val = 0;
            var iv = setInterval(function() {
              val++;
              el.textContent = val;
              if (val >= 100) {
                clearInterval(iv);
                // Pause briefly at 100, then fade out
                setTimeout(function() {
                  var p = document.getElementById('preloader');
                  if (p) { p.classList.add('hidden'); }
                  setTimeout(function() { if (p) p.remove(); }, 1200);
                }, 600);
              }
            }, 35);
          })();
        `}} />
      </body>
    </Html>
  );
}
