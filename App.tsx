import React, { useEffect, useState } from 'react';
import { Tab, LeagueData } from './types';
import { loadLeagueData, recalculateStandings } from './utils/mockData';
import Standings from './components/Standings';
import Schedule from './components/Schedule';
import PlayerDetail from './components/PlayerDetail';
import { LayoutDashboard, CalendarDays, Target } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STANDINGS);
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

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
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    );
  }

  const selectedPlayer = selectedPlayerId ? leagueData.players.find(p => p.id === selectedPlayerId) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Metak 2025-2026
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Kış Dart Ligi</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-2 items-center">
              <button
                onClick={() => switchTab(Tab.STANDINGS)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeTab === Tab.STANDINGS && !selectedPlayerId ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Puan Durumu
              </button>
              <button
                onClick={() => switchTab(Tab.SCHEDULE)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${activeTab === Tab.SCHEDULE && !selectedPlayerId ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                <CalendarDays className="w-4 h-4" />
                Fikstür & Sonuçlar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-4 pb-safe">
        <div className="flex justify-around py-3">
          <button onClick={() => switchTab(Tab.STANDINGS)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.STANDINGS ? 'text-emerald-400' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">Puan Durumu</span>
          </button>
          <button onClick={() => switchTab(Tab.SCHEDULE)} className={`flex flex-col items-center gap-1 ${activeTab === Tab.SCHEDULE ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CalendarDays className="w-6 h-6" />
            <span className="text-[10px] font-medium">Fikstür</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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