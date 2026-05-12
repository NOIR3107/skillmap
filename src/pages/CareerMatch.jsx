import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurReveal from '../components/BlurReveal';
import AnimatedNumber from '../components/AnimatedNumber';
import RoleDetail from './RoleDetail';
import { MLEngine } from '../../ml-engine.js';
import { quickAddSkills as defaultQuickAddSkills } from '../../data.js';
import { Sparkles, Brain, Zap, RefreshCw, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';

export default function CareerMatch({ lastAnalysis, setLastAnalysis }) {
  const [input, setInput] = useState('');
  const [detectedCount, setDetectedCount] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeChips, setActiveChips] = useState(new Set());
  const [selectedRole, setSelectedRole] = useState(null);

  const quickAddSkills = defaultQuickAddSkills || [
    "Python","JavaScript","React","Node.js","SQL","Machine Learning",
    "Docker","AWS","Git","TypeScript","Java","MongoDB"
  ];

  useEffect(() => {
    if (input) {
      const tokens = MLEngine.normalize(MLEngine.tokenize(input));
      setDetectedCount(tokens.length);
      const lower = input.toLowerCase();
      const active = new Set();
      quickAddSkills.forEach(s => { if (lower.includes(s.toLowerCase())) active.add(s); });
      setActiveChips(active);
    } else {
      setDetectedCount(0);
      setActiveChips(new Set());
    }
  }, [input]);

  const toggleChip = (skill) => {
    let parts = input.split(',').map(s => s.trim()).filter(Boolean);
    if (activeChips.has(skill)) parts = parts.filter(s => s.toLowerCase() !== skill.toLowerCase());
    else parts.push(skill);
    setInput(parts.join(', '));
  };

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setLastAnalysis(null);
    setSelectedRole(null);
    setTimeout(() => {
      try { setLastAnalysis(MLEngine.analyzeProfile(input)); }
      catch (err) { console.error(err); }
      finally { setAnalyzing(false); }
    }, 1600);
  };

  const ranked = lastAnalysis?.ranked ?? [];
  const userVector = lastAnalysis?.vector ?? {};

  // ── DETAIL VIEW ──────────────────────────────────────────────
  if (selectedRole) {
    return (
      <div className="h-full p-4 overflow-y-auto scrollbar-hide">
        <RoleDetail result={selectedRole} userVector={userVector} onBack={() => setSelectedRole(null)} />
      </div>
    );
  }

  // ── MAIN VIEW: fixed two-column, no scroll ───────────────────
  return (
    <div className="h-full flex flex-col p-4 gap-3 overflow-hidden">
      {/* Header bar — compact */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">
              Career <span className="text-primary italic">Intelligence</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[8px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded-md">
                <Brain className="w-2.5 h-2.5 text-primary" /> AI Matcher
              </span>
              <span className="text-[8px] font-black text-white/25 uppercase tracking-widest">Real-time vector analysis</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { label: 'Efficiency', value: '98.4%', icon: Zap,          color: 'text-success', bg: 'bg-success/10' },
            { label: 'Detected',  value: `${detectedCount} Skills`, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
          ].map(s => (
            <div key={s.label} className="glass-card !p-2 !px-3 flex items-center gap-2 !rounded-xl border-white/5">
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <div>
                <div className="text-[7px] font-black text-white/25 uppercase tracking-widest">{s.label}</div>
                <div className={`text-sm font-black ${s.color} leading-none mt-0.5`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column body — fills remaining height */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">

        {/* LEFT: Input panel */}
        <div className={`${lastAnalysis ? 'col-span-4' : 'col-span-5 col-start-4'} flex flex-col`}>
          <div className="glass-card-premium flex flex-col h-full border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Profile Input
                </h2>
                {input && (
                  <button onClick={() => { setInput(''); setLastAnalysis(null); }}
                    className="text-[8px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5" /> Clear
                  </button>
                )}
              </div>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                className="neo-input flex-1 min-h-0 text-xs !p-3"
                placeholder="Paste your resume or list skills..."
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[8px] font-black text-white/25 uppercase tracking-[0.2em]">Quick Add</div>
                  <div className="text-[8px] font-black text-primary/40 uppercase tracking-widest">{activeChips.size} Active</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {quickAddSkills.map(skill => (
                    <button key={skill} onClick={() => toggleChip(skill)}
                      className={`chip !px-2 !py-1 !text-[8px] ${activeChips.has(skill) ? 'active' : ''}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary w-full !py-3 group"
                onClick={handleAnalyze}
                disabled={analyzing || !input.trim()}
              >
                <span className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                  {analyzing ? 'Analyzing...' : 'Execute Match Analysis'}
                  <ChevronRight className={`w-4 h-4 ${analyzing ? 'animate-spin' : 'group-hover:translate-x-0.5 transition-transform'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className={`${lastAnalysis ? 'col-span-8' : 'hidden'} flex flex-col min-h-0`}>
          {analyzing && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-4 rounded-xl border-2 border-secondary/20 border-b-secondary animate-spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
              </div>
              <h3 className="text-lg font-black tracking-tight">Syncing Neural Vectors</h3>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] animate-pulse mt-1">Consulting career matrix...</p>
            </div>
          )}

          {lastAnalysis && !analyzing && (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h2 className="text-base font-black tracking-tight uppercase italic">
                  Optimized <span className="text-primary">Career Paths</span>
                </h2>
                <div className="text-[8px] font-black text-white/25 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded-full border border-white/5">
                  {ranked.length} Vectors · Click to Explore
                </div>
              </div>

              {/* Results list — scrollable in its own container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {ranked.map((r, i) => {
                  const score    = r?.score ?? 0;
                  const coverage = r?.coverage ?? 0;
                  const role     = r?.role ?? {};
                  const matched  = r?.matchedSkills ?? [];
                  const missing  = r?.missingSkills ?? [];

                  return (
                    <BlurReveal key={role.id ?? i} delay={i * 0.05}>
                      <motion.div
                        onClick={() => setSelectedRole(r)}
                        whileHover={{ y: -1, scale: 1.002 }}
                        whileTap={{ scale: 0.999 }}
                        className={`glass-card-premium !p-4 cursor-pointer group transition-all duration-200 ${
                          i === 0 ? 'bg-primary/5 border-primary/20 hover:border-primary/35' : 'bg-white/[0.01] border-white/5 hover:border-white/12'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                            i === 0 ? 'bg-primary/15 border-primary/25' : 'bg-white/5 border-white/8'
                          }`}>
                            {role.icon ?? '💼'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-black text-sm truncate">{role.name ?? 'Unknown'}</h3>
                              {i === 0 && (
                                <span className="px-1.5 py-0.5 rounded-md bg-primary text-[7px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-1 flex-shrink-0">
                                  <Sparkles className="w-2 h-2" /> Best
                                </span>
                              )}
                            </div>
                            <p className="text-white/25 text-[10px] font-medium mb-2 line-clamp-1">{role.description ?? ''}</p>
                            <div className="flex flex-wrap gap-1">
                              {matched.slice(0, 4).map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded-md bg-success/5 text-success border border-success/10 text-[8px] font-black uppercase">{s}</span>
                              ))}
                              {matched.length > 4 && <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-white/20 text-[8px] font-black">+{matched.length - 4}</span>}
                              {missing.length > 0 && <span className="px-1.5 py-0.5 rounded-md bg-danger/5 text-danger/50 border border-danger/10 text-[8px] font-black">{missing.length} gaps</span>}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 pl-3 border-l border-white/5 min-w-[72px]">
                            <div className="text-right">
                              <div className="text-[7px] font-black text-white/20 uppercase tracking-widest">Similarity</div>
                              <div className={`text-xl font-black leading-none mt-0.5 ${i === 0 ? 'text-primary' : 'text-white/60'}`}>
                                <AnimatedNumber end={score} />%
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[7px] font-black text-white/20 uppercase tracking-widest">Coverage</div>
                              <div className="text-xs font-bold text-white/25"><AnimatedNumber end={coverage} />%</div>
                            </div>
                          </div>

                          <div className="ml-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 duration-200">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-primary/20' : 'bg-white/5'}`}>
                              <ArrowRight className={`w-3.5 h-3.5 ${i === 0 ? 'text-primary' : 'text-white/30'}`} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </BlurReveal>
                  );
                })}
              </div>
            </div>
          )}


        </div>


      </div>
    </div>
  );
}
