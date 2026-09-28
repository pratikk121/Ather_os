import React from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface LiquidSurfaceProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
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
  contentClassName = '',
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

  // Semantic Material Classes deriving from CSS Variables
  const materialClasses = {
    thin: 'backdrop-blur-md border border-border-subtle bg-surface-primary/50 shadow-lg',
    regular: 'backdrop-blur-xl border border-border-default bg-surface-primary/80 shadow-xl',
    heavy: 'backdrop-blur-2xl border border-border-strong bg-surface-elevated/95 shadow-2xl',
    frosted: 'backdrop-blur-3xl saturate-150 border border-border-default bg-surface-primary/85 shadow-2xl',
  };

  const dynamicLightingStyle: React.CSSProperties = settings.dynamicLighting
    ? {
        boxShadow: `
          0 10px 30px -5px var(--aether-glass-shadow),
          inset 0 1px 1.5px 0 var(--aether-glass-highlight),
          0 0 1px 1px var(--aether-border-subtle)
        `,
        backgroundImage: `linear-gradient(${angle}deg, var(--aether-border-subtle) 0%, transparent 100%)`,
      }
    : {
        boxShadow: '0 10px 30px -5px var(--aether-glass-shadow), inset 0 1px 1px 0 var(--aether-glass-highlight)',
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
      className={`relative transition-all duration-200 ${materialClasses[currentMaterial] || materialClasses.regular} ${
        interactive ? 'hover:border-accent-primary/60 active:scale-[0.98]' : ''
      } ${className}`}
    >
      {/* Chromatic rim refraction edge simulation with theme-derived rim tint */}
      {aberration > 0 && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-35 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, var(--aether-rim-tint), var(--aether-accent-soft), transparent 70%)`,
          }}
        />
      )}
      <div className={`relative z-10 w-full h-full ${contentClassName}`}>{children}</div>
    </div>
  );
};
