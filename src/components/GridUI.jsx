import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "./grid/gridConfig";

// Chrono Nav - watch-inspired navigation bar

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};

export function UnifiedControlBar({
  currentCollection,
  onSwitch,
  setZoomTrigger,
  isZoomedIn,
  hasActiveSelection,
  brandFilter,
  onFilterChange,
  currentItems = [],
}) {
  const collections = [
    { id: "all", label: "All", icon: "◈" },
    { id: "luxury", label: "Luxury", icon: "♔" },
    { id: "sport", label: "Sport", icon: "⚡" },
    { id: "budget", label: "Under $500", icon: "◆" },
  ];

  // Dynamically compute top brands from current collection items
  const brandFilters = useMemo(() => {
    const counts = {};
    currentItems.forEach((w) => {
      if (w.brand && w.brand !== "Unknown") {
        counts[w.brand] = (counts[w.brand] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6) // Top 6 brands
      .map(([brand]) => ({ id: brand, label: brand }));
    return sorted;
  }, [currentItems]);

  return (
    <div
      className="chrono-nav-container"
      style={{
        position: "fixed",
        bottom: "clamp(16px, 4vh, 40px)",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: 100,
        pointerEvents: "none",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Mobile brand filters — shown above the main bar on small screens */}
      <AnimatePresence>
        {!isZoomedIn && !hasActiveSelection && (
          <motion.div
            className="mobile-brand-filters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={springTransition}
            style={{
              display: "none",
              justifyContent: "center",
              width: "100%",
              pointerEvents: "none",
            }}
          >
            <div style={{
              display: "flex",
              gap: "2px",
              padding: "4px 6px",
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              pointerEvents: "auto",
            }}>
              {brandFilters.map((filter) => (
                <BrandChip
                  key={`mobile-${filter.id}`}
                  isActive={brandFilter === filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  layoutGroup="mobile"
                >
                  {filter.label}
                </BrandChip>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN CHRONOGRAPH NAV === */}
      <motion.div
        className="chrono-nav-island"
        layout
        transition={springTransition}
        style={{
          alignSelf: "center",
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          borderRadius: "100px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
          height: "50px",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {hasActiveSelection ? (
            /* === VIEW WATCH STATE === */
            <motion.button
              key="view-watch"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              transition={{ ...springTransition, opacity: { duration: 0.2 } }}
              onClick={() => {}}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#e8dcc8",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "100px",
                padding: "0 28px",
                height: "40px",
                fontSize: "13px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: "600",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ fontSize: "10px", opacity: 0.6 }}>⟐</span>
              View Watch
            </motion.button>
          ) : isZoomedIn ? (
            /* === COMPACT / ZOOM OUT STATE === */
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ ...springTransition, opacity: { duration: 0.2 } }}
              style={{ display: "flex" }}
            >
              <CrownButton
                icon="out"
                onClick={() => setZoomTrigger("OUT")}
                label="Zoom Out"
              />
            </motion.div>
          ) : (
            /* === FULL NAVIGATION STATE === */
            <motion.div
              key="full-nav"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{ ...springTransition, opacity: { duration: 0.2 } }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
              }}
            >
              {/* Crown zoom button */}
              <CrownButton
                icon="in"
                onClick={() => setZoomTrigger(CONFIG.zoomIn)}
                label="Zoom In"
              />

              {/* Engraved divider */}
              <EngravedDivider />

              {/* Collection tabs */}
              <div style={{ display: "flex", gap: "1px" }}>
                {collections.map((col, index) => {
                  const isActive = currentCollection === index;
                  return (
                    <ChronoTab
                      key={col.id}
                      isActive={isActive}
                      onClick={() => onSwitch(index)}
                      icon={col.icon}
                    >
                      {col.label}
                    </ChronoTab>
                  );
                })}
              </div>

              {/* Brand filters — desktop only */}
              <div className="desktop-brand-filters">
                <EngravedDivider />
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={springTransition}
                  style={{ display: "flex", gap: "2px" }}
                >
                  {brandFilters.map((filter) => (
                    <BrandChip
                      key={filter.id}
                      isActive={brandFilter === filter.id}
                      onClick={() => onFilterChange(filter.id)}
                      layoutGroup="desktop"
                    >
                      {filter.label}
                    </BrandChip>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* === RESPONSIVE STYLES === */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

        .desktop-brand-filters {
          display: flex;
          align-items: center;
        }
        .mobile-brand-filters {
          display: none !important;
        }

        @media (max-height: 800px) {
          .chrono-nav-container { bottom: 20px !important; }
          .chrono-nav-island { height: 46px !important; padding: 4px !important; }
        }
        @media (max-height: 650px) {
          .chrono-nav-container { bottom: 12px !important; }
          .chrono-nav-island { height: 42px !important; }
        }
        @media (max-width: 768px) {
          .chrono-nav-container { bottom: 16px !important; }
          .chrono-nav-island { height: 46px !important; padding: 4px !important; }
          .desktop-brand-filters { display: none !important; }
          .mobile-brand-filters { display: flex !important; }
        }
        @media (max-width: 480px) {
          .chrono-nav-container { bottom: 12px !important; }
          .chrono-nav-island { height: 42px !important; }
          .chrono-tab-label { display: none !important; }
          .chrono-tab-icon { display: block !important; font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}

// Crown Zoom Button
function CrownButton({ onClick, icon, label }) {
  return (
    <motion.button
      layout="position"
      onClick={onClick}
      className="crown-button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        background: "rgba(255, 255, 255, 0.05)",
        color: "#e8dcc8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label={label}
    >
      {/* Crown notch marks */}
      <svg width="40" height="40" viewBox="0 0 40 40"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.2 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const r1 = i % 3 === 0 ? 15 : 17;
          const r2 = 19;
          return (
            <line key={i}
              x1={20 + Math.cos(a) * r1} y1={20 + Math.sin(a) * r1}
              x2={20 + Math.cos(a) * r2} y2={20 + Math.sin(a) * r2}
              stroke="rgba(255,255,255,0.5)" strokeWidth={i % 3 === 0 ? "1.5" : "0.5"} />
          );
        })}
      </svg>
      {/* Plus / Minus icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {icon === "in" ? (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </>
        ) : (
          <line x1="5" y1="12" x2="19" y2="12" />
        )}
      </svg>
    </motion.button>
  );
}

// Engraved Divider
function EngravedDivider() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ delay: 0.05, duration: 0.3 }}
      style={{
        width: "1px",
        height: "20px",
        background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent 100%)",
        margin: "0 8px",
        transformOrigin: "center",
      }}
    />
  );
}

// Chrono Tab
function ChronoTab({ children, isActive, onClick, icon }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="chrono-tab"
      whileTap={{ scale: 0.92 }}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        color: isActive ? "#fff" : "rgba(255, 255, 255, 0.4)",
        padding: "8px 14px",
        borderRadius: "100px",
        fontSize: "12px",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: isActive ? "600" : "400",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        cursor: "pointer",
        whiteSpace: "nowrap",
        zIndex: 1,
        transition: "color 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span className="chrono-tab-icon" style={{
        display: "none",
        fontSize: "14px",
        lineHeight: 1,
      }}>{icon}</span>
      <span className="chrono-tab-label">{children}</span>
      {isActive && (
        <motion.div
          layoutId="chronoActiveTab"
          transition={springTransition}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
}

// Brand Filter Chip
function BrandChip({ children, isActive, onClick, layoutGroup = "default" }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="brand-chip"
      whileTap={{ scale: 0.92 }}
      transition={springTransition}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        color: isActive ? "#fff" : "rgba(255, 255, 255, 0.35)",
        padding: "5px 12px",
        borderRadius: "100px",
        fontSize: "11px",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: isActive ? "600" : "400",
        letterSpacing: "1px",
        textTransform: "uppercase",
        cursor: "pointer",
        whiteSpace: "nowrap",
        zIndex: 1,
        transition: "color 0.3s ease",
      }}
    >
      {isActive && (
        <motion.div
          layoutId={`chronoBrandActive-${layoutGroup}`}
          transition={springTransition}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "100px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            zIndex: -1,
          }}
        />
      )}
      {children}
    </motion.button>
  );
}
