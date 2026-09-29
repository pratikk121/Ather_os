import React, { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { WindowState } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { LiquidSurface } from '../glass/LiquidSurface';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize, activeWindowId } =
    useWindowStore();
  const { settings } = useSettingsStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const isFocused = activeWindowId === window.id;

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: window.size.width,
      h: window.size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const viewW = typeof globalThis.innerWidth !== 'undefined' ? globalThis.innerWidth : 1200;
      const viewH = typeof globalThis.innerHeight !== 'undefined' ? globalThis.innerHeight : 800;

      if (isDragging) {
        const maxX = Math.max(0, viewW - window.size.width);
        const maxY = Math.max(40, viewH - window.size.height - 70);
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, maxX));
        const newY = Math.max(40, Math.min(e.clientY - dragOffset.y, maxY));
        updatePosition(window.id, { x: newX, y: newY });
      } else if (isResizing) {
        const maxW = Math.max(320, viewW - window.position.x - 10);
        const maxH = Math.max(220, viewH - window.position.y - 70);
        const newW = Math.max(320, Math.min(resizeStart.w + (e.clientX - resizeStart.x), maxW));
        const newH = Math.max(220, Math.min(resizeStart.h + (e.clientY - resizeStart.y), maxH));
        updateSize(window.id, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, window.id, updatePosition, updateSize]);

  if (!window.isOpen || window.isMinimized) return null;

  const frameStyle: React.CSSProperties = window.isMaximized
    ? {
        position: 'fixed',
        left: 8,
        top: 48,
        width: 'calc(100vw - 16px)',
        height: 'calc(100vh - 120px)',
        zIndex: window.zIndex,
      }
    : {
        position: 'absolute',
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex,
      };

  return (
    <section
      role="region"
      aria-label={`${window.title} window`}
      style={frameStyle}
      onMouseDown={() => focusWindow(window.id)}
      className="flex flex-col transition-shadow duration-200"
    >
      <LiquidSurface
        material={isFocused ? settings.glassMaterial : 'heavy'}
        borderRadius={18}
        contentClassName="flex flex-col flex-1 overflow-hidden"
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${
          isFocused
            ? 'ring-1 ring-accent-primary/60 shadow-2xl border-accent-primary/40'
            : 'opacity-95 shadow-lg border-border-subtle'
        }`}
      >
        {/* Title Bar */}
        <header
          onMouseDown={handleMouseDownHeader}
          className="h-10 px-4 flex items-center justify-between border-b border-border-subtle select-none cursor-grab active:cursor-grabbing bg-surface-interactive/40"
        >
          {/* Liquid Jewel Window Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(window.id);
              }}
              aria-label={`Close ${window.title}`}
              className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-400 text-rose-950 flex items-center justify-center group focus-visible:ring-2 focus-visible:ring-rose-400 transition shadow-[0_0_6px_rgba(244,63,94,0.4)]"
              title="Close"
            >
              <X className="w-2.5 h-2.5 text-current opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(window.id);
              }}
              aria-label={`Minimize ${window.title}`}
              className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-500 border border-amber-400 text-amber-950 flex items-center justify-center group focus-visible:ring-2 focus-visible:ring-amber-400 transition shadow-[0_0_6px_rgba(245,158,11,0.4)]"
              title="Minimize"
            >
              <Minus className="w-2.5 h-2.5 text-current opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(window.id);
              }}
              aria-label={`Maximize ${window.title}`}
              className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400 text-emerald-950 flex items-center justify-center group focus-visible:ring-2 focus-visible:ring-emerald-400 transition shadow-[0_0_6px_rgba(16,185,129,0.4)]"
              title="Maximize"
            >
              <Square className="w-2 h-2 text-current opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Window Title */}
          <h2 className="text-xs font-bold text-content-primary tracking-wide">
            {window.title}
          </h2>

          <div className="w-12" aria-hidden="true" />
        </header>

        {/* Content Area with Error Boundary Protection */}
        <div className="flex-1 overflow-auto p-4">
          <ErrorBoundary fallbackTitle={`${window.title} Error`}>
            {children}
          </ErrorBoundary>
        </div>

        {/* Resize Grip Handle */}
        {!window.isMaximized && (
          <div
            onMouseDown={handleMouseDownResize}
            role="separator"
            aria-label="Resize window handle"
            tabIndex={-1}
            className="absolute bottom-1 right-1 w-5 h-5 cursor-nwse-resize opacity-50 hover:opacity-100 flex items-end justify-end p-1"
          >
            <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-content-muted rounded-br-sm" />
          </div>
        )}
      </LiquidSurface>
    </section>
  );
};
