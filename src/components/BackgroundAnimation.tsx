
import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -inset-[10px] opacity-30">
        {/* Animated bubbles */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div 
            key={index}
            className="bubble"
            style={{
              '--size': `${Math.random() * 8 + 2}rem`,
              '--speed': `${Math.random() * 30 + 10}s`,
              '--left': `${Math.random() * 100}%`,
              '--hue': `${Math.random() * 60 + 220}`,
              animationDelay: `${Math.random() * 30}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Light streaks */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={`streak-${index}`}
            className="light-streak"
            style={{
              '--angle': `${Math.random() * 360}deg`,
              '--speed': `${Math.random() * 20 + 20}s`,
              '--size': `${Math.random() * 300 + 100}px`,
              '--opacity': `${Math.random() * 0.3 + 0.05}`,
              '--hue': `${Math.random() * 60 + 220}`,
              animationDelay: `${Math.random() * 10}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundAnimation;
