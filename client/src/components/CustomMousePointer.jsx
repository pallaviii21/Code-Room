import React, { useEffect, useRef } from 'react';

/**
 * CustomMousePointer:
 * High-performance, minimalist custom floating pointer attached directly to the user's actual mouse cursor.
 * Clean cursor tip with smooth trailing glowing halo and interactive click ripples. No text overlay.
 */
export const CustomMousePointer = () => {
  const pointerRef = useRef(null);
  const haloRef = useRef(null);
  const containerRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const pointerPos = useRef({ x: -100, y: -100 });
  const haloPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (containerRef.current) {
          containerRef.current.style.opacity = '1';
        }
      }

      // Check if hovering over interactive elements
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          window.getComputedStyle(target).cursor === 'pointer')
      ) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          if (haloRef.current) {
            haloRef.current.style.width = '44px';
            haloRef.current.style.height = '44px';
            haloRef.current.style.borderColor = 'rgba(96, 165, 250, 0.8)';
            haloRef.current.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
            haloRef.current.style.boxShadow = '0 0 24px rgba(59, 130, 246, 0.5)';
          }
          if (pointerRef.current) {
            pointerRef.current.style.transform = 'scale(1.15)';
          }
        }
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          if (haloRef.current) {
            haloRef.current.style.width = '24px';
            haloRef.current.style.height = '24px';
            haloRef.current.style.borderColor = 'rgba(56, 189, 248, 0.5)';
            haloRef.current.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
            haloRef.current.style.boxShadow = 'none';
          }
          if (pointerRef.current) {
            pointerRef.current.style.transform = 'scale(1)';
          }
        }
      }
    };

    const handleMouseDown = (e) => {
      // Spawn ripple effect directly into DOM
      const ripple = document.createElement('div');
      ripple.className = 'fixed pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 bg-blue-500/30 animate-ping';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = '36px';
      ripple.style.height = '36px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      if (pointerRef.current) {
        pointerRef.current.style.transform = 'scale(0.85)';
      }
    };

    const handleMouseUp = () => {
      if (pointerRef.current) {
        pointerRef.current.style.transform = isHoveredRef.current ? 'scale(1.15)' : 'scale(1)';
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
    };

    // Smooth lerp frame loop
    const animate = () => {
      pointerPos.current.x += (mousePos.current.x - pointerPos.current.x) * 0.9;
      pointerPos.current.y += (mousePos.current.y - pointerPos.current.y) * 0.9;

      haloPos.current.x += (mousePos.current.x - haloPos.current.x) * 0.22;
      haloPos.current.y += (mousePos.current.y - haloPos.current.y) * 0.22;

      if (pointerRef.current) {
        pointerRef.current.style.left = `${pointerPos.current.x}px`;
        pointerRef.current.style.top = `${pointerPos.current.y}px`;
      }

      if (haloRef.current) {
        haloRef.current.style.left = `${haloPos.current.x}px`;
        haloRef.current.style.top = `${haloPos.current.y}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="opacity-0 transition-opacity duration-300 pointer-events-none">
      {/* Smooth Trailing Glow Halo Aura */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/50 bg-sky-400/10 transition-all duration-200 ease-out"
        style={{ width: '24px', height: '24px' }}
      />

      {/* Main Pointer Arrow */}
      <div
        ref={pointerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-0 -translate-y-0 transition-transform duration-100 ease-out select-none"
      >
        <svg
          className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(59,130,246,0.6)] transform -rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default CustomMousePointer;
