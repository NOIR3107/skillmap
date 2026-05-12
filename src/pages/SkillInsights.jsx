import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, AreaChart, Area } from 'recharts';
import AnimatedNumber from '../components/AnimatedNumber';
import { BarChart2, Activity, Layers, Target, TrendingUp, Cpu, Terminal } from 'lucide-react';

const COLORS = {
  'Programming Languages': '#6366f1',
  'Web Development':       '#8b5cf6',
  'Data Science & ML':     '#06b6d4',
  'Cloud & DevOps':        '#f59e0b',
  'Databases':             '#22c55e',
  'Soft Skills & Tools':   '#ec4899',
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#050810]/95 border border-white/10 p-2 rounded-xl shadow-xl text-[10px]">
      <p className="font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black" style={{ color: COLORS[label] || '#fff' }}>{payload[0].value}%</p>
    </div>
  );
};

export default function SkillInsights({ lastAnalysis }) {
  if (!lastAnalysis) {
    return (
      <div className="h-full flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">Skill <span className="text-primary italic">Analytics</span></h1>
            <div className="text-[8px] font-black text-white/25 uppercase tracking-widest mt-0.5 bg-white/5 px-2 py-0.5 rounded-md inline-block">Neural Analysis Required</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center glass-card-premium !p-10 max-w-sm border-white/5">
            <div className="text-4xl mb-4 opacity-30">📉</div>
            <h3 className="text-xl font-black mb-2 uppercase italic">No <span className="text-primary">Signal</span></h3>
            <p className="text-white/25 text-xs font-medium leading-relaxed mb-6">Run a Career Match analysis first to populate your technical DNA profile.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-primary/20"
            >
              Click Match Engine to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  const clusterCoverage = lastAnalysis.clusterCoverage || {};
  const clusterData = useMemo(() =>
    Object.entries(clusterCoverage).map(([name, data]) => ({
      name, coverage: data.percent || 0, matched: data.matched || 0, total: data.total || 0
    })), [clusterCoverage]);

  const stats = [
    { label: 'Neural Accuracy', value: 99.7, unit: '%', icon: Target,    color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Skills Parsed',   value: lastAnalysis.totalSkillsDetected || 0, unit: '', icon: Cpu, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Match Confidence',value: 94.2, unit: '%', icon: Activity,  color: 'text-success', bg: 'bg-success/10'  },
    { label: 'Market Velocity', value: 88,   unit: '%', icon: TrendingUp, color: 'text-accent',  bg: 'bg-accent/10'  },
  ];

  return (
    <div className="h-full flex flex-col p-4 gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">Technical <span className="text-primary italic">DNA</span></h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[8px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded-md">
              <Layers className="w-2.5 h-2.5 text-primary" /> Cluster View
            </span>
            <span className="text-[8px] font-black text-white/25 uppercase tracking-widest">Industry Benchmarked</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
            className="glass-card-premium !p-3 flex items-center gap-3 border-white/5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <div className="text-[7px] font-black text-white/25 uppercase tracking-widest leading-none">{s.label}</div>
              <div className="text-lg font-black leading-none mt-0.5">
                <AnimatedNumber end={s.value} decimals={s.value % 1 !== 0 ? 1 : 0} />{s.unit}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Feed — main content */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">

        {/* Left: charts */}
        <div className="col-span-8 grid grid-rows-2 gap-3">

          {/* Row 1: Radar + Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card-premium border-white/5 flex flex-col">
              <div className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                Neural Balance
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={clusterData}>
                    <PolarGrid stroke="rgba(255,255,255,0.04)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 7, fontWeight: 900 }} />
                    <Radar dataKey="coverage" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card-premium border-white/5 flex flex-col">
              <div className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-2">Market Velocity</div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{m:'Jan',v:45},{m:'Feb',v:52},{m:'Mar',v:48},{m:'Apr',v:61},{m:'May',v:55},{m:'Jun',v:67},{m:'Jul',v:72}]}>
                    <defs>
                      <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="transparent" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} />
                    <Tooltip contentStyle={{ background: '#050810', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 10 }} />
                    <Area type="monotone" dataKey="v" stroke="#a855f7" fill="url(#areaG)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Bar chart */}
          <div className="glass-card-premium border-white/5 flex flex-col">
            <div className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-3 h-3 text-secondary" /> Vector Distribution
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="coverage" radius={[3, 3, 0, 0]} barSize={32}>
                    {clusterData.map((e, i) => <Cell key={i} fill={COLORS[e.name] || '#6366f1'} opacity={0.65} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Activity feed + AI card */}
        <div className="col-span-4 flex flex-col gap-3">
          {/* Activity feed */}
          <div className="glass-card-premium border-white/5 flex flex-col flex-1 min-h-0">
            <h3 className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-primary" /> Activity Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {[
                { time: 'T-0.5s', msg: 'Normalizing skill vectors...',             type: 'process' },
                { time: 'T-1.2s', msg: 'Pattern match: Frontend Architecture',     type: 'match'   },
                { time: 'T-2.4s', msg: 'Indexing market demand clusters',          type: 'system'  },
                { time: 'T-3.8s', msg: 'Calculating career trajectory',            type: 'process' },
                { time: 'T-5.1s', msg: 'Confidence score finalized at 99.7%',      type: 'success' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="text-[7px] font-black text-white/15 whitespace-nowrap pt-0.5">{log.time}</div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-white/50 group-hover:text-white/80 transition-colors leading-tight">{log.msg}</div>
                    <div className="h-0.5 w-8 bg-white/5 mt-1.5 rounded-full overflow-hidden">
                      <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                        className={`h-full w-full ${log.type === 'success' ? 'bg-success' : 'bg-primary'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="glass-card-premium bg-primary/[0.04] border-primary/15 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-widest">AI Strategist</h3>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed mb-3">
              Strong Frontend entropy detected. Priority: Acquire AWS/Docker to increase market velocity.
            </p>
            <button className="w-full py-2 rounded-xl bg-primary text-white text-[8px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
              Generate Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Inventory row — skill chips by cluster */}
      <div className="flex-shrink-0 glass-card-premium border-white/5 !py-3">
        <h2 className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-2">
          Entity <span className="text-primary">Inventory</span>
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {Object.entries(clusterCoverage).map(([cluster, data]) => {
            const matched = data.matchedSkills || [];
            if (!matched.length) return null;
            return (
              <div key={cluster} className="flex-shrink-0">
                <div className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1.5">{cluster.replace(' & ', ' ')}</div>
                <div className="flex flex-wrap gap-1">
                  {matched.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded-md bg-success/5 text-success border border-success/10 text-[8px] font-black uppercase">{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
