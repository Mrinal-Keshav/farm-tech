import React, { useEffect, useRef, useState } from 'react';

/**
 * TractorRun_polished.tsx
 * Merges the stable logic from the fixed canvas implementation with the
 * emoji-based visuals from the original TractorRun. Drop-in React + TypeScript.
 */

type Entity = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  type: 'obstacle' | 'crop' | 'powerup';
  emoji: string;
  lifetime?: number;
};

interface Props {
  onClose: () => void;
  onScoreUpdate?: (s: number) => void;
}

const TractorRun: React.FC<Props> = ({ onClose, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTs = useRef<number>(0);
  const entities = useRef<Entity[]>([]);
  const nextId = useRef<number>(1);
  const keys = useRef<Record<string, boolean>>({});

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // player
  const player = useRef({ x: 60, y: 160, w: 48, h: 32, speed: 260, emoji: '🚜' });

  // config
  const spawnInterval = useRef(900); // ms
  const lastSpawn = useRef(0);

  // helpers to choose emoji visuals
  const cropEmojis = ['🌾', '🌽', '🥔', '🥕', '🍅'];
  const obstacleEmojis = ['🪨', '🌳', '🔥', '🧱'];
  const powerupEmoji = '💚';

  function randFrom<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

  function spawnObstacle(width: number, height: number, canvasW: number, canvasH: number) {
    const y = Math.random() * (canvasH - height);
    entities.current.push({
      id: nextId.current++,
      x: canvasW + 20,
      y,
      w: width,
      h: height,
      vx: -160 - Math.random() * 120,
      vy: 0,
      type: 'obstacle',
      emoji: randFrom(obstacleEmojis),
    });
  }
  function spawnCrop(canvasW: number, canvasH: number) {
    const size = 36;
    const y = Math.random() * (canvasH - size);
    entities.current.push({
      id: nextId.current++,
      x: canvasW + 20,
      y,
      w: size,
      h: size,
      vx: -160 - Math.random() * 60,
      vy: 0,
      type: 'crop',
      emoji: randFrom(cropEmojis),
    });
  }
  function spawnPowerup(canvasW: number, canvasH: number) {
    const size = 36;
    const y = Math.random() * (canvasH - size);
    entities.current.push({
      id: nextId.current++,
      x: canvasW + 20,
      y,
      w: size,
      h: size,
      vx: -200 - Math.random() * 40,
      vy: 0,
      type: 'powerup',
      emoji: powerupEmoji,
      lifetime: 6000,
    });
  }

  // collision detection AABB
  function collide(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // input handlers
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Prevent scrolling for game keys
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)
      ) {
        e.preventDefault();
      }
      if (e.code === 'Escape') {
        if (!paused) setPaused(true);
        else onClose();
      }
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [paused, onClose]);

  // main loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * DPR);
      canvas.height = Math.floor(rect.height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    function step(ts: number) {
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(40, ts - lastTs.current);
      lastTs.current = ts;

      if (!paused && !gameOver) {
        update(dt / 1000);
        render();
      } else {
        render();
      }
      animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };

    function update(delta: number) {
      const cw = canvas.width / DPR;
      const ch = canvas.height / DPR;

      // player movement
      const p = player.current;
      let dx = 0, dy = 0;
      if (keys.current['ArrowUp'] || keys.current['KeyW']) dy -= 1;
      if (keys.current['ArrowDown'] || keys.current['KeyS']) dy += 1;
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) dx -= 1;
      if (keys.current['ArrowRight'] || keys.current['KeyD']) dx += 1;
      const len = Math.hypot(dx, dy) || 1;
      p.x = Math.max(8, Math.min(cw - p.w - 8, p.x + (dx / len) * p.speed * delta));
      p.y = Math.max(8, Math.min(ch - p.h - 8, p.y + (dy / len) * p.speed * delta));

      // spawn logic
      lastSpawn.current += delta * 1000;
      if (lastSpawn.current > spawnInterval.current) {
        lastSpawn.current = 0;
        const r = Math.random();
        if (r < 0.12) spawnPowerup(cw, ch);
        else if (r < 0.55) spawnCrop(cw, ch);
        else spawnObstacle(48 + Math.random() * 40, 36 + Math.random() * 24, cw, ch);
      }

      // update entities
      const list = entities.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        e.x += e.vx * delta;
        e.y += e.vy * delta;
        if (e.lifetime !== undefined) {
          e.lifetime -= delta * 1000;
          if (e.lifetime <= 0) list.splice(i, 1);
        }
        if (e.x + e.w < -40) list.splice(i, 1);
      }

      // collisions
      const pBox = { x: p.x, y: p.y, w: p.w, h: p.h };
      for (let i = entities.current.length - 1; i >= 0; i--) {
        const e = entities.current[i];
        if (collide(pBox, e)) {
          if (e.type === 'crop') {
            setScore(s => { const ns = s + 10; if (onScoreUpdate) onScoreUpdate(ns); return ns; });
            entities.current.splice(i, 1);
          } else if (e.type === 'powerup') {
            setLives(l => Math.min(5, l + 1));
            entities.current.splice(i, 1);
          } else if (e.type === 'obstacle') {
            entities.current.splice(i, 1);
            setLives(l => { const nl = l - 1; if (nl <= 0) setGameOver(true); return nl; });
          }
        }
      }
    }

    function render() {
      const cw = canvas.width / DPR;
      const ch = canvas.height / DPR;
      // Clear + background (field green)
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = '#9bdb4d';
      ctx.fillRect(0, 0, cw, ch);

      // draw stylized rows for depth
      ctx.strokeStyle = '#85c73c';
      ctx.lineWidth = 2;
      for (let y = 0; y < ch; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y + (Math.sin((Date.now() / 600) + y) * 6));
        ctx.stroke();
      }

      // ground striping at bottom for motion
      ctx.fillStyle = '#d0e9b8';
      for (let i = 0; i < 6; i++) {
        const stripeW = cw * 0.12;
        const x = ((Date.now() / 100) + i * 140) % (cw + stripeW) - stripeW;
        ctx.fillRect(x, ch - 70, stripeW, 70);
      }

      // set emoji font
      const emojiSize = Math.max(20, Math.min(44, Math.floor(ch * 0.06)));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${emojiSize}px system-ui, -apple-system, 'Segoe UI Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', 'Segoe UI Symbol'`;

      // draw player as emoji
      const p = player.current;
      ctx.save();
      // small shadow under tractor
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.ellipse(p.x + p.w/2, p.y + p.h + 6, p.w/2 + 6, 8, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = `${emojiSize+6}px system-ui, 'Segoe UI Emoji'`;
      ctx.fillText(p.emoji, p.x + p.w/2, p.y + p.h/2);
      ctx.restore();

      // draw entities using their emojis
      for (const e of entities.current) {
        // slight bobbing animation
        const bob = Math.sin((Date.now() + e.id * 100) / 300) * 4;
        ctx.font = `${Math.floor(Math.min(e.w, e.h) * 0.9)}px system-ui, 'Segoe UI Emoji'`;
        ctx.fillText(e.emoji, e.x + e.w/2, e.y + e.h/2 + bob);
      }

      // UI: score + lives + instructions
      ctx.fillStyle = '#0f172a';
      ctx.font = '16px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 12, 22);

      // draw lives as hearts at top-right
      ctx.textAlign = 'center';
      for (let i = 0; i < lives; i++) {
        ctx.font = '20px system-ui, "Segoe UI Emoji"';
        ctx.fillText('❤️', cw - 20 - i * 28, 22);
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px system-ui';
      ctx.fillText(`Press ESC to pause / exit`, 12, ch - 12);

      // paused / game over overlay
      if (paused) {
        ctx.fillStyle = 'rgba(2,6,23,0.6)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#fff';
        ctx.font = '24px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED — press ESC to exit', cw / 2, ch / 2);
      }
      if (gameOver) {
        ctx.fillStyle = 'rgba(2,6,23,0.75)';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#fff';
        ctx.font = '28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', cw / 2, ch / 2 - 12);
        ctx.font = '18px system-ui';
        ctx.fillText(`Final score: ${score}`, cw / 2, ch / 2 + 20);
      }
    }
  }, [paused, gameOver, score, lives, onScoreUpdate, onClose]);

  // controls for resume / restart
  function handleResume() {
    if (gameOver) {
      entities.current = [];
      nextId.current = 1;
      setScore(0);
      setLives(3);
      player.current.x = 60;
      player.current.y = 160;
      setGameOver(false);
    }
    setPaused(false);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div style={{ width: 820, maxWidth: '100%' }} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold">Tractor Run</div>
            <div className="text-sm text-gray-600">Score: {score} — Lives: {lives}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm rounded bg-red-500 text-white" onClick={() => onClose()}>Close</button>
            <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white" onClick={() => setPaused(true)}>Pause</button>
            <button className="px-3 py-1 text-sm rounded bg-green-500 text-white" onClick={handleResume}>Resume/Restart</button>
          </div>
        </div>
        <div style={{ width: '100%', height: 380 }} className="p-3">
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', borderRadius: 8, display: 'block' }} />
        </div>
        <div className="px-4 py-2 text-sm text-gray-600">
          Controls: Arrow keys or WASD. Collect crops (+10), green powerups (+1 life), avoid obstacles (-1 life).
        </div>
      </div>
    </div>
  );
};

export default TractorRun;
