import * as THREE from "three";
import { CONFIG } from "./gridConfig";


export const rigState = {
    target: new THREE.Vector3(0, 2, 0),
    current: new THREE.Vector3(0, 2, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    zoom: CONFIG.zoomOut,
    isDragging: false,
    activeId: null,
};


export const calculateGridDimensions = (count) => {
    if (count === 0) return { width: 0, height: 0 };
    // Estimate the radius of the circle needed to hold 'count' items
    // Math.PI * r^2 = count  =>  r = Math.sqrt(count / Math.PI)
    const radius = Math.ceil(Math.sqrt(count / Math.PI));
    const spacingX = CONFIG.itemWidth + CONFIG.gap;
    const spacingY = CONFIG.itemSize + CONFIG.gap;
    
    // The dimensions are the diameter (2 * radius) times the spacing
    // We add 1 to diameter to account for the center item itself
    return {
        width: (radius * 2 + 1) * spacingX,
        height: (radius * 2 + 1) * spacingY,
    };
};

// Stable empty array to avoid unnecessary re-renders
export const EMPTY_COLORS = [];


export const matchesFilter = (item, filter, colorFilter = EMPTY_COLORS) => {
    // Check type filter (brand-based for watches)
    let matchesType = true;
    if (filter !== "all") {
        const brand = item.brand.toLowerCase();
        matchesType = brand === filter.toLowerCase();
    }

    // Check color filter (array - OR logic across colors)
    let matchesColor = true;
    if (colorFilter.length > 0) {
        const watchColor = item.primary_color || "";
        matchesColor = colorFilter.some((c) => {
            // Match gray variants (gray, dark_gray, light_gray) when "gray" is selected
            if (c === "gray") return watchColor.includes("gray");
            return watchColor === c;
        });
    }

    return matchesType && matchesColor;
};
