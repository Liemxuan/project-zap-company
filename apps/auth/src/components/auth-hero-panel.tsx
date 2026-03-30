"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

/**
 * AuthHeroPanel — Left branding panel with parallax mouse-tracking,
 * floating particle effects, and a generated hero image.
 */
export function AuthHeroPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  // Parallax offsets based on mouse position (centered at 0)
  const offsetX = (mousePos.x - 0.5) * 30;
  const offsetY = (mousePos.y - 0.5) * 30;
  const rotateX = (mousePos.y - 0.5) * -8;
  const rotateY = (mousePos.x - 0.5) * 8;

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex flex-col flex-1 border-r border-outline-variant relative overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      style={{ background: "linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #111108 100%)" }}
    >
      {/* Animated gradient orb following cursor */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(128,138,80,0.15) 0%, rgba(128,138,80,0.05) 40%, transparent 70%)",
          filter: "blur(40px)",
          opacity: isHovering ? 1 : 0.3,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              left: `${10 + (i * 4.3) % 80}%`,
              top: `${5 + (i * 7.1) % 85}%`,
              background: i % 3 === 0
                ? "rgba(128,138,80,0.6)"
                : i % 3 === 1
                  ? "rgba(128,138,80,0.3)"
                  : "rgba(255,255,255,0.15)",
              transform: `translate(${offsetX * (0.3 + (i % 5) * 0.15)}px, ${offsetY * (0.3 + (i % 5) * 0.15)}px)`,
              transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              animation: `float-particle ${3 + (i % 4)}s ease-in-out ${(i % 6) * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(128,138,80,0.5) 2px, rgba(128,138,80,0.5) 3px)",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        {/* Logo */}
        <div
          className="transition-transform duration-500 ease-out"
          style={{ transform: `translate(${offsetX * 0.1}px, ${offsetY * 0.1}px)` }}
        >
          <Image src="/zap-logo.png" alt="ZAP" width={48} height={48} className="w-12 h-12 object-contain brightness-0 invert opacity-90" />
        </div>

        {/* Hero Image with parallax */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div
            className="relative w-full max-w-[320px] aspect-square transition-all duration-700 ease-out"
            style={{
              transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Glow behind image */}
            <div
              className="absolute inset-0 rounded-3xl transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle, rgba(128,138,80,0.25) 0%, transparent 70%)",
                transform: "translateZ(-20px) scale(1.2)",
                filter: "blur(30px)",
                opacity: isHovering ? 1 : 0.5,
              }}
            />
            <Image
              src="/auth-hero.png"
              alt="Olympus Security"
              width={640}
              height={640}
              className="w-full h-full object-contain rounded-2xl relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Text with subtle parallax */}
        <div
          className="space-y-4 max-w-md transition-transform duration-500 ease-out"
          style={{ transform: `translate(${offsetX * 0.15}px, ${offsetY * 0.15}px)` }}
        >
          <Heading level={2} className="text-white/90">
            Secure access to<br />
            <span className="text-[#808a50]">Olympus Infrastructure.</span>
          </Heading>
          <Text size="body-main" className="text-white/50">
            Centralized authentication across all agent operations, point of sale terminals, and metric dashboards.
          </Text>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-particle {
          0% { transform: translate(${offsetX * 0.3}px, ${offsetY * 0.3}px) translateY(0px); opacity: 0.3; }
          100% { transform: translate(${offsetX * 0.3}px, ${offsetY * 0.3}px) translateY(-12px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
