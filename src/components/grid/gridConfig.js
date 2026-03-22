// Grid config
// Default values - will be overridden by controls
export const DEFAULT_CONFIG = {
  gridCols: 8,
  itemSize: 2.8,
  itemWidth: 1.8, // Estimated average width for a watch
  gap: 1.0, // Equal gap for both X and Y

  // Physics
  dragSpeed: 2.2,
  dampFactor: 0.2,
  tiltFactor: 0.08,
  clickThreshold: 5,
  dragResistance: 0.25,

  // Camera / Zoom
  zoomIn: 14,
  zoomOut: 38, // Starting zoom level (configurable via Leva)
  zoomDamp: 0.25,

  // Visuals
  focusScale: 1.5,
  dimScale: 0.5,
  dimOpacity: 0.15,

  // 3D Curvature Effect
  curvatureStrength: 0.06, // How much it curves back
  rotationStrength: 0, // How much tiles rotate to face center

  // Culling
  cullDistance: 18,

  // Minimap
  mapWidth: 120,
  mapDotSize: 2,

  // Fog
  fogNear: 26,
  fogFar: 140,

  // Animation
  enterStartOpacity: 0.0,
  enterStartZ: -40,
  exitEndZ: 20,
  transitionZDamp: 0.18,
  enterOpacityDamp: 0.5,
  exitOpacityDamp: 0.15,
  enterStaggerDelay: 600,
  exitStaggerDelay: 300,
  cleanupTimeout: 700,
  exitSpreadY: 0.5,
  enterSpreadY: 1.5,
  transitionYDamp: 0.06,
  filterOpacityDamp: 0.06,
  filterScaleTarget: 0.5,

  // Luxe Background
  bgColor: "#0a0a1a",
  bgOpacity: 0.6,
  bgSpeed: 0.03,
  bgScale: 2.5,
  bgLineThickness: 0.02,
};

// Create a ref to hold the current config so it can be updated
export let CONFIG = { ...DEFAULT_CONFIG };

// Initialize CONFIG with defaults
Object.assign(CONFIG, DEFAULT_CONFIG);
