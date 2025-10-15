"use client"

import React, { useEffect, useState } from 'react';

const BackgroundGradient: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
          rgba(245, 158, 11, 0.03) 0%, 
          rgba(217, 119, 6, 0.02) 20%, 
          rgba(161, 98, 7, 0.015) 40%, 
          rgba(0, 0, 0, 0) 70%)`,
        transition: 'background 0.3s ease-out',
      }}
    />
  );
};

export default BackgroundGradient;