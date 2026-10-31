import React, { useState } from 'react';
import { LORE_DATABASE, LoreEntry } from '../types/halo';
import { haloAudio } from '../utils/audio';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileText, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LoreArchive: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LoreEntry>(LORE_DATABASE[0]);

  const categories = ['All', 'Installations', 'Spartans', 'Covenant', 'UNSC Navy'];

  const filteredEntries = LORE_DATABASE.filter((entry) => {
    const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const timelineEvents = [
    { year: '100,000 BCE', title: 'The Forerunner-Flood War & Activation of the Array', desc: 'Faced with galactic extinction by the parasitic Flood, the Forerunners fire the Halo rings, cleansing the galaxy of sentient life and reseeding biological specimens.' },
    { year: '2525 CE', title: 'First Contact at Harvest', desc: 'The theocratic alien alliance known as the Covenant encounters humanity at the colony of Harvest, declaring a holy war of extermination against the "Heretics".' },
    { year: '2552 CE (August)', title: 'The Fall of Reach', desc: 'Humanity primary military bastion falls to the Covenant fleet. The UNSC Pillar of Autumn escapes into slipspace with Spartan-117 aboard following the Cole Protocol.' },
    { year: '2552 CE (September)', title: 'Discovery of Installation 04', desc: 'The Pillar of Autumn arrives at Alpha Halo. Master Chief John-117 and Cortana uncover the true purpose of the ring and detonate the cruiser to avert firing.' },
    { year: '2553 CE (March)', title: 'The Great Schism & End of the War', desc: 'The Sangheili under the Arbiter ally with humanity. The Covenant Prophet of Truth is slain at the Ark, ending thirty years of interstellar slaughter.' },
    { year: '2560 CE', title: 'The Conflict at Zeta Halo', desc: 'The Banished under War Chief Escharum shatter Installation 07. The Master Chief re-engages hostile forces to prevent the Banished from commanding the ring.' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>UNSC HIGHCOM HISTORICAL & TACTICAL INTELLIGENCE ARCHIVE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-wide">
          DECLASSIFIED ONI DOSSIERS
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Historical records, biological threat assessments, and technological analyses compiled from the Human-Covenant War and the Forerunner Array.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Interactive Segmented Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                haloAudio.playUiClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search archive dossiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Main Grid: Entry Selection & Dossier Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dossier List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredEntries.map((entry) => {
            const isSelected = selectedEntry.id === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() => {
                  haloAudio.playUiClick();
                  setSelectedEntry(entry);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-md shadow-cyan-950/50'
                    : 'bg-[#0a0f16] border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  {entry.classification}
                </div>
                <div className="font-bold font-display text-base tracking-wide text-white">
                  {entry.title}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {entry.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Dossier Deep Dive (8 cols) */}
        <div className="lg:col-span-8 bg-[#0a0f16] border border-slate-800 rounded-lg p-6 space-y-6">
          {selectedEntry && (
            <>
              {/* Dossier Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{selectedEntry.classification}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">UNSC SECTION 3 CLEARANCE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide">
                  {selectedEntry.title}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {selectedEntry.subtitle}
                </p>
              </div>

              {/* Dossier Body Prose */}
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
                {selectedEntry.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Technical Specifications Grid */}
              <div>
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
                  CRITICAL METRICS & TELEMETRY
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedEntry.keySpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="bg-slate-900/80 border border-slate-800/80 p-3 rounded flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-slate-400">{spec.label}</span>
                      <span className="text-white font-bold tabular-nums">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Halo Historical Timeline */}
      <div className="bg-[#0a0f16] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Clock className="w-4 h-4" />
          <span>CANONICAL CHRONOLOGY</span>
        </div>
        <h3 className="text-2xl font-bold font-display text-white tracking-wide">
          THE GREAT JOURNEY & HUMAN CONFLICT TIMELINE
        </h3>

        <div className="space-y-4 pt-2">
          {timelineEvents.map((ev, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pb-4 border-b border-slate-800/60 last:border-b-0 last:pb-0"
            >
              <div className="w-36 font-mono text-xs font-bold text-cyan-400 shrink-0">
                {ev.year}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold font-display text-white tracking-wide">
                  {ev.title}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {ev.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
