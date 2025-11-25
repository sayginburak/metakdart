
import React, { useState } from 'react';
import { LeagueData } from '../types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleProps {
  data: LeagueData;
  onPlayerClick: (playerId: string) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ data, onPlayerClick }) => {
  // Initialize to the current week defined in data, clamped to valid range.
  // If currentWeek is 2, it means week 1 and 2 are done, so we show index 2 (Week 3).
  const [currentWeekIndex, setCurrentWeekIndex] = useState(() => {
      if (data.schedule.length === 0) return 0;
      return Math.min(data.currentWeek, data.schedule.length - 1);
  });

  const currentWeek = data.schedule[currentWeekIndex];

  if (!currentWeek) {
      return <div className="text-center p-8 text-slate-500">Fikstür verisi bulunamadı.</div>;
  }

  const getPlayerName = (id: string) => data.players.find(p => p.id === id)?.name || "Bilinmiyor";

  // Split matches into 3 rounds (assuming 3 matches per player per week)
  const totalMatches = currentWeek.matches.length;
  const matchesPerRound = Math.ceil(totalMatches / 3);
  
  const rounds = [];
  if (totalMatches > 0) {
      for (let i = 0; i < totalMatches; i += matchesPerRound) {
        rounds.push(currentWeek.matches.slice(i, i + matchesPerRound));
      }
  } else {
      rounds.push([]); // Handle empty weeks gracefully
  }

  return (
    <div className="space-y-6">
      {/* Week Navigator */}
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
        <button 
          onClick={() => setCurrentWeekIndex(prev => Math.max(0, prev - 1))}
          disabled={currentWeekIndex === 0}
          className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-emerald-400" />
        </button>
        
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                {currentWeek.name}
            </h2>
            <span className="text-sm text-emerald-400 font-medium mt-1">
                {currentWeek.date}
            </span>
        </div>

        <button 
          onClick={() => setCurrentWeekIndex(prev => Math.min(data.schedule.length - 1, prev + 1))}
          disabled={currentWeekIndex === data.schedule.length - 1}
          className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-emerald-400" />
        </button>
      </div>

      {/* Matches Rounds */}
      <div className="space-y-8">
        {rounds.map((roundMatches, roundIndex) => (
            <div key={roundIndex} className="animate-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${roundIndex * 100}ms`}}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {roundIndex + 1}. Maçlar
                    </span>
                    <div className="h-px bg-slate-700 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                    {roundMatches.map((match) => {
                        const isFinished = match.isCompleted;
                        // Determine winner style
                        const p1Win = isFinished && match.score1! > match.score2!;
                        const p2Win = isFinished && match.score2! > match.score1!;

                        return (
                            <div key={match.id} className={`
                                flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-200
                                ${isFinished 
                                    ? 'bg-slate-800/60 border-slate-700/50' 
                                    : 'bg-slate-800 border-slate-700 hover:border-emerald-500/30'}
                            `}>
                                {/* Player 1 */}
                                <div 
                                    className={`flex-1 text-right text-sm font-medium truncate cursor-pointer transition-colors ${p1Win ? 'text-green-400' : p2Win ? 'text-red-400/70' : 'text-slate-300 hover:text-emerald-400'}`}
                                    onClick={() => onPlayerClick(match.player1Id)}
                                    title={getPlayerName(match.player1Id)}
                                >
                                    {getPlayerName(match.player1Id)}
                                </div>

                                {/* Score Box */}
                                <div className="mx-3 min-w-[50px] flex justify-center">
                                    {isFinished ? (
                                        <div className="flex items-center gap-1 font-mono font-bold text-sm bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700/50 shadow-sm">
                                            <span className={p1Win ? 'text-green-400' : 'text-slate-400'}>{match.score1}</span>
                                            <span className="text-slate-600">:</span>
                                            <span className={p2Win ? 'text-green-400' : 'text-slate-400'}>{match.score2}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-600">vs</span>
                                    )}
                                </div>

                                {/* Player 2 */}
                                <div 
                                    className={`flex-1 text-left text-sm font-medium truncate cursor-pointer transition-colors ${p2Win ? 'text-green-400' : p1Win ? 'text-red-400/70' : 'text-slate-300 hover:text-emerald-400'}`}
                                    onClick={() => onPlayerClick(match.player2Id)}
                                    title={getPlayerName(match.player2Id)}
                                >
                                    {getPlayerName(match.player2Id)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
