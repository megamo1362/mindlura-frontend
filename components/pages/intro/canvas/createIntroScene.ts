import * as THREE from 'three';
import {
  buildCandleData,
  buildCoreEdges,
  buildLooseEdges,
  candleColor,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  phaseProgress,
} from './sceneMath';
import { CORE_GRADIENT, TIMELINE } from '../constants';

export interface IntroSceneHandle {
  /** elapsedMs already includes any skip fast-forward offset. pointerX/Y are normalized -1..1. */
  render: (elapsedMs: number, pointerX: number, pointerY: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

function gradientColorAt(t: number): THREE.Color {
  const [c0, c1, c2] = CORE_GRADIENT;
  const col = new THREE.Color();
  if (t < 0.5) col.lerpColors(new THREE.Color(c0), new THREE.Color(c1), t * 2);
  else col.lerpColors(new THREE.Color(c1), new THREE.Color(c2), (t - 0.5) * 2);
  return col;
}

function createGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,212,255,0.85)');
    gradient.addColorStop(0.45, 'rgba(0,102,255,0.28)');
    gradient.addColorStop(1, 'rgba(0,102,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

// Imperative Three.js scene (deliberately not @react-three/fiber — see
// IntroCanvasScene.tsx's doc comment for why). Builds the Phase 1-3 field
// (candlesticks -> neural core -> disperse) and the Phase 3-4 logo reveal
// described in the intro brief, driven entirely by a single `render(elapsedMs)`
// call per frame so all timing lives in one place (constants.ts TIMELINE).
export function createIntroScene(canvas: HTMLCanvasElement): IntroSceneHandle {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  // ---- candlestick field (Phase 1-3) ----
  const data = buildCandleData();
  const coreEdges = buildCoreEdges(data, 2);
  const looseEdges = buildLooseEdges(14, data.length);

  const fieldGroup = new THREE.Group();
  scene.add(fieldGroup);

  const candleGeometry = new THREE.BoxGeometry(1, 1, 1);
  const candleMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, toneMapped: false });
  const candleMesh = new THREE.InstancedMesh(candleGeometry, candleMaterial, data.length);
  fieldGroup.add(candleMesh);

  const dummy = new THREE.Object3D();
  const instanceColor = new THREE.Color();
  data.forEach((d, i) => {
    instanceColor.set(candleColor(d.bullish));
    candleMesh.setColorAt(i, instanceColor);
  });
  if (candleMesh.instanceColor) candleMesh.instanceColor.needsUpdate = true;

  const posScratch = new Float32Array(data.length * 3);

  const coreLineGeometry = new THREE.BufferGeometry();
  const coreLinePositions = new Float32Array(coreEdges.length * 2 * 3);
  const coreLineColors = new Float32Array(coreEdges.length * 2 * 3);
  coreEdges.forEach(([a, b], idx) => {
    const ca = gradientColorAt(a / (data.length - 1));
    const cb = gradientColorAt(b / (data.length - 1));
    coreLineColors.set([ca.r, ca.g, ca.b], idx * 6);
    coreLineColors.set([cb.r, cb.g, cb.b], idx * 6 + 3);
  });
  coreLineGeometry.setAttribute('position', new THREE.BufferAttribute(coreLinePositions, 3));
  coreLineGeometry.setAttribute('color', new THREE.BufferAttribute(coreLineColors, 3));
  const coreLineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, toneMapped: false });
  const coreLines = new THREE.LineSegments(coreLineGeometry, coreLineMaterial);
  fieldGroup.add(coreLines);

  const looseLineGeometry = new THREE.BufferGeometry();
  const looseLinePositions = new Float32Array(looseEdges.length * 2 * 3);
  looseLineGeometry.setAttribute('position', new THREE.BufferAttribute(looseLinePositions, 3));
  const looseLineMaterial = new THREE.LineBasicMaterial({ color: '#7C8296', transparent: true, opacity: 0, toneMapped: false });
  const looseLines = new THREE.LineSegments(looseLineGeometry, looseLineMaterial);
  fieldGroup.add(looseLines);

  // ---- logo reveal (Phase 3-4) ----
  const logoGroup = new THREE.Group();
  logoGroup.position.set(0, 0.18, 0);
  scene.add(logoGroup);

  const glowTexture = createGlowTexture();
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const glowSprite = new THREE.Sprite(glowMaterial);
  logoGroup.add(glowSprite);

  const logoMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), logoMaterial);
  logoGroup.add(logoMesh);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/logo-dashboard-dark.png', (tex) => {
    logoMaterial.map = tex;
    logoMaterial.needsUpdate = true;
  });

  function render(elapsedMs: number, pointerX: number, pointerY: number) {
    const t = elapsedMs / 1000;

    const marketFadeIn = easeOutCubic(phaseProgress(elapsedMs, TIMELINE.marketStart, TIMELINE.marketDuration * 0.35));
    const convergeP = easeInOutCubic(phaseProgress(elapsedMs, TIMELINE.convergeStart, TIMELINE.convergeDuration));
    const pulseWindow = phaseProgress(elapsedMs, TIMELINE.pulseStart, TIMELINE.pulseDuration);
    const revealP = easeOutCubic(phaseProgress(elapsedMs, TIMELINE.revealStart, TIMELINE.revealDuration));

    const driftDamp = 1 - convergeP;
    const scaleBump =
      1 + Math.sin(Math.min(1, pulseWindow) * Math.PI) * 0.07 * (pulseWindow > 0 && pulseWindow < 1 ? 1 : 0);
    fieldGroup.scale.setScalar(scaleBump);

    const candleOpacity = marketFadeIn * (1 - revealP);
    const coreLineOpacity = convergeP * (1 - revealP) * 0.5;
    const looseLineOpacity = marketFadeIn * (1 - convergeP) * 0.3;

    candleMaterial.opacity = candleOpacity * 0.85;
    candleMesh.visible = candleOpacity > 0.003;
    coreLineMaterial.opacity = coreLineOpacity;
    coreLines.visible = coreLineOpacity > 0.003;
    looseLineMaterial.opacity = looseLineOpacity;
    looseLines.visible = looseLineOpacity > 0.003;

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const bx = d.start[0] + (d.core[0] - d.start[0]) * convergeP;
      const by = d.start[1] + (d.core[1] - d.start[1]) * convergeP;
      const bz = d.start[2] + (d.core[2] - d.start[2]) * convergeP;

      const x = bx + (d.disperse[0] - bx) * revealP;
      const y = by + (d.disperse[1] - by) * revealP;
      const z = bz + (d.disperse[2] - bz) * revealP;

      const driftSpeed = 0.5 + (i % 7) * 0.06;
      const driftPhase = i * 0.37;
      const drift = Math.sin(t * driftSpeed + driftPhase) * 0.06 * driftDamp;

      const px = x;
      const py = y + drift;
      const pz = z;

      posScratch[i * 3] = px;
      posScratch[i * 3 + 1] = py;
      posScratch[i * 3 + 2] = pz;

      dummy.position.set(px, py, pz);
      const bodyScale = 0.85 + d.scale * 0.5;
      dummy.scale.set(0.045 * bodyScale, 0.1 + d.scale * 0.09, 0.045 * bodyScale);
      dummy.updateMatrix();
      candleMesh.setMatrixAt(i, dummy.matrix);
    }
    candleMesh.instanceMatrix.needsUpdate = true;

    coreEdges.forEach(([a, b], idx) => {
      coreLinePositions[idx * 6] = posScratch[a * 3];
      coreLinePositions[idx * 6 + 1] = posScratch[a * 3 + 1];
      coreLinePositions[idx * 6 + 2] = posScratch[a * 3 + 2];
      coreLinePositions[idx * 6 + 3] = posScratch[b * 3];
      coreLinePositions[idx * 6 + 4] = posScratch[b * 3 + 1];
      coreLinePositions[idx * 6 + 5] = posScratch[b * 3 + 2];
    });
    (coreLineGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

    looseEdges.forEach(([a, b], idx) => {
      looseLinePositions[idx * 6] = posScratch[a * 3];
      looseLinePositions[idx * 6 + 1] = posScratch[a * 3 + 1];
      looseLinePositions[idx * 6 + 2] = posScratch[a * 3 + 2];
      looseLinePositions[idx * 6 + 3] = posScratch[b * 3];
      looseLinePositions[idx * 6 + 4] = posScratch[b * 3 + 1];
      looseLinePositions[idx * 6 + 5] = posScratch[b * 3 + 2];
    });
    (looseLineGeometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

    // logo reveal
    const logoOpacityP = easeOutCubic(phaseProgress(elapsedMs, TIMELINE.revealStart, TIMELINE.revealDuration + 250));
    const logoScaleP = easeOutBack(phaseProgress(elapsedMs, TIMELINE.revealStart, TIMELINE.revealDuration + 150));
    const settled = elapsedMs >= TIMELINE.total;
    const breathe = settled ? 1 + Math.sin(t * 0.6) * 0.012 : 1;
    const logoScale = (0.78 + logoScaleP * 0.22) * breathe;

    logoMesh.scale.setScalar(logoScale);
    logoMaterial.opacity = logoOpacityP;
    glowSprite.scale.setScalar(3.4 * logoScale);
    glowMaterial.opacity = logoOpacityP * 0.55;

    // restrained camera drift toward the pointer — full mode only mounts on
    // fine-pointer desktops (see useDeviceCapability), so no touch handling needed.
    camera.position.x += (pointerX * 0.22 - camera.position.x) * 0.03;
    camera.position.y += (pointerY * 0.14 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function resize(width: number, height: number) {
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function dispose() {
    candleGeometry.dispose();
    candleMaterial.dispose();
    coreLineGeometry.dispose();
    coreLineMaterial.dispose();
    looseLineGeometry.dispose();
    looseLineMaterial.dispose();
    logoMesh.geometry.dispose();
    logoMaterial.dispose();
    logoMaterial.map?.dispose();
    glowMaterial.dispose();
    glowTexture.dispose();
    renderer.dispose();
  }

  return { render, resize, dispose };
}
