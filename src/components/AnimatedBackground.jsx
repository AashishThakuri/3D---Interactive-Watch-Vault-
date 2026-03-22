import React from 'react';

// Animated background with floating watch image
export const AnimatedBackground = ({ isZoomedIn }) => {
    return (
        <>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: isZoomedIn ? 0.3 : 1,
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: 'none',
                overflow: 'hidden',
                background: '#000',
            }}>
                {/* Background image with CSS animation */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-5%',
                        left: '-5%',
                        width: '110%',
                        height: '110%',
                        backgroundImage: 'url(/bg-watch.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.4,
                        filter: 'sepia(0.2) hue-rotate(-10deg) saturate(1.2)',
                        animation: 'bgFloat 40s ease-in-out infinite',
                    }}
                />
                {/* Vignette overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
                    }}
                />
            </div>
            <style>{`
                @keyframes bgFloat {
                    0% {
                        transform: scale(1) translate(0, 0);
                        opacity: 0.35;
                    }
                    25% {
                        transform: scale(1.03) translate(-8px, -4px);
                        opacity: 0.42;
                    }
                    50% {
                        transform: scale(1.05) translate(-12px, -6px);
                        opacity: 0.4;
                    }
                    75% {
                        transform: scale(1.03) translate(-4px, -2px);
                        opacity: 0.38;
                    }
                    100% {
                        transform: scale(1) translate(0, 0);
                        opacity: 0.35;
                    }
                }
            `}</style>
        </>
    );
};
