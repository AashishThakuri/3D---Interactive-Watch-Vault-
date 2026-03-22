import React from "react";

export default function Header() {
  return (
    <header
      className="site-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          pointerEvents: "auto",
        }}
      >
        {/* Text logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize: "22px",
                fontWeight: "600",
                letterSpacing: "0.15em",
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              Chrono
            </span>
            <span
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize: "22px",
                fontWeight: "300",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
              }}
            >
              Vault
            </span>
          </div>
          <span
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize: "9px",
              fontWeight: "300",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              marginTop: "0px",
              fontStyle: "italic",
            }}
          >
            Curated Timepieces
          </span>
        </div>
      </div>

      {/* Right side - minimal nav hints */}
      <div
        className="header-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          pointerEvents: "auto",
        }}
      >
        <NavItem label="BROWSE" number="01" />
        <NavItem label="COLLECT" number="02" />
        <Divider />
        <QuoteText text="TIMEPIECES" />
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          .site-header {
            padding: 16px 20px !important;
          }
          .header-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

function NavItem({ label, number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "6px",
        cursor: "pointer",
        opacity: 0.6,
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.opacity = 1)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.opacity = 0.6)
      }
    >
      <span
        style={{
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "9px",
          fontWeight: "400",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "11px",
          fontWeight: "500",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "12px",
        background: "rgba(255,255,255,0.15)",
      }}
    />
  );
}

function QuoteText({ text }) {
  return (
    <span
      style={{
        fontFamily:
          "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "11px",
        fontWeight: "400",
        letterSpacing: "0.05em",
        color: "rgba(255,255,255,0.4)",
        opacity: 0.4,
      }}
    >
      "{text}"
    </span>
  );
}
