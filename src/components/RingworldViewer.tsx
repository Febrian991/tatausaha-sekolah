import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { INSTALLATION_LOCATIONS, InstallationPoint } from '../types/halo';
import { haloAudio } from '../utils/audio';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Radio, 
  MapPin, 
  Compass, 
  Maximize2,
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface RingworldViewerProps {
  onSelectSite?: (site: InstallationPoint) => void;
}

export const RingworldViewer: React.FC<RingworldViewerProps> = ({ onSelectSite }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSite, setSelectedSite] = useState<InstallationPoint>(INSTALLATION_LOCATIONS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [cameraZoomLevel, setCameraZoomLevel] = useState(1);
  const [showTelemetry, setShowTelemetry] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Generate procedural terrain texture for the inner ring surface
  const generateInnerRingTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base ocean blue
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#062038');
    oceanGrad.addColorStop(0.5, '#0a365c');
    oceanGrad.addColorStop(1, '#062038');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural continents and landmasses
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * canvas.width;
      const cy = 40 + Math.random() * (canvas.height - 80);
      const radiusX = 60 + Math.random() * 140;
      const radiusY = 20 + Math.random() * 50;

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radiusX);
      grad.addColorStop(0, '#2d6a4f');
      grad.addColorStop(0.5, '#40916c');
      grad.addColorStop(0.8, '#74c69d');
      grad.addColorStop(1, 'rgba(6, 32, 56, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radiusX, radiusY, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mountain ridges (snow capped)
    for (let i = 0; i < 25; i++) {
      const mx = Math.random() * canvas.width;
      const my = 60 + Math.random() * (canvas.height - 120);
      ctx.fillStyle = 'rgba(216, 235, 245, 0.7)';
      ctx.beginPath();
      ctx.arc(mx, my, 8 + Math.random() * 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cloud filaments
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let i = 0; i < 30; i++) {
      const cloudX = Math.random() * canvas.width;
      const cloudY = Math.random() * canvas.height;
      ctx.fillRect(cloudX, cloudY, 80 + Math.random() * 120, 10 + Math.random() * 15);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(12, 1);
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Create Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 22);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    scene.add(ambientLight);

    // Stellar Sun light from gas giant angle
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    sunLight.position.set(30, 20, 15);
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueRimLight.position.set(-20, -10, -20);
    scene.add(blueRimLight);

    // 5. Starfield Particle System
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      const radius = 60 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = radius * Math.cos(phi);

      const isBlue = Math.random() > 0.7;
      starColors[idx] = isBlue ? 0.6 : 0.95;
      starColors[idx + 1] = isBlue ? 0.85 : 0.95;
      starColors[idx + 2] = 1.0;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Halo Megastructure Ring
    const ringGroup = new THREE.Group();
    ringGroupRef.current = ringGroup;
    scene.add(ringGroup);

    const ringRadius = 9.0;
    const ringWidth = 1.6;
    const ringThickness = 0.35;

    // Inner Habitable Surface (Cylinder facing inward)
    const innerGeom = new THREE.CylinderGeometry(
      ringRadius,
      ringRadius,
      ringWidth,
      128,
      1,
      true
    );
    // Invert normals so texture is visible inside
    innerGeom.scale(-1, 1, 1);
    const innerTexture = generateInnerRingTexture();
    const innerMat = new THREE.MeshStandardMaterial({
      map: innerTexture,
      roughness: 0.65,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const innerRingMesh = new THREE.Mesh(innerGeom, innerMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    ringGroup.add(innerRingMesh);

    // Outer Structural Hull (Gunmetal titanium armor plates)
    const outerRadius = ringRadius + ringThickness;
    const outerGeom = new THREE.CylinderGeometry(
      outerRadius,
      outerRadius,
      ringWidth,
      128,
      1,
      true
    );
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x1a232f,
      roughness: 0.4,
      metalness: 0.85,
      side: THREE.DoubleSide
    });
    const outerRingMesh = new THREE.Mesh(outerGeom, outerMat);
    outerRingMesh.rotation.x = Math.PI / 2;
    ringGroup.add(outerRingMesh);

    // Ring Retaining Wall Flanges (Left & Right rims)
    const flangeGeom = new THREE.RingGeometry(ringRadius, outerRadius, 128);
    const flangeMat = new THREE.MeshStandardMaterial({
      color: 0x243342,
      roughness: 0.5,
      metalness: 0.7,
      side: THREE.DoubleSide
    });
    const leftFlange = new THREE.Mesh(flangeGeom, flangeMat);
    leftFlange.position.z = -ringWidth / 2;
    ringGroup.add(leftFlange);

    const rightFlange = new THREE.Mesh(flangeGeom, flangeMat);
    rightFlange.position.z = ringWidth / 2;
    ringGroup.add(rightFlange);

    // Forerunner Spire Monoliths along the inner rim
    const spireGeom = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.2
    });
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const spire = new THREE.Mesh(spireGeom, spireMat);
      spire.position.x = Math.cos(angle) * (ringRadius - 0.15);
      spire.position.y = Math.sin(angle) * (ringRadius - 0.15);
      spire.position.z = 0;
      spire.rotation.z = angle + Math.PI / 2;
      ringGroup.add(spire);
    }

    // 7. Background Gas Giant (Threshold / Substance)
    const planetGeom = new THREE.SphereGeometry(14, 48, 48);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.9,
      metalness: 0.05
    });
    const gasGiant = new THREE.Mesh(planetGeom, planetMat);
    gasGiant.position.set(-42, -18, -60);
    scene.add(gasGiant);

    // Add faint planetary ring to the gas giant
    const planetRingGeom = new THREE.RingGeometry(18, 28, 64);
    const planetRingMat = new THREE.MeshBasicMaterial({
      color: 0xb45309,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const planetRing = new THREE.Mesh(planetRingGeom, planetRingMat);
    planetRing.position.copy(gasGiant.position);
    planetRing.rotation.x = Math.PI / 2.8;
    planetRing.rotation.y = 0.3;
    scene.add(planetRing);

    // Mouse Drag Interaction for Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !ringGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      ringGroupRef.current.rotation.y += deltaX * 0.006;
      ringGroupRef.current.rotation.x += deltaY * 0.006;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (ringGroupRef.current && isRotating) {
        ringGroupRef.current.rotation.y += rotationSpeed;
        ringGroupRef.current.rotation.z += rotationSpeed * 0.2;
      }

      // Slow twinkle on gas giant
      gasGiant.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, [isRotating, rotationSpeed]);

  // Handle Zoom buttons
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    haloAudio.playUiClick();
    const newZ = Math.min(38, Math.max(12, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newZ;
    setCameraZoomLevel(Number(((38 - newZ) / 26).toFixed(2)));
  };

  const handleSelectSite = (site: InstallationPoint) => {
    setSelectedSite(site);
    haloAudio.playUiClick();
    if (onSelectSite) onSelectSite(site);

    // Orient ring toward site
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.y = site.coordinates.x * 0.4;
      ringGroupRef.current.rotation.x = site.coordinates.y * 0.15;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[#06090e]">
      {/* 3D Canvas Viewport */}
      <div className="relative flex-1 h-[55vh] lg:h-full overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Tactical HUD Overlays */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider bg-slate-950/70 backdrop-blur-md px-3 py-1.5 border border-cyan-500/30 rounded">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Telemetry: Installation 04 (Alpha Halo)</span>
            <span className="text-slate-500">/</span>
            <span className="text-emerald-400">Stable Orbit</span>
          </div>
        </div>

        {/* Viewport Control Bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded px-3 py-2 z-10 text-xs font-mono text-slate-300">
          <button
            onClick={() => {
              haloAudio.playUiClick();
              setIsRotating(!isRotating);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              isRotating ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isRotating ? 'Spinning' : 'Stationary'}</span>
          </button>

          <button
            onClick={() => handleZoom(-3)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(3)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-300"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>HUD {showTelemetry ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* Top-Right Telemetry Data Panel */}
        {showTelemetry && (
          <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 p-3.5 rounded text-xs font-mono text-slate-300 space-y-1.5 hidden sm:block max-w-[260px]">
            <div className="flex justify-between items-center text-cyan-400 font-semibold border-b border-slate-800 pb-1">
              <span>Array Superstructure</span>
              <span className="text-[10px] text-slate-500">10,000 KM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Surface Gravity</span>
              <span className="text-slate-200">0.98 G</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rotational Period</span>
              <span className="text-slate-200">17.2 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Orbital Primary</span>
              <span className="text-amber-400">Threshold (Gas Giant)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Biosphere Status</span>
              <span className="text-emerald-400">Preserved Flora/Fauna</span>
            </div>
          </div>
        )}
      </div>

      {/* Installation Intelligence Sidebar */}
      <div className="w-full lg:w-96 bg-[#0a0f16] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col p-5 overflow-y-auto max-h-[50vh] lg:max-h-full">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>CARTOGRAPHIC LOG</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide">
            INSTALLATION 04 ATLAS
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Select an operational landmark along the 10,000 kilometer ring circumference to access declassified UNSC mission debriefs.
          </p>
        </div>

        {/* Installation Landmark Buttons */}
        <div className="space-y-2 mb-6">
          {INSTALLATION_LOCATIONS.map((site) => {
            const isSelected = selectedSite.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => handleSelectSite(site)}
                className={`w-full text-left p-3 rounded border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-sm shadow-cyan-950'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm tracking-wide">{site.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      site.status === 'Critical'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        : site.status === 'Operational'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {site.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{site.type}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Landmark Details Card */}
        {selectedSite && (
          <div className="mt-auto bg-slate-900/90 border border-slate-800 rounded p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-cyan-400 uppercase">{selectedSite.classification}</span>
              <span className="text-slate-400 font-mono text-[11px]">{selectedSite.historyDate}</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1 font-display tracking-wide">{selectedSite.name}</h4>
              <p className="text-slate-300 leading-relaxed">{selectedSite.summary}</p>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800 text-slate-400 font-mono text-[11px] leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">TACTICAL DIRECTIVE:</span>
              {selectedSite.tacticalNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
