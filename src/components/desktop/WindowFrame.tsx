import React, { useState, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { WindowState } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { LiquidSurface } from '../glass/LiquidSurface';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize, activeWindowId } =
    useWindowStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const isFocused = activeWindowId === window.id;

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    focusWindow(window.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusWindow(window.id);
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
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.innerWidth - 100));
        const newY = Math.max(40, Math.min(e.clientY - dragOffset.y, globalThis.innerHeight - 100));
        updatePosition(window.id, { x: newX, y: newY });
      } else if (isResizing) {
        const newW = Math.max(300, resizeStart.w + (e.clientX - resizeStart.x));
        const newH = Math.max(200, resizeStart.h + (e.clientY - resizeStart.y));
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
    <div
      style={frameStyle}
      onMouseDown={() => focusWindow(window.id)}
      className="flex flex-col transition-shadow duration-200"
    >
      <LiquidSurface
        material={isFocused ? 'regular' : 'frosted'}
        borderRadius={18}
        className={`flex-1 flex flex-col overflow-hidden ${
          isFocused ? 'ring-1 ring-cyan-500/30' : 'opacity-95'
        }`}
      >
        {/* Title Bar */}
        <div
          onMouseDown={handleMouseDownHeader}
          className="h-10 px-4 flex items-center justify-between border-b border-white/10 select-none cursor-grab active:cursor-grabbing bg-white/[0.03]"
        >
          {/* Window Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(window.id);
              }}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 flex items-center justify-center group"
              title="Close"
            >
              <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(window.id);
              }}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center group"
              title="Minimize"
            >
              <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(window.id);
              }}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 flex items-center justify-center group"
              title="Maximize"
            >
              <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Window Title */}
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            {window.title}
          </span>

          <div className="w-12" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">{children}</div>

        {/* Resize Grip Handle */}
        {!window.isMaximized && (
          <div
            onMouseDown={handleMouseDownResize}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize opacity-40 hover:opacity-100 flex items-end justify-end p-0.5"
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-white/50 rounded-br-sm" />
          </div>
        )}
      </LiquidSurface>
    </div>
  );
};
