import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Target, FileText, BarChart2, ChevronLeft, LogOut, Settings, User, LogIn, ChevronUp, Shield, Bell, Moon, ExternalLink } from 'lucide-react';
import CareerMatch from './pages/CareerMatch';
import JobMatch from './pages/JobMatch';
import SkillInsights from './pages/SkillInsights';
import AIOrb from './components/AIOrb';

const pageVariants = {
  initial: { opacity: 0, filter: 'blur(10px)', scale: 0.98 },
  animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  exit:    { opacity: 0, filter: 'blur(10px)', scale: 1.02 }
};

const menuItems = [
  { icon: User,     label: 'My Profile',      sub: 'View & edit profile',    color: 'text-white/60' },
  { icon: Settings, label: 'Preferences',     sub: 'Theme & display',        color: 'text-white/60' },
  { icon: Bell,     label: 'Notifications',   sub: '3 unread alerts',        color: 'text-primary'  },
  { icon: Shield,   label: 'Privacy',         sub: 'Data & security',        color: 'text-white/60' },
];

function UserDropdown({ isOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-full left-0 right-0 mb-2 z-50"
        >
          <div className="bg-[#080c18] border border-white/10 rounded-2xl overflow-hidden shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 border border-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-black">Alex Chen</div>
                  <div className="text-[9px] text-white/30 font-bold">alex@skillmap.ai</div>
                </div>
                <div className="ml-auto px-2 py-0.5 rounded-md bg-success/10 border border-success/20 text-[8px] font-black text-success uppercase tracking-widest">Pro</div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all group text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/15 transition-colors">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-black text-white/70 group-hover:text-white transition-colors">{item.label}</div>
                      <div className="text-[9px] text-white/20 font-bold">{item.sub}</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mx-3" />

            {/* Auth Actions */}
            <div className="p-2 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all group text-left">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-primary/20 transition-colors">
                  <LogIn className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-black text-primary">Switch Account</div>
                  <div className="text-[9px] text-white/20 font-bold">Login with another account</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger/5 border border-transparent hover:border-danger/10 transition-all group text-left">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-danger/20 group-hover:bg-danger/5 transition-colors">
                  <LogOut className="w-3.5 h-3.5 text-danger/60 group-hover:text-danger transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-black text-danger/60 group-hover:text-danger transition-colors">Sign Out</div>
                  <div className="text-[9px] text-white/20 font-bold">End session</div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px] text-white/15 font-bold">SkillMap AI v2.0</span>
              <span className="text-[8px] text-white/15 font-bold">© 2025</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('career-match');
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 2000);
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const tabs = [
    { id: 'career-match',   label: 'Match Engine',  icon: Target    },
    { id: 'job-match',      label: 'Resume Sync',   icon: FileText  },
    { id: 'skill-insights', label: 'Intelligence',  icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen w-full bg-[#02040a] overflow-hidden">
      {/* Neural Link Loading */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] bg-[#02040a] flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-[0_0_50px_rgba(124,58,237,0.4)]"
            >
              🧠
            </motion.div>
            <div className="flex flex-col items-center gap-3">
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Establishing Neural Link</div>
              <div className="w-44 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="noise-overlay" />

      {/* Ambient Background */}
      <div className="ambient-bg">
        <AIOrb />
        <div className="aurora" />
        <div className="particles" />
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-64 m-4 mr-0 h-[calc(100vh-2rem)] border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col z-20 relative rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-visible"
      >
        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/8 to-transparent rounded-t-3xl pointer-events-none" />

        {/* Logo */}
        <div className="p-5 pb-4 relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <motion.div whileHover={{ scale: 1.08, rotate: 5 }} whileTap={{ scale: 0.92 }} className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary/30">🧠</div>
              <div className="absolute -inset-1.5 bg-gradient-to-br from-primary to-secondary rounded-xl blur-xl opacity-20" />
            </motion.div>
            <div>
              <h1 className="font-black text-base tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-none">
                SkillMap <span className="text-primary italic">AI</span>
              </h1>
              <div className="text-[8px] font-black tracking-[0.25em] text-primary/50 uppercase mt-0.5">Neural Interface</div>
            </div>
          </div>

          {/* Nav */}
          <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 px-2">System Core</div>
          <nav className="flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive ? 'text-white' : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarBg"
                      className="absolute inset-0 bg-white/[0.04] border border-white/8 rounded-xl"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarGlow"
                      className="absolute -left-0.5 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_12px_var(--primary)]"
                    />
                  )}
                  <div className="relative flex-shrink-0">
                    <Icon className={`w-4 h-4 relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-white/60'}`} />
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute inset-0 bg-primary/30 blur-md rounded-full"
                      />
                    )}
                  </div>
                  <span className="relative z-10 font-black tracking-widest text-[10px] uppercase">{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Card + Dropdown */}
        <div className="mt-auto p-4 relative z-10">
          <div className="h-px bg-white/5 mb-3" />

          {/* Dropdown sits ABOVE the card */}
          <div className="relative">
            <UserDropdown isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} />

            {/* User Card — click to toggle dropdown */}
            <motion.button
              onClick={() => setUserMenuOpen(v => !v)}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                userMenuOpen ? 'border-white/15 bg-white/[0.04]' : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/10 border border-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/50" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-[#02040a] shadow-[0_0_8px_var(--success)]"
                />
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="text-[11px] font-black text-white/80 truncate">Alex Chen</div>
                <div className="text-[8px] text-white/25 font-black uppercase tracking-widest truncate">System Architect</div>
              </div>
              <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronUp className="w-3.5 h-3.5 text-white/20" />
              </motion.div>
            </motion.button>
          </div>

          {/* Exit */}
          <motion.a
            href="index.html"
            whileHover={{ x: -3 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black text-white/20 hover:text-white/60 transition-all group tracking-[0.25em] uppercase w-full mt-1"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-primary group-hover:-translate-x-0.5 transition-transform" />
            Exit Sync
          </motion.a>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 h-screen overflow-hidden relative z-0 p-4 pl-3">
        <div className="h-full w-full rounded-3xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              {activeTab === 'career-match'   && <CareerMatch   lastAnalysis={lastAnalysis} setLastAnalysis={setLastAnalysis} />}
              {activeTab === 'job-match'      && <JobMatch />}
              {activeTab === 'skill-insights' && <SkillInsights lastAnalysis={lastAnalysis} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Cursor glow */}
      <div
        className="fixed w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
        style={{ left: 'var(--mouse-x)', top: 'var(--mouse-y)' }}
      />
    </div>
  );
}

export default App;
