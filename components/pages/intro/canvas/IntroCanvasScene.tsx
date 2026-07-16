'use client';

import { useEffect, useRef } from 'react';
import { createIntroScene } from './createIntroScene';
import type { ElapsedRef } from '../types';

interface IntroCanvasSceneProps {
  /** Created and mutated by IntroExperience's skip control — set to
   *  TIMELINE.total to fast-forward the scene to its settled end state. */
  skipOffsetRef: ElapsedRef;
}

// Deliberately raw Three.js rather than @react-three/fiber: with this
// project's exact TypeScript/React 19 type versions, merging fiber's
// JSX.IntrinsicElements augmentation into the program (however it's scoped)
// breaks unrelated React.ElementType-typed components elsewhere in the app
// (confirmed by bisection — see git history / PR description). Plain
// `three` has no such global side effect, still satisfies "Three.js if it
// improves quality" from the brief, and avoids the extra dependency
// entirely. See createIntroScene.ts for the actual scene.
export function IntroCanvasScene({ skipOffsetRef }: IntroCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = createIntroScene(canvas);
    const container = canvas.parentElement;

    const resize = () => {
      const width = container?.clientWidth ?? window.innerWidth;
      const height = container?.clientHeight ?? window.innerHeight;
      scene.resize(width, height);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (container) resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const start = performance.now();
    let frameId: number;

    const tick = () => {
      const elapsedMs = performance.now() - start + skipOffsetRef.current;
      scene.render(elapsedMs, pointerRef.current.x, pointerRef.current.y);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      scene.dispose();
    };
  }, [skipOffsetRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
