import React, { useState } from 'react';
import { WEAPONS_DATABASE, WeaponSpec } from '../types/halo';
import { haloAudio } from '../utils/audio';
import { 
  Crosshair, 
  Shield, 
  Flame, 
  Zap, 
  Layers, 
  Sparkles, 
  Play, 
  Volume2, 
  Cpu, 
  Target,
  Sword,
  Compass
} from 'lucide-react';

export const SpartanArmory: React.FC = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponSpec>(WEAPONS_DATABASE[0]);
  const [visorColor, setVisorColor] = useState('#f59e0b'); // Solar Gold
  const [armorCoating, setArmorCoating] = useState('#3f6212'); // Spartan Olive
  const [equipmentModule, setEquipmentModule] = useState('Grappleshot');

  // Interactive Target Dummy State
  const [targetShield, setTargetShield] = useState(100);
  const [targetHealth, setTargetHealth] = useState(100);
  const [isFiring, setIsFiring] = useState(false);
  const [recentHits, setRecentHits] = useState<{ id: number; damage: number; isCrit: boolean }[]>([]);

  const visorOptions = [
    { label: 'Solar Gold', color: '#f59e0b' },
    { label: 'Cobalt Blue', color: '#38bdf8' },
    { label: 'Crimson Red', color: '#ef4444' },
    { label: 'Void Obsidian', color: '#64748b' },
  ];

  const coatingOptions = [
    { label: 'Spartan Olive', color: '#3f6212' },
    { label: 'Midnight Steel', color: '#1e293b' },
    { label: 'Reach Desert', color: '#78350f' },
    { label: 'Arctic Frost', color: '#94a3b8' },
  ];

  const equipmentOptions = [
    { name: 'Grappleshot', desc: 'High-tensile wire winch for rapid traversal and weapon commandeering.' },
    { name: 'Drop Wall', desc: 'Deployable one-way energy shield providing immediate tactical cover.' },
    { name: 'Repulsor', desc: 'Pneumatic shockwave blast deflecting incoming missiles and projectiles.' },
    { name: 'Thruster Pack', desc: 'Omni-directional micro-burst thrusters enabling emergency evasive dash.' },
  ];

  // Test Fire Selected Weapon on Hologram Target
  const handleTestFire = () => {
    if (isFiring) return;
    setIsFiring(true);

    // Audio SFX
    if (selectedWeapon.id === 'ma40') haloAudio.playAssaultRifle();
    else if (selectedWeapon.id === 'br75') {
      haloAudio.playBattleRifleShot(0);
      setTimeout(() => haloAudio.playBattleRifleShot(1), 65);
      setTimeout(() => haloAudio.playBattleRifleShot(2), 130);
    } else if (selectedWeapon.id === 'plasma-rifle') haloAudio.playPlasmaShot();
    else if (selectedWeapon.id === 'energy-sword') haloAudio.playEnergySword();
    else haloAudio.playExplosion();

    // Damage math
    const isCrit = Math.random() > 0.65;
    const baseDmg = selectedWeapon.id === 'spnkr' ? 180 : selectedWeapon.id === 'energy-sword' ? 150 : 35;
    const multiplier = targetShield > 0 ? selectedWeapon.shieldMultiplier : selectedWeapon.fleshMultiplier;
    const totalDmg = Math.round(baseDmg * multiplier * (isCrit ? 1.5 : 1.0));

    // Apply to target
    if (targetShield > 0) {
      setTargetShield((prev) => Math.max(0, prev - totalDmg));
    } else {
      setTargetHealth((prev) => {
        const next = Math.max(0, prev - totalDmg);
        if (next === 0) {
          // Reset dummy after 1.5s
          setTimeout(() => {
            setTargetShield(100);
            setTargetHealth(100);
          }, 1500);
        }
        return next;
      });
    }

    // Register hit text
    const hitId = Date.now();
    setRecentHits((prev) => [...prev.slice(-3), { id: hitId, damage: totalDmg, isCrit }]);
    setTimeout(() => {
      setRecentHits((prev) => prev.filter((h) => h.id !== hitId));
      setIsFiring(false);
    }, 280);
  };

  const resetTarget = () => {
    haloAudio.playUiClick();
    setTargetShield(100);
    setTargetHealth(100);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>UNSC ORDNANCE & MJOLNIR DEVELOPMENT DIVISION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-wide">
            SPARTAN ARMORY & BALLISTICS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Configure MJOLNIR Mark VI powered assault armor parameters and conduct live fire tests against simulated Covenant combatants.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded self-start md:self-auto">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-bold">RANGE LIVE</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">AMMO LINK: SECURE</span>
        </div>
      </div>

      {/* Main Grid: Armor Visualizer & Target Range */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: MJOLNIR Armor Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-[#0a0f16] border border-slate-800 rounded-lg p-5 flex flex-col space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-display text-white tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>MJOLNIR POWERED ASSAULT ARMOR</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">GEN 3 PLATFORM</span>
          </div>

          {/* Armor Cinematic Preview Frame */}
          <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center group">
            <img
              src="/src/assets/images/halo_spartan_armory_1793444220567.jpg"
              alt="Master Chief MJOLNIR Armor"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Dynamic Visor Glow Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-color opacity-30 transition-colors duration-300"
              style={{ backgroundColor: visorColor }}
            />
            {/* Tactical Watermark Label */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-slate-800">
              STAGING BAY A7 // JOHN-117
            </div>
          </div>

          {/* Armor Customization Controls */}
          <div className="space-y-4 text-xs font-mono">
            {/* Visor Color Selector */}
            <div>
              <span className="text-slate-400 block mb-1.5">VISOR POLARIZATION</span>
              <div className="grid grid-cols-4 gap-2">
                {visorOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      haloAudio.playUiClick();
                      setVisorColor(opt.color);
                    }}
                    className={`flex items-center gap-1.5 p-2 rounded border text-left transition-colors ${
                      visorColor === opt.color
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <span className="text-[11px] truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Armor Coating Selector */}
            <div>
              <span className="text-slate-400 block mb-1.5">NANO-COMPOSITE COATING</span>
              <div className="grid grid-cols-4 gap-2">
                {coatingOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      haloAudio.playUiClick();
                      setArmorCoating(opt.color);
                    }}
                    className={`flex items-center gap-1.5 p-2 rounded border text-left transition-colors ${
                      armorCoating === opt.color
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                    <span className="text-[11px] truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Equipment Slot */}
            <div>
              <span className="text-slate-400 block mb-1.5">TACTICAL MODULE SLOT</span>
              <div className="grid grid-cols-2 gap-2">
                {equipmentOptions.map((eq) => (
                  <button
                    key={eq.name}
                    onClick={() => {
                      haloAudio.playUiClick();
                      setEquipmentModule(eq.name);
                    }}
                    className={`p-2.5 rounded border text-left transition-colors ${
                      equipmentModule === eq.name
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-cyan-300">{eq.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{eq.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Weapon Testing Range (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a0f16] border border-slate-800 rounded-lg p-5 flex flex-col space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-display text-white tracking-wide flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>LIVE FIRE BALLISTICS TESTING</span>
            </h3>
            <button
              onClick={resetTarget}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
            >
              Reset Target
            </button>
          </div>

          {/* Holographic Covenant Target & Live Firing Area */}
          <div className="relative h-64 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-between px-8">
            {/* Visual background grid */}
            <div className="absolute inset-0 tactical-grid pointer-events-none opacity-40" />

            {/* Left: Weapon Firing Node */}
            <div className="relative z-10 flex flex-col items-start space-y-2">
              <div className="text-xs font-mono text-slate-400">CURRENT WEAPON</div>
              <div className="text-xl font-bold font-display text-cyan-300 tracking-wide">
                {selectedWeapon.name}
              </div>
              <div className="text-xs font-mono text-slate-500">{selectedWeapon.ammoType}</div>

              {/* Fire Button */}
              <button
                onClick={handleTestFire}
                disabled={isFiring}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs rounded shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Crosshair className="w-4 h-4" />
                <span>DISCHARGE WEAPON</span>
              </button>
            </div>

            {/* Center Tracer Stream */}
            <div className="flex-1 flex items-center justify-center px-4 relative h-full">
              {isFiring && (
                <div
                  className="w-full h-1 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: selectedWeapon.color, boxShadow: `0 0 16px ${selectedWeapon.color}` }}
                />
              )}

              {/* Floating Damage Numbers */}
              <div className="absolute top-8 flex flex-col items-center pointer-events-none">
                {recentHits.map((hit) => (
                  <div
                    key={hit.id}
                    className={`font-mono text-sm font-bold tracking-wider animate-bounce ${
                      hit.isCrit ? 'text-amber-400 text-base' : 'text-cyan-400'
                    }`}
                  >
                    -{hit.damage} {hit.isCrit ? 'CRITICAL!' : ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Holographic Sangheili Elite Dummy */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-xs font-mono text-slate-400 mb-2">TARGET DUMMY</div>

              {/* Elite Avatar Dummy */}
              <div className="relative w-24 h-24 rounded-full border border-cyan-500/30 overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src="/src/assets/images/halo_covenant_encounter_1793444221533.jpg"
                  alt="Covenant Target Dummy"
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                {/* Shield Overlay Glow */}
                {targetShield > 0 && (
                  <div className="absolute inset-0 border-2 border-cyan-400/80 rounded-full animate-pulse" />
                )}
              </div>

              {/* Target Shield & Health Bars */}
              <div className="w-32 mt-3 space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-cyan-400">
                  <span>SHIELD</span>
                  <span>{targetShield}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-sm overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-150" style={{ width: `${targetShield}%` }} />
                </div>

                <div className="flex justify-between text-rose-400 mt-1">
                  <span>HEALTH</span>
                  <span>{targetHealth}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-sm overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-150" style={{ width: `${targetHealth}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weapon Roster Selectors */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">SELECT ORDNANCE PLATFORM</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WEAPONS_DATABASE.map((weapon) => {
                const isSelected = selectedWeapon.id === weapon.id;
                return (
                  <button
                    key={weapon.id}
                    onClick={() => {
                      haloAudio.playUiClick();
                      setSelectedWeapon(weapon);
                    }}
                    className={`p-2.5 rounded border text-left transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs truncate" style={{ color: isSelected ? weapon.color : undefined }}>
                      {weapon.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{weapon.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Weapon Technical Dossier */}
          <div className="bg-slate-900/80 border border-slate-800 rounded p-4 text-xs font-mono space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2 gap-2">
              <span className="text-cyan-400 font-bold">{selectedWeapon.designation}</span>
              <span className="text-slate-500 text-[11px]">{selectedWeapon.category}</span>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed">{selectedWeapon.description}</p>

            {/* Multipliers & Performance Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
              <div>
                <span className="text-slate-500 block">MAG CAPACITY</span>
                <span className="text-white font-bold tabular-nums">{selectedWeapon.magSize} Rounds</span>
              </div>
              <div>
                <span className="text-slate-500 block">EFFECTIVE RANGE</span>
                <span className="text-white font-bold">{selectedWeapon.effectiveRange}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SHIELD DMG MULT</span>
                <span className="text-cyan-400 font-bold tabular-nums">{selectedWeapon.shieldMultiplier}x</span>
              </div>
              <div>
                <span className="text-slate-500 block">FLESH DMG MULT</span>
                <span className="text-rose-400 font-bold tabular-nums">{selectedWeapon.fleshMultiplier}x</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded text-[11px] text-slate-400 border border-slate-800/80">
              <span className="text-amber-400 font-bold block mb-1">TACTICAL ARCHIVE NOTES:</span>
              {selectedWeapon.lore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
