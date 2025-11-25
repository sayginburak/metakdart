import React, { useEffect, useState } from 'react';
import { Tab, LeagueData } from './types';
import { loadLeagueData, recalculateStandings } from './utils/mockData';
import Standings from './components/Standings';
import Schedule from './components/Schedule';
import PlayerDetail from './components/PlayerDetail';
import { LayoutDashboard, CalendarDays, Target, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STANDINGS);
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const [mobileNavHidden, setMobileNavHidden] = useState(false);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        setMobileHeaderHidden(false);
        setMobileNavHidden(false);
        return;
      }

      const nearTop = currentY < 60;
      if (delta > 8 && !nearTop) {
        setMobileHeaderHidden(true);
        setMobileNavHidden(true);
      } else if (delta < -8 || nearTop) {
        setMobileHeaderHidden(false);
        setMobileNavHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Initialize Data
  useEffect(() => {
    const init = async () => {
        const data = await loadLeagueData();
        // Calculate standings from the JSON data
        if (data.players.length > 0) {
            const players = recalculateStandings(data);
            setLeagueData({ ...data, players });
        } else {
             // Handle empty state if load fails
             setLeagueData(data);
        }
    };
    init();
  }, []);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setSelectedPlayerId(null);
  };

  // Helper to switch tabs and clear selection
  const switchTab = (tab: Tab) => {
      setActiveTab(tab);
      setSelectedPlayerId(null);
  };

  if (!leagueData) {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    );
  }

  const selectedPlayer = selectedPlayerId ? leagueData.players.find(p => p.id === selectedPlayerId) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col print:block print:h-auto print:bg-white print:text-black print:min-h-0 transition-colors">
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden transition-all duration-300 ${mobileHeaderHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => { setSelectedPlayerId(null); setActiveTab(Tab.STANDINGS); }}
            >
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Metak 2025-2026
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Kış Dart Ligi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-2 items-center">
                <button
                  onClick={() => switchTab(Tab.STANDINGS)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${activeTab === Tab.STANDINGS && !selectedPlayerId 
                        ? 'bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-slate-700' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Puan Durumu
                </button>
                <button
                  onClick={() => switchTab(Tab.SCHEDULE)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${activeTab === Tab.SCHEDULE && !selectedPlayerId 
                        ? 'bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-slate-700' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Fikstür & Sonuçlar
                </button>
              </nav>

              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Temayı Değiştir"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bottom Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-4 pb-safe print:hidden transition-all duration-300 ${mobileNavHidden ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="flex justify-around py-3">
          <button onClick={() => switchTab(Tab.STANDINGS)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.STANDINGS ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Puan Durumu</span>
          </button>
          <button onClick={() => switchTab(Tab.SCHEDULE)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SCHEDULE ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
            <CalendarDays className="w-6 h-6" />
            <span className="text-[10px] font-medium">Fikstür</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-8 print:p-0 print:m-0 print:w-full print:max-w-none print:block">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print:animate-none">
          {selectedPlayerId && selectedPlayer ? (
             <PlayerDetail 
                player={selectedPlayer} 
                data={leagueData} 
                onBack={handleBackFromDetail} 
                onPlayerClick={handlePlayerClick}
             />
          ) : (
             <>
               {activeTab === Tab.STANDINGS && <Standings players={leagueData.players} onPlayerClick={handlePlayerClick} />}
               {activeTab === Tab.SCHEDULE && <Schedule data={leagueData} onPlayerClick={handlePlayerClick} />}
             </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;