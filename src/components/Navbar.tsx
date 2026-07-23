import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  Award, 
  Sparkles, 
  MessageSquare, 
  Flame,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Screen, UserProgress } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  onSelectScreen: (screen: Screen) => void;
  progress: UserProgress;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onSelectScreen, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lectures' as Screen, label: 'Lectures', icon: BookOpen },
    { id: 'flashcards' as Screen, label: 'Flashcards', icon: CreditCard },
    { id: 'quiz' as Screen, label: 'ECG Quiz', icon: Award },
    { id: 'ai-assistant' as Screen, label: 'AI Analyzer', icon: Sparkles },
    { id: 'chat' as Screen, label: 'Mentor Chat', icon: MessageSquare },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (lg screen) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectScreen('dashboard')}
            className="flex items-center gap-3 text-teal-400 font-bold text-lg mb-8 tracking-tight cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-200 shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base block tracking-tight">ECG Mentor AI</span>
              <span className="text-[10px] text-teal-400/80 font-mono tracking-widest uppercase block">Clinical Suite</span>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-500/10 text-white border border-teal-500/20 shadow-sm font-bold'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Footer / System Status Box */}
        <div className="mt-auto p-6 space-y-3">
          <button
            onClick={() => onSelectScreen('ai-assistant')}
            className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Quick ECG Analysis</span>
          </button>

          <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/80 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center justify-between">
              <span>Status</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-400" />
                {progress.streakDays}d
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-200">System Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR (sm & md screen) */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => onSelectScreen('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-white text-sm">ECG Mentor AI</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {progress.streakDays}d
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-900/95 p-3 space-y-1 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition ${
                    isActive
                      ? 'bg-teal-500/10 text-white border border-teal-500/20 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};

