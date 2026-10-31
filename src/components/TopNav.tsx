import React from 'react';
import { Crosshair, Shield } from 'lucide-react';
import { haloAudio } from '../utils/audio';

interface TopNavProps {
  activeTab: 'ringworld' | 'firefight' | 'armory' | 'lore';
  setActiveTab: (tab: 'ringworld' | 'firefight' | 'armory' | 'lore') => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab }) => {
  const handleNavClick = (tab: 'ringworld' | 'firefight' | 'armory' | 'lore') => {
    haloAudio.playUiClick();
    setActiveTab(tab);
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-[#070b10] z-50">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => handleNavClick('ringworld')}
        className="text-lg font-bold font-display tracking-wider text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors text-left"
      >
        HALO · UNSC TACTICAL
      </button>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => handleNavClick('ringworld')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'ringworld' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Ringworld 3D
        </button>

        <button
          onClick={() => handleNavClick('firefight')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'firefight' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Firefight Arena
        </button>

        <button
          onClick={() => handleNavClick('armory')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'armory' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Spartan Armory
        </button>

        <button
          onClick={() => handleNavClick('lore')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'lore' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Lore Dossiers
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => handleNavClick('firefight')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-500/20"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Deploy Spartan</span>
        </button>
      </div>
    </header>
  );
};
