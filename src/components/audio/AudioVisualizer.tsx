import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../../services/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const data = audioEngine.getFrequencyData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / data.length) * 2;
      let x = 0;

      // Theme-responsive gradient reading from computed styles
      const computedStyle = getComputedStyle(canvas);
      const accentColor = computedStyle.getPropertyValue('--aether-accent-primary').trim() || '#ffffff';
      const accentSoft = computedStyle.getPropertyValue('--aether-accent-soft').trim() || 'rgba(255, 255, 255, 0.2)';

      for (let i = 0; i < data.length / 2; i++) {
        const barHeight = isPlaying ? (data[i] / 255) * canvas.height : 4;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, accentSoft);
        gradient.addColorStop(1, accentColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, Math.max(1, barWidth - 1), barHeight);

        x += barWidth;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={50}
      className={`rounded-lg overflow-hidden ${className}`}
    />
  );
};
