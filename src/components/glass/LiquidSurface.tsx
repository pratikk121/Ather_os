import React from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface LiquidSurfaceProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  material?: 'thin' | 'regular' | 'heavy' | 'frosted';
  chromaticAberration?: number;
  interactive?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const LiquidSurface: React.FC<LiquidSurfaceProps> = ({
  children,
  className = '',
  borderRadius = 16,
  material,
  chromaticAberration,
  interactive = false,
  style,
  onClick,
  onMouseDown,
}) => {
  const { settings, lightPosition } = useSettingsStore();
  const currentMaterial = material || settings.glassMaterial;
  const aberration = chromaticAberration ?? settings.chromaticAberration;

  // Compute dynamic highlight reflection angle from cursor/light position
  const angle = Math.atan2(lightPosition.y - 50, lightPosition.x - 50) * (180 / Math.PI) + 180;

  // Base blur and opacity mapping - Monochromatic Obsidian & Zinc
  const materialStyles = {
    thin: 'bg-zinc-950/40 backdrop-blur-md border-white/10',
    regular: 'bg-zinc-950/70 backdrop-blur-xl border-white/20',
    heavy: 'bg-black/85 backdrop-blur-2xl border-white/25',
    frosted: 'bg-zinc-900/60 backdrop-blur-3xl saturate-100 border-white/20',
  };

  const dynamicLightingStyle: React.CSSProperties = settings.dynamicLighting
    ? {
        boxShadow: `
          0 10px 30px -5px rgba(0, 0, 0, 0.6),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.35),
          0 0 1px 1px rgba(255, 255, 255, ${aberration * 0.4})
        `,
        backgroundImage: `linear-gradient(${angle}deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)`,
      }
    : {
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      };

  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={{
        borderRadius: `${borderRadius}px`,
        ...dynamicLightingStyle,
        ...style,
      }}
      className={`relative transition-all duration-200 border ${materialStyles[currentMaterial]} ${
        interactive ? 'hover:border-white/40 active:scale-[0.98]' : ''
      } ${className}`}
    >
      {/* Chromatic rim refraction edge simulation - Achromatic Silver/White Dispersion */}
      {aberration > 0 && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-25 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255, 255, 255, 0.25), rgba(160, 160, 175, 0.12), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
