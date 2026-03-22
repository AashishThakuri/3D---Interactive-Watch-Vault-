import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { CONFIG } from "./gridConfig";
import { EMPTY_COLORS, matchesFilter, calculateGridDimensions } from "./gridState";
import { WatchTile } from "./WatchTile";


// Renders a single set of items with Time-Sliced mounting

// Helper to generate a circular packed grid centered at 0,0
function getCircularGridSlots(count) {
    if (count === 0) return [];
    let radius = 1;
    let allSlots = [];
    while (true) {
        allSlots = [];
        for (let row = -radius; row <= radius; row++) {
            for (let col = -radius; col <= radius; col++) {
                if (col*col + row*row <= radius*radius + 0.5) { // Add 0.5 for smoother circle edges
                    allSlots.push({ col, row });
                }
            }
        }
        if (allSlots.length >= count) break;
        radius++;
    }
    
    // Sort by distance from center to get the tightest circle
    allSlots.sort((a, b) => {
        const distA = a.col*a.col + a.row*a.row;
        const distB = b.col*b.col + b.row*b.row;
        if (distA !== distB) return distA - distB;
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
    });
    
    // Take exactly 'count' slots
    const finalSlots = allSlots.slice(0, count);
    
    // Resort them top-to-bottom, left-to-right for consistent reading order
    finalSlots.sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
    });
    
    return finalSlots;
}

export function GridCanvas({
    items,
    gridVisible,
    transitionStartTime,
    interactive,
    filter = "all",
    colorFilter = EMPTY_COLORS,
}) {
    // Calculate filtered items and their new positions
    const { mappedItems, filteredGridDims } = useMemo(() => {
        const spacingX = CONFIG.itemWidth + CONFIG.gap;
        const spacingY = CONFIG.itemSize + CONFIG.gap;
        const filteredItems = items.filter((item) =>
            matchesFilter(item, filter, colorFilter)
        );
        const filteredCount = filteredItems.length;
        const filteredDims = calculateGridDimensions(filteredCount);
        const filteredSlots = getCircularGridSlots(filteredCount);
        const originalSlots = getCircularGridSlots(items.length);
        
        const maxDelay = gridVisible
            ? CONFIG.enterStaggerDelay
            : CONFIG.exitStaggerDelay;
        let filteredIdx = 0;
        const mapped = items.map((watch, i) => {
            const matches = matchesFilter(watch, filter, colorFilter);
            let targetPos;
            if (matches) {
                const slot = filteredSlots[filteredIdx];
                targetPos = {
                    x: slot.col * spacingX,
                    y: -(slot.row * spacingY),
                };
                filteredIdx++;
            } else {
                const slot = originalSlots[i];
                targetPos = {
                    x: slot.col * spacingX,
                    y: -(slot.row * spacingY),
                };
            }
            return {
                ...watch,
                index: i,
                randomDelay: Math.random() * maxDelay,
                basePos: targetPos,
                matchesFilter: matches,
            };
        });
        return {
            mappedItems: mapped,
            filteredGridDims: filteredDims,
        };
    }, [items, filter, colorFilter, gridVisible]);
    // Time-sliced mounting
    const [mountedCount, setMountedCount] = useState(
        gridVisible ? 0 : items.length
    );
    useFrame(() => {
        if (mountedCount < mappedItems.length) {
            setMountedCount((prev) =>
                Math.min(prev + 5, mappedItems.length)
            );
        }
    });
    return (
        <>
            {mappedItems.map((item, i) => {
                // Only render if within the mounted count
                if (i > mountedCount) return null;
                return (
                    <WatchTile
                        key={item.index}
                        data={item}
                        index={item.index}
                        basePos={item.basePos}
                        gridVisible={gridVisible}
                        transitionStartTime={transitionStartTime}
                        interactive={interactive && item.matchesFilter}
                        matchesFilter={item.matchesFilter}
                        gridHeight={filteredGridDims.height}
                    />
                );
            })}
        </>
    );
}
