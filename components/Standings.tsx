
import React from 'react';
import { Player } from '../types';
import { Trophy } from 'lucide-react';

interface StandingsProps {
  players: Player[];
  onPlayerClick: (playerId: string) => void;
}

const Standings: React.FC<StandingsProps> = ({ players, onPlayerClick }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-slate-800 shadow-lg border border-slate-700">
      
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider leading-none">
              <th className="px-2 py-2 font-medium text-center w-8">#</th>
              <th className="px-2 py-2 font-medium">Oyuncu</th>
              <th className="px-1 py-2 font-medium text-center w-8">O</th>
              <th className="px-1 py-2 font-medium text-center text-green-400 w-8">G</th>
              <th className="px-1 py-2 font-medium text-center text-red-400 w-8">M</th>
              <th className="px-1 py-2 font-medium text-center w-10">Av</th>
              <th className="px-2 py-2 font-medium text-right text-white w-10">P</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {players.map((player, index) => {
                const av = player.stats.legsWon - player.stats.legsLost;
                return (
                  <tr key={player.id} className="hover:bg-slate-700/50 transition-colors text-sm">
                    <td className="px-2 py-1.5 text-center">
                      <div className={`
                        flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs mx-auto
                        ${index === 0 ? 'bg-yellow-500 text-yellow-950' : 
                          index === 1 ? 'bg-slate-300 text-slate-900' : 
                          index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-500'}
                      `}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-2 py-1.5 font-medium text-slate-200">
                      <div 
                        className="cursor-pointer hover:text-emerald-400 transition-colors truncate max-w-[130px] sm:max-w-none"
                        onClick={() => onPlayerClick(player.id)}
                        title={player.name}
                      >
                        {player.name}
                      </div>
                    </td>
                    <td className="px-1 py-1.5 text-center text-slate-500">{player.stats.played}</td>
                    <td className="px-1 py-1.5 text-center text-green-400 font-medium">{player.stats.won}</td>
                    <td className="px-1 py-1.5 text-center text-red-400 font-medium">{player.stats.lost}</td>
                    <td className="px-1 py-1.5 text-center text-slate-400 font-mono text-xs">
                      {av > 0 ? `+${av}` : av}
                    </td>
                    <td className="px-2 py-1.5 text-right font-bold text-slate-100">{player.stats.points}</td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standings;
