'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function makeParticlePoints(count: number, spread: [number, number, number], color: string, size: number, opacity: number) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * spread[0];
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity, sizeAttenuation: true, depthWrite: false });
  return new THREE.Points(geo, mat);
}

export function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 10;

    // Particles
    const cyan   = makeParticlePoints(200, [22, 13, 7], '#00d4ff', 0.055, 0.45);
    const purple = makeParticlePoints(50,  [18, 10, 5], '#7c3aed', 0.10,  0.28);
    scene.add(cyan, purple);

    // Resize handler
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    // Animation loop
    const clock = new THREE.Clock();
    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      cyan.rotation.y = t * 0.013;
      cyan.rotation.x = Math.sin(t * 0.007) * 0.03;
      purple.rotation.y = -t * 0.009;
      purple.rotation.z = Math.cos(t * 0.005) * 0.025;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      cyan.geometry.dispose();
      (cyan.material as THREE.Material).dispose();
      purple.geometry.dispose();
      (purple.material as THREE.Material).dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
