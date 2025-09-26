import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface PredictedMatch {
  id: number;
  home_team: string;
  away_team: string;
}

interface MatchSelectorProps {
  matches: PredictedMatch[];
  teams: string[];
  onUpdateMatch: (matchId: number, side: 'home' | 'away', team: string) => void;
  onClearMatch: (matchId: number) => void;
}

export const MatchSelector = ({ matches, teams, onUpdateMatch, onClearMatch }: MatchSelectorProps) => {
  const getUsedTeams = () => {
    const used = new Set<string>();
    matches.forEach(match => {
      if (match.home_team) used.add(match.home_team);
      if (match.away_team) used.add(match.away_team);
    });
    return used;
  };

  const getAvailableTeams = (currentMatchId: number, side: 'home' | 'away') => {
    const usedTeams = getUsedTeams();
    const currentMatch = matches.find(m => m.id === currentMatchId);
    
    return teams.filter(team => {
      if (usedTeams.has(team)) {
        if (side === 'home' && team === currentMatch?.home_team) return true;
        if (side === 'away' && team === currentMatch?.away_team) return true;
        return false;
      }
      if (side === 'home' && team === currentMatch?.away_team) return false;
      if (side === 'away' && team === currentMatch?.home_team) return false;
      return true;
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          Csapat párosító
        </h3>
        <p className="text-sm text-white/60">Válassz ki legfeljebb 8 mérkőzést az elemzéshez</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="glass-card border-white/10 hover:border-emerald-400/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/10">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    match.home_team && match.away_team 
                      ? 'bg-emerald-400 text-black' 
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {match.id}
                  </div>
                  <h4 className="text-sm font-medium text-white/90">
                    Mérkőzés
                  </h4>
                </div>
                {(match.home_team || match.away_team) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClearMatch(match.id)}
                    className="text-white/60 hover:text-white p-1.5 h-auto hover:bg-red-500/20 rounded-full transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-emerald-400 mb-2 block font-bold uppercase tracking-wider">
                    HAZAI
                  </label>
                  <Select
                    value={match.home_team}
                    onValueChange={(value) => onUpdateMatch(match.id, 'home', value)}
                  >
                    <SelectTrigger className="bg-background/60 border-white/20 text-white backdrop-blur-sm h-12 text-sm touch-manipulation hover:border-emerald-400/30 transition-colors">
                      <SelectValue placeholder="Válassz hazai csapatot" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-white/20 z-[60] max-h-60">
                      {getAvailableTeams(match.id, 'home').map((team) => (
                        <SelectItem 
                          key={team} 
                          value={team} 
                          className="text-white hover:bg-emerald-400/20 focus:bg-emerald-400/20 py-3 px-4 text-sm cursor-pointer transition-colors"
                        >
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-orange-400 mb-2 block font-bold uppercase tracking-wider">
                    VENDÉG
                  </label>
                  <Select
                    value={match.away_team}
                    onValueChange={(value) => onUpdateMatch(match.id, 'away', value)}
                  >
                    <SelectTrigger className="bg-background/60 border-white/20 text-white backdrop-blur-sm h-12 text-sm touch-manipulation hover:border-orange-400/30 transition-colors">
                      <SelectValue placeholder="Válassz vendég csapatot" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-white/20 z-[60] max-h-60">
                      {getAvailableTeams(match.id, 'away').map((team) => (
                        <SelectItem 
                          key={team} 
                          value={team} 
                          className="text-white hover:bg-orange-400/20 focus:bg-orange-400/20 py-3 px-4 text-sm cursor-pointer transition-colors"
                        >
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};