import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchRing from '../components/MatchRing';
import AnimatedNumber from '../components/AnimatedNumber';
import { MLEngine } from '../../ml-engine.js';
import { extractTextFromFile } from '../utils/pdfParser';
import { fetchTextFromUrl } from '../utils/urlScraper';
import { Upload, Link as LinkIcon, Loader2, Sparkles, FileText, Zap, ChevronRight, RefreshCw, Crosshair, Target, AlertCircle } from 'lucide-react';

export default function JobMatch() {
  const [resume, setResume]         = useState('');
  const [jd, setJd]                 = useState('');
  const [jobUrl, setJobUrl]         = useState('');
  const [analyzing, setAnalyzing]   = useState(false);
  const [isParsing, setIsParsing]   = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [result, setResult]         = useState(null);
  const [activeTab, setActiveTab]   = useState('matched');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleCompare = () => {
    if (!resume.trim() || !jd.trim()) return;
    setAnalyzing(true); setResult(null);
    setTimeout(() => {
      setResult(MLEngine.resumeJobMatch(resume, jd));
      setAnalyzing(false); setActiveTab('matched');
    }, 1800);
  };

  const handleClear = () => { setResume(''); setJd(''); setJobUrl(''); setResult(null); };

  const handleSample = () => {
    setResume(`Senior Full Stack Developer with 5+ years experience. 
Expertise in React, Node.js, and TypeScript. 
Extensive work with AWS (S3, Lambda, EC2), PostgreSQL, and Redis.
Built scalable microservices and led a team of 4 developers.
Strong focus on CI/CD (GitHub Actions), Docker, and Kubernetes.
Familiar with Python, Django, and Machine Learning concepts.`);
    setJd(`We are looking for a Senior Software Engineer to join our core team.
Requirements:
- 5+ years of professional software development experience.
- Strong proficiency in React.js and modern JavaScript (ES6+).
- Experience with backend technologies like Node.js or Python.
- Working knowledge of cloud platforms (AWS preferred).
- Experience with SQL databases (PostgreSQL) and NoSQL (Redis).
- Passion for building scalable, high-performance systems.`);
    setResult(null);
  };

  const handleFile = async (file) => {
    console.log('File selected:', file?.name, file?.type);
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt', 'docx'].includes(ext)) {
      console.warn('Unsupported extension:', ext);
      setUploadError('Only PDF, TXT, or DOCX files are supported.');
      setTimeout(() => setUploadError(''), 4000);
      return;
    }
    setIsParsing(true);
    setUploadError('');
    try {
      console.log('Parsing file...');
      const text = await extractTextFromFile(file);
      console.log('Parse successful, length:', text.length);
      setResume(text);
    } catch (err) {
      console.error('File parse error:', err);
      setUploadError('Could not read file. Try copy-pasting the text instead.');
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setIsParsing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUrl = async () => {
    if (!jobUrl.trim()) return;
    setIsFetching(true);
    try { setJd(await fetchTextFromUrl(jobUrl)); }
    catch { alert('Failed to fetch URL.'); }
    finally { setIsFetching(false); }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">Precision <span className="text-secondary italic">Sync</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[8px] font-black text-white/30 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded-md">
                <Target className="w-2.5 h-2.5 text-secondary" /> ATS Optimized
              </span>
              <span className="text-[8px] font-black text-white/25 uppercase tracking-widest">Cross-Entropy Matcher</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSample} className="btn-primary !py-2 !px-4 !text-xs bg-white/5 border-white/10 hover:bg-white/10 flex items-center gap-1.5 !text-white/60 hover:!text-white">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Try Sample
          </button>
          <button onClick={handleClear} className="btn-secondary !py-2 !px-4 !text-xs border-white/5 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <div className="glass-card !p-2 !px-3 flex items-center gap-2 !rounded-xl border-white/5">
            <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-secondary" />
            </div>
            <div>
              <div className="text-[7px] font-black text-white/25 uppercase tracking-widest">Efficiency</div>
              <div className="text-sm font-black text-secondary leading-none">99.1%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={`flex-1 grid gap-3 min-h-0 ${result ? 'grid-cols-12' : 'grid-cols-1'}`}>

        {/* Inputs */}
        <div className={`${result ? 'col-span-5' : 'grid grid-cols-2 gap-3'} flex flex-col gap-3`}>
          <div className={`${result ? '' : 'contents'}`}>
            {/* Resume input */}
            <div
              className={`glass-card-premium flex flex-col border-white/5 min-h-0 transition-all ${isDragging ? 'border-secondary/50 bg-secondary/5' : ''}`}
              style={result ? { flex: 1 } : {}}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-secondary" /> Resume
                </h2>
                <div className="flex items-center gap-1.5">
                  {uploadError && (
                    <span className="text-[8px] text-danger font-bold flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" /> {uploadError}
                    </span>
                  )}
                  <input type="file" accept=".pdf,.txt,.docx" className="hidden" ref={fileRef} onChange={handleFileInput} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-[8px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-md flex items-center gap-1 hover:bg-secondary/20 transition-colors border border-secondary/20"
                    title="Upload PDF, TXT, or DOCX"
                  >
                    {isParsing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Upload className="w-2.5 h-2.5" />}
                    {isParsing ? 'Reading...' : 'UPLOAD FILE'}
                  </button>
                  {resume && (
                    <button onClick={() => setResume('')} className="text-[8px] font-black text-white/20 hover:text-danger px-1">✕</button>
                  )}
                </div>
              </div>
              {!resume && !isParsing && (
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 mb-2 py-4 rounded-xl border border-dashed cursor-pointer transition-all ${
                    isDragging ? 'border-secondary/60 bg-secondary/5' : 'border-white/8 hover:border-secondary/30 hover:bg-white/[0.01]'
                  }`}
                >
                  <Upload className="w-5 h-5 text-white/20" />
                  <div className="text-[9px] font-black text-white/25 uppercase tracking-widest">Drop file or click to upload</div>
                  <div className="text-[8px] text-white/15 font-bold">PDF · TXT · DOCX</div>
                </div>
              )}
              <textarea value={resume} onChange={e => setResume(e.target.value)}
                className="neo-input flex-1 min-h-0 !p-3 text-[11px]"
                placeholder="Or paste your resume text here..." />
            </div>

            {/* JD input */}
            <div className="glass-card-premium flex flex-col border-white/5 min-h-0" style={result ? { flex: 1 } : {}}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <LinkIcon className="w-3 h-3 text-primary" /> Target JD
                </h2>
                <div className="flex gap-1">
                  {!jobUrl && (
                    <button 
                      onClick={() => setJobUrl('https://careers.google.com/jobs/results/')}
                      className="text-[7px] font-black text-white/20 hover:text-primary transition-colors px-1"
                    >
                      Try URL
                    </button>
                  )}
                  <input type="url" value={jobUrl} onChange={e => setJobUrl(e.target.value)}
                    className="bg-white/5 border border-white/8 rounded-lg px-2 py-0.5 text-[8px] text-white focus:border-primary/40 outline-none w-24"
                    placeholder="Import URL..." />
                  <button onClick={handleUrl}
                    className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center hover:bg-primary/20 transition-colors border border-primary/20">
                    {isFetching ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : 'FETCH'}
                  </button>
                </div>
              </div>
              <textarea value={jd} onChange={e => setJd(e.target.value)}
                className="neo-input flex-1 min-h-0 !p-3 text-[11px]"
                placeholder="Paste job description here..." />
            </div>
          </div>

          <button
            className={`btn-primary w-full !py-3 group flex-shrink-0 transition-all duration-500 ${
              !resume.trim() || !jd.trim() ? 'opacity-50 grayscale' : 'hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.01]'
            }`}
            onClick={handleCompare}
            disabled={analyzing || !resume.trim() || !jd.trim()}
            style={{ 
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              boxShadow: !resume.trim() || !jd.trim() ? 'none' : '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            {(!resume.trim() || !jd.trim()) === false && !analyzing && (
              <motion.div
                layoutId="btnGlow"
                className="absolute inset-0 bg-white/10 rounded-xl"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            <span className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
              {analyzing ? 'Quantifying...' : 'Execute Semantic Sync'}
              <ChevronRight className={`w-4 h-4 ${analyzing ? 'animate-spin' : 'group-hover:translate-x-0.5 transition-transform'}`} />
            </span>
          </button>
        </div>

        {/* Results */}
        {result && !analyzing && (
          <div className="col-span-7 flex flex-col gap-3 min-h-0">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 flex-shrink-0">
              <div className="glass-card-premium !p-3 flex flex-col items-center border-white/5 bg-secondary/[0.04]">
                <MatchRing score={result.score} size={72} strokeWidth={5} color="#06b6d4" />
                <div className="text-[8px] font-black text-white/25 uppercase tracking-widest mt-1">Match Quality</div>
              </div>
              <div className="glass-card-premium !p-3 flex flex-col items-center justify-center border-white/5">
                <div className="text-3xl font-black text-success mb-0.5">{result.overlapCount}</div>
                <div className="text-[8px] font-black text-white/25 uppercase tracking-widest text-center">Keywords Found</div>
                <div className="text-[7px] font-bold text-white/15 mt-0.5">of {result.totalJDSkills}</div>
              </div>
              <div className="glass-card-premium !p-3 flex flex-col items-center justify-center border-white/5">
                <div className="text-3xl font-black text-danger mb-0.5">{result.missingKeywords.length}</div>
                <div className="text-[8px] font-black text-white/25 uppercase tracking-widest text-center">Critical Gaps</div>
                <div className="text-[7px] font-bold text-white/15 mt-0.5">{result.coveragePercent}% Coverage</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card-premium flex flex-col flex-1 min-h-0 border-white/5">
              <div className="flex border-b border-white/5 flex-shrink-0">
                {[
                  { id: 'matched',     label: 'Matched',  count: result.matchedKeywords.length,  color: 'text-success' },
                  { id: 'missing',     label: 'Gaps',     count: result.missingKeywords.length,   color: 'text-danger'  },
                  { id: 'suggestions', label: 'Insights', count: result.suggestions.length,       color: 'text-secondary'},
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === t.id ? 'text-white bg-white/[0.03]' : 'text-white/25 hover:text-white/50'}`}>
                    <span className={activeTab === t.id ? t.color : ''}>{t.label}</span>
                    <span className="ml-1 opacity-30 text-[7px]">({t.count})</span>
                    {activeTab === t.id && <motion.div layoutId="jobTab" className="absolute bottom-0 left-0 right-0 h-px bg-secondary" />}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'matched' && (
                    <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords.map(k => (
                        <span key={k} className="px-2 py-1 rounded-lg bg-success/5 text-success border border-success/10 text-[9px] font-black uppercase flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-success" /> {k}
                        </span>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 'missing' && (
                    <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {Object.entries(result.missingByCluster).map(([cluster, skills]) => (
                        <div key={cluster}>
                          <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                            {cluster} <div className="h-px flex-1 bg-white/5" />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map(s => (
                              <span key={s} className="px-2 py-1 rounded-lg bg-danger/5 text-danger border border-danger/10 text-[9px] font-black uppercase flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-danger opacity-50" /> {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 'suggestions' && (
                    <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="glass-card-premium !p-4 border-white/5 hover:border-white/12 transition-all group">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{s.icon}</div>
                            <div className="font-black text-[10px] uppercase tracking-wider leading-tight">{s.title}</div>
                          </div>
                          <p className="text-white/25 text-[9px] font-medium mb-3 leading-relaxed">{s.description}</p>
                          <div className="space-y-1">
                            {s.actions.slice(0, 2).map((act, j) => (
                              <div key={j} className="flex items-start gap-1.5 text-[9px] font-bold text-white/40">
                                <div className="w-1 h-1 rounded-full bg-secondary mt-1.5 flex-shrink-0" /> {act}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {analyzing && (
          <div className="col-span-7 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl border-2 border-secondary/20 border-t-secondary animate-spin" />
              <div className="absolute inset-4 rounded-xl border-2 border-primary/20 border-b-primary animate-spin-reverse" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
            </div>
            <h3 className="text-lg font-black">Processing Matrix</h3>
            <p className="text-white/25 text-[9px] font-bold uppercase tracking-[0.3em] animate-pulse mt-1">Running semantic comparison...</p>
          </div>
        )}

        {/* Empty state when no result */}
        {!result && !analyzing && (
          <div className="flex items-center justify-center">
            <div className="glass-card-premium !p-10 max-w-sm text-center border-white/5 bg-white/[0.01]">
              <div className="text-4xl mb-4 opacity-30">📡</div>
              <h3 className="text-xl font-black mb-2 uppercase italic">Ready for <span className="text-secondary">Analysis</span></h3>
              <p className="text-white/25 text-xs font-medium leading-relaxed">Paste your resume and a job description, then click Sync to see keyword matches, gaps, and improvement tips.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
