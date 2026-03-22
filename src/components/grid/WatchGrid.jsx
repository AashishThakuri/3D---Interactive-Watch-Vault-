import React, {
    useMemo,
    useState,
    useEffect,
    Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Leva } from "leva";
import watches from "../../../backend/watches.json";
import MiniMap from "../MiniMap";
import { DEFAULT_CONFIG, CONFIG } from "./gridConfig";
import { rigState, calculateGridDimensions, EMPTY_COLORS, matchesFilter } from "./gridState";
import { useGridConfig } from "./useGridConfig";
import { Rig } from "./Rig";
import { GridCanvas } from "./GridCanvas";
import { UnifiedControlBar } from "../GridUI";
import Header from "../Header";
import { AnimatedBackground } from "../AnimatedBackground";
import "../HoloCardMaterial"; // Registers <holoCardMaterial /> with R3F

// Preload textures
watches.forEach((watch) => {
    useTexture.preload(watch.image_url);
});


export default function WatchGrid() {
    const [zoomTarget, setZoomTarget] = useState(null);
    const [initialZoom] = useState(DEFAULT_CONFIG.zoomOut);
    const [currentZoom, setCurrentZoom] = useState(
        rigState.zoom
    );
    const controls = useGridConfig();
    // Track zoom state for UI components
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentZoom(rigState.zoom);
        }, 50); // Update every 50ms
        return () => clearInterval(interval);
    }, []);
    // Track active selection state
    const [hasActiveSelection, setHasActiveSelection] =
        useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setHasActiveSelection(rigState.activeId !== null);
        }, 16); // Update every frame (60fps) for smoother updates
        return () => clearInterval(interval);
    }, []);
    const isZoomedIn = currentZoom <= CONFIG.zoomIn + 0.5;

    // Responsive zoom for mobile viewports
    useEffect(() => {
        const updateResponsiveZoom = () => {
            const width = window.innerWidth;
            let newZoomOut;
            if (width < 480) {
                newZoomOut = 58; // Phone
            } else if (width < 768) {
                newZoomOut = 48; // Tablet portrait
            } else {
                newZoomOut = DEFAULT_CONFIG.zoomOut; // Desktop default (38)
            }
            CONFIG.zoomOut = newZoomOut;
            // Only update current zoom if we're in zoomed-out state
            if (rigState.zoom > CONFIG.zoomIn + 2) {
                rigState.zoom = newZoomOut;
                setCurrentZoom(newZoomOut);
            }
        };
        updateResponsiveZoom();
        window.addEventListener("resize", updateResponsiveZoom);
        return () => window.removeEventListener("resize", updateResponsiveZoom);
    }, []);

    // Filter state for brand filtering (works on all collections)
    const [brandFilter, setBrandFilter] = useState("all");
    const [colorFilter, setColorFilter] = useState(EMPTY_COLORS);

    // Collections - All, Luxury, Sport, Under $500
    const collectionsData = useMemo(() => {
        // All watches
        const all = watches;

        // Luxury brands
        const luxuryBrands = ["Rolex", "Omega", "Patek Philippe", "Audemars Piguet", "Cartier", "Vacheron Constantin", "Piaget", "Chanel", "Longines"];
        const luxury = watches.filter((w) => luxuryBrands.includes(w.brand));

        // Sport brands
        const sportBrands = ["TAG Heuer", "Tudor", "Casio", "Seiko", "Zenith", "Tissot", "Timex"];
        const sportTypes = ["Sport", "Diver", "Chronograph", "Pilot", "Field"];
        const sport = watches.filter((w) =>
            sportBrands.includes(w.brand) || sportTypes.includes(w.type)
        );

        // Under $500 (all brands)
        const budget = watches.filter((w) => {
            const price = parseInt(
                w.price?.replace(/[$,]/g, "") || "99999"
            );
            return price < 500;
        });

        return [all, luxury, sport, budget];
    }, []);

    // Grid layers
    const [gridLayers, setGridLayers] = useState(() => [
        {
            id: "init",
            items: watches,
            mode: "enter",
            // Far future = watches stay at enterStartZ/opacity=0 until preloader finishes
            startTime: Date.now() + 999999,
        },
    ]);

    // Trigger entrance animation AFTER preloader finishes
    useEffect(() => {
        const checkPreloader = setInterval(() => {
            const preloader = document.getElementById('preloader');
            if (!preloader) {
                clearInterval(checkPreloader);
                // Preloader gone — NOW trigger the entrance (same as collection switch)
                setGridLayers((prev) => prev.map((layer) =>
                    layer.id === 'init'
                        ? { ...layer, startTime: Date.now() }
                        : layer
                ));
            }
        }, 50);
        return () => clearInterval(checkPreloader);
    }, []);

    const [activeCollectionIdx, setActiveCollectionIdx] =
        useState(0);
    const handleCollectionSwitch = (index) => {
        if (index === activeCollectionIdx) return;
        const now = Date.now();
        setGridLayers((prev) => {
            // 1. Mark existing 'enter' layers as 'exit'
            const exitingLayers = prev.map((layer) =>
                layer.mode === "enter"
                    ? { ...layer, mode: "exit", startTime: now }
                    : layer
            );
            // 2. Add new 'enter' layer
            const newLayer = {
                id: `grid-${index}-${now}`,
                items: collectionsData[index],
                mode: "enter",
                startTime: now,
            };
            return [...exitingLayers, newLayer];
        });
        setActiveCollectionIdx(index);
        // Clear brand filters when leaving Luxury collection
        setBrandFilter("all");
        setColorFilter(EMPTY_COLORS);
        rigState.target.set(0, 2, 0);
        rigState.activeId = null;
        // 3. Cleanup old layers after transition time
        setTimeout(() => {
            setGridLayers((prev) =>
                prev.filter((layer) => layer.mode === "enter")
            );
        }, CONFIG.cleanupTimeout);
    };

    // Handle filter change (for Luxury collection) - just update filter state
    const handleFilterChange = (filter) => {
        if (filter === brandFilter) return;
        setBrandFilter(filter);
        rigState.activeId = null;
    };

    // Handle color filter change (accepts array of colors)
    const handleColorFilterChange = (colors) => {
        setColorFilter(colors.length > 0 ? colors : EMPTY_COLORS);
        rigState.activeId = null;
    };

    useEffect(() => {
        if (zoomTarget === "OUT") {
            rigState.zoom = CONFIG.zoomOut;
            setCurrentZoom(CONFIG.zoomOut);
            rigState.target.set(0, 2, 0);
        } else if (typeof zoomTarget === "number") {
            rigState.zoom = zoomTarget;
            setCurrentZoom(zoomTarget);
        }
        setZoomTarget(null);
    }, [zoomTarget]);

    // Determine active grid dimensions for the Rig
    const activeLayer = gridLayers[gridLayers.length - 1];

    // Calculate filtered item count
    const filteredItemCount = useMemo(() => {
        if (brandFilter === 'all' && colorFilter.length === 0)
            return activeLayer.items.length;
        return activeLayer.items.filter((item) =>
            matchesFilter(item, brandFilter, colorFilter)
        ).length;
    }, [activeLayer.items, brandFilter, colorFilter]);

    const activeDims = calculateGridDimensions(
        filteredItemCount
    );

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#000000",
                position: "relative",
                overflow: "hidden",
                touchAction: "none", // Prevent mobile browser touch gestures
            }}
        >
            <AnimatedBackground isZoomedIn={isZoomedIn} />
            <Leva collapsed={true} hidden={true} />
            <Header />
            <Canvas
                camera={{ position: [0, 0, initialZoom], fov: 45 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.NoToneMapping,
                }}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'auto' }}
            >
                {/* Rig is now shared, based on the dimensions of the active grid */}
                <Rig
                    gridW={activeDims.width}
                    gridH={activeDims.height}
                />
                <fog
                    attach="fog"
                    args={[
                        "#080810",
                        controls?.fogNear ?? DEFAULT_CONFIG.fogNear,
                        controls?.fogFar ?? DEFAULT_CONFIG.fogFar,
                    ]}
                />
                {/* Suspense boundary for texture loading */}
                <Suspense fallback={null}>
                    {/* Render all active layers (Entering + Exiting) */}
                    {gridLayers.map((layer, layerIdx) => (
                        <GridCanvas
                            key={layer.id}
                            items={layer.items}
                            gridVisible={layer.mode === "enter"}
                            transitionStartTime={layer.startTime}
                            interactive={layer.mode === "enter"}
                            filter={brandFilter}
                            colorFilter={colorFilter}
                        />
                    ))}
                </Suspense>
            </Canvas>
            <MiniMap
                gridDims={activeDims}
                rigState={rigState}
                config={CONFIG}
                totalItems={filteredItemCount}
                isZoomedIn={isZoomedIn}
            />
            <UnifiedControlBar
                currentCollection={activeCollectionIdx}
                onSwitch={handleCollectionSwitch}
                setZoomTrigger={setZoomTarget}
                isZoomedIn={isZoomedIn}
                hasActiveSelection={hasActiveSelection}
                brandFilter={brandFilter}
                onFilterChange={handleFilterChange}
                currentItems={activeLayer.items}
            />
        </div>
    );
}
