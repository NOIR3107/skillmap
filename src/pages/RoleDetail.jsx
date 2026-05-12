import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, Zap, Target, TrendingUp, BookOpen, AlertTriangle, Award, Clock, Star } from 'lucide-react';
import MatchRing from '../components/MatchRing';
import AnimatedNumber from '../components/AnimatedNumber';
import { MLEngine } from '../../ml-engine.js';
import { learningResources } from '../../data.js';

function capitalize(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function RoleDetail({ result, userVector, onBack }) {
  const [tab, setTab] = useState('overview');
  const { role, score, coverage, matchedSkills, missingSkills } = result;
  const gap = MLEngine.gapAnalysis(userVector, role);

  const criticalMissing  = gap.missing.filter(s => s.importance >= 0.8);
  const importantMissing = gap.missing.filter(s => s.importance >= 0.6 && s.importance < 0.8);
  const niceMissing      = gap.missing.filter(s => s.importance < 0.6);

  const totalWeeks = gap.missing.reduce((sum, s) => {
    const r = learningResources[s.skill];
    if (!r || r.est === 'ongoing') return sum + 2;
    return sum + (parseInt(r.est) || 2);
  }, 0);

  const tabs = [
    { id: 'overview', label: 'Overview',   icon: Target      },
    { id: 'gaps',     label: 'Skill Gaps', icon: AlertTriangle },
    { id: 'roadmap',  label: 'Roadmap',    icon: TrendingUp  },
  ];

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">

      {/* Header — compact */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-all group flex-shrink-0">
          <ArrowLeft className="w-4 h-4 text-white/30 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
        </button>

        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl flex-shrink-0 bg-primary/10 border-primary/20`}>
          {role.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black tracking-tight leading-none truncate">{role.name}</h2>
          <p className="text-white/30 text-[10px] font-medium mt-0.5 truncate">{role.description}</p>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-3 glass-card-premium !p-3 !rounded-2xl border-primary/15 bg-primary/5 flex-shrink-0">
          <MatchRing score={score} size={52} strokeWidth={4} />
          <div>
            <div className="text-[7px] font-black text-white/25 uppercase tracking-widest">Match</div>
            <div className="text-xl font-black text-primary leading-none"><AnimatedNumber end={score} />%</div>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/5 flex-shrink-0">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
                isActive ? 'bg-white/[0.05] text-white border border-white/8' : 'text-white/30 hover:text-white/60'
              }`}>
              <Icon className={`w-3 h-3 ${isActive ? 'text-primary' : ''}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content — fills remaining height, internal scroll only */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                {[
                  { label: 'Matched', value: matchedSkills.length, suffix: `/${matchedSkills.length + missingSkills.length}`, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
                  { label: 'Coverage', value: coverage, suffix: '%', icon: Award, color: 'text-primary', bg: 'bg-primary/10' },
                  { label: 'Gaps', value: missingSkills.length, suffix: '', icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
                ].map((s, i) => (
                  <div key={i} className="glass-card-premium !p-3 flex items-center gap-3 border-white/5">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-white/25 uppercase tracking-widest">{s.label}</div>
                      <div className="text-lg font-black leading-none mt-0.5">
                        <AnimatedNumber end={s.value} /><span className="text-xs text-white/25">{s.suffix}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compatibility bars */}
              <div className="glass-card-premium border-white/5 flex-shrink-0">
                <h3 className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-primary" /> Compatibility Breakdown
                </h3>
                <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                  {gap.matched.map((skill, i) => (
                    <div key={skill.skill} className="flex items-center gap-2">
                      <div className="w-20 text-[9px] font-black text-white/50 truncate capitalize">{skill.skill}</div>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${skill.importance * 100}%` }}
                          transition={{ delay: i * 0.03, duration: 0.6 }}
                          className="h-full bg-success rounded-full" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
                      </div>
                      <div className="text-[8px] font-black text-success w-8 text-right">{Math.round(skill.importance * 100)}%</div>
                      <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                    </div>
                  ))}
                  {gap.missing.slice(0, 6).map(skill => (
                    <div key={skill.skill} className="flex items-center gap-2">
                      <div className="w-20 text-[9px] font-black text-white/20 truncate capitalize">{skill.skill}</div>
                      <div className="flex-1 h-1 bg-white/5 rounded-full" />
                      <div className="text-[8px] font-black text-white/15 w-8 text-right">{Math.round(skill.importance * 100)}%</div>
                      <XCircle className="w-3 h-3 text-danger/30 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched skills */}
              <div className="glass-card-premium border-white/5 flex-shrink-0">
                <h3 className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-success" /> Your Matching Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map(s => (
                    <span key={s} className="px-2 py-1 rounded-lg bg-success/5 text-success border border-success/12 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-success" /> {capitalize(s)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'gaps' && (
            <motion.div key="gaps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">

              {/* Time estimate bar */}
              <div className="glass-card-premium !p-3 border-warning/15 bg-warning/[0.04] flex items-center gap-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-warning/50 uppercase tracking-widest">Estimated Time to Close All Gaps</div>
                  <div className="text-xl font-black text-warning leading-none mt-0.5">~{totalWeeks} weeks</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[8px] text-white/20 font-bold">{criticalMissing.length} critical</div>
                  <div className="text-[8px] text-white/20 font-bold">{importantMissing.length} important</div>
                  <div className="text-[8px] text-white/20 font-bold">{niceMissing.length} optional</div>
                </div>
              </div>

              {criticalMissing.length > 0 && (
                <div className="glass-card-premium border-danger/12 bg-danger/[0.03] flex-shrink-0">
                  <h3 className="text-[9px] font-black text-danger uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" /> Critical — Required
                  </h3>
                  <div className="space-y-2">
                    {criticalMissing.map(s => <SkillRow key={s.skill} skill={s} resource={learningResources[s.skill]} type="critical" />)}
                  </div>
                </div>
              )}

              {importantMissing.length > 0 && (
                <div className="glass-card-premium border-warning/12 bg-warning/[0.03] flex-shrink-0">
                  <h3 className="text-[9px] font-black text-warning uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                    <Star className="w-3 h-3" /> Important — Recommended
                  </h3>
                  <div className="space-y-2">
                    {importantMissing.map(s => <SkillRow key={s.skill} skill={s} resource={learningResources[s.skill]} type="important" />)}
                  </div>
                </div>
              )}

              {niceMissing.length > 0 && (
                <div className="glass-card-premium border-white/5 flex-shrink-0">
                  <h3 className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Optional — Nice to Have
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {niceMissing.map(s => (
                      <span key={s.skill} className="px-2 py-1 rounded-lg bg-white/5 text-white/25 border border-white/5 text-[9px] font-black uppercase">
                        {capitalize(s.skill)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'roadmap' && (
            <motion.div key="rm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">

              {gap.roadmap.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="glass-card-premium border-success/20 bg-success/5 !p-10 text-center max-w-sm">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-xl font-black mb-2 text-success">Excellent Match!</h3>
                    <p className="text-white/30 text-xs font-medium">You already have all key skills. Focus on building projects to stand out.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="glass-card-premium !p-3 border-primary/15 bg-primary/[0.04] flex items-center gap-3 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-[8px] font-black text-primary/50 uppercase tracking-widest">Your Personalized Roadmap</div>
                      <div className="text-xs font-bold text-white/50">{gap.roadmap.length} phases · ~{totalWeeks} weeks to {role.name}-ready</div>
                    </div>
                  </div>

                  {gap.roadmap.map((phase, idx) => (
                    <div key={idx} className="glass-card-premium border-white/5 flex-shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          idx === 0 ? 'bg-danger/15 text-danger border border-danger/20' :
                          idx === 1 ? 'bg-warning/15 text-warning border border-warning/20' :
                          'bg-white/5 text-white/30 border border-white/8'
                        }`}>{phase.phase}</div>
                        <div className="flex-1">
                          <div className="font-black text-xs">{phase.title}</div>
                          <div className="text-[8px] font-black text-white/25 uppercase tracking-widest">{phase.duration}</div>
                        </div>
                        <div className="text-[7px] font-black text-white/15 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded-md">{phase.skills.length} skills</div>
                      </div>
                      <div className="space-y-2">
                        {phase.skills.map(skill => {
                          const res = learningResources[skill.name] || skill.resource;
                          return (
                            <div key={skill.name} className="flex items-center gap-2 group">
                              <div className="w-4 h-4 rounded-md bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0">
                                <div className="w-1 h-1 rounded-full bg-white/15" />
                              </div>
                              <span className="flex-1 text-[10px] font-black text-white/60 capitalize">{skill.name}</span>
                              {res?.est && <span className="text-[8px] text-white/15 font-bold">{res.est}</span>}
                              {res?.url && (
                                <a href={res.url} target="_blank" rel="noopener noreferrer"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md hover:bg-primary/20">
                                  Learn <ExternalLink className="w-2 h-2" />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkillRow({ skill, resource, type }) {
  const bar = { critical: 'bg-danger', important: 'bg-warning', nice: 'bg-white/20' }[type];
  const label = { critical: 'text-danger', important: 'text-warning', nice: 'text-white/25' }[type];
  return (
    <div className="flex items-center gap-2 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-black text-white/60 capitalize">{skill.skill}</span>
          <span className={`text-[7px] font-black uppercase tracking-widest ${label} opacity-60`}>{skill.level}</span>
        </div>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${skill.importance * 100}%` }}
            transition={{ duration: 0.7 }} className={`h-full ${bar} rounded-full opacity-70`} />
        </div>
      </div>
      <div className="text-[8px] font-black text-white/15 whitespace-nowrap">{resource?.est || '2 wks'}</div>
      {resource?.url && (
        <a href={resource.url} target="_blank" rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md hover:bg-primary/20">
          Start <ExternalLink className="w-2 h-2" />
        </a>
      )}
    </div>
  );
}
