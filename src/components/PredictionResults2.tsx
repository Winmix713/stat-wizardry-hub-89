import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp, Target, BarChart3 } from "lucide-react";
import type { MatchStats } from "@/lib/supabase";

// Add the extended type definition for prediction quality
interface ExtendedMatchStats extends MatchStats {
  prediction_quality?: {
    home_qualified: boolean;
    away_qualified: boolean;
    draw_highlighted: boolean;
    btts_qualified: boolean;
    confidence_level: number;
    recommendation: string;
    confidence: string;
  };
}

interface PredictedMatch {
  id: number;
  home_team: string;
  away_team: string;
}

interface PredictionResultsProps {
  predictions: { match: PredictedMatch; stats: ExtendedMatchStats | null }[];
}

export const PredictionResults = ({ predictions }: PredictionResultsProps) => {
  if (predictions.length === 0) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with criteria info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg sm:text-xl font-semibold text-white">Predikciós eredmények</h3>
        </div>
        
        <div className="text-sm text-white/70 mb-4">
          Elemzés a kiválasztott csapatok egymás elleni mérkőzései alapján
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {predictions.map(({ match, stats }, index) => (
          <Card key={index} className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group">
            <CardContent className="p-4 sm:p-6">
              {/* Match header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white text-base sm:text-lg truncate">
                    {match.home_team}
                  </h4>
                  <div className="text-white/60 text-sm font-medium">VS</div>
                  <h4 className="font-semibold text-white text-base sm:text-lg truncate">
                    {match.away_team}
                  </h4>
                </div>
                
                {stats?.prediction_quality && (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    {stats.prediction_quality.confidence_level >= 65 ? (
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    ) : stats.prediction_quality.confidence_level >= 50 ? (
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-white/90">
                      {Math.round(stats.prediction_quality.confidence_level)}%
                    </span>
                  </div>
                )}
              </div>
              
              {stats ? (
                <div className="space-y-4">
                  {/* 1x2 Results Section */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h5 className="text-sm font-semibold text-white mb-3">1x2 Eredmények ({stats.total_matches} közös mérkőzésből)</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{stats.home_wins}</div>
                        <div className="text-xs text-white/70">Hazai győzelem</div>
                        <div className="text-sm text-emerald-400 font-medium">{stats.home_win_percentage}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{stats.draws}</div>
                        <div className="text-xs text-white/70">Döntetlen</div>
                        <div className="text-sm text-yellow-400 font-medium">{stats.draw_percentage}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{stats.away_wins}</div>
                        <div className="text-xs text-white/70">Vendég győzelem</div>
                        <div className="text-sm text-blue-400 font-medium">{stats.away_win_percentage}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Goal Averages */}
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h5 className="text-sm font-semibold text-white mb-3">Gól átlagok (közös mérkőzések)</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-emerald-400">{stats.home_avg_goals}</div>
                        <div className="text-xs text-white/70">{match.home_team} átlaga</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">{stats.away_avg_goals}</div>
                        <div className="text-xs text-white/70">{match.away_team} átlaga</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-lg font-bold text-white">{stats.avg_goals}</div>
                      <div className="text-xs text-white/70">Összes gól átlaga mérkőzésenként</div>
                    </div>
                  </div>

                  {/* BTTS and Comeback Statistics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.btts_count}</div>
                      <div className="text-xs text-white/70 mb-1">BTTS mérkőzés</div>
                      <div className="text-sm text-purple-400 font-medium">{stats.btts_percentage}%</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                      <div className="text-lg font-bold text-orange-400">{stats.comeback_count}</div>
                      <div className="text-xs text-white/70 mb-1">Fordítás</div>
                      <div className="text-sm text-orange-400 font-medium">{stats.comeback_percentage}%</div>
                    </div>
                  </div>

                  {/* Top 3 Most Frequent Results */}
                  {stats.most_frequent_results && stats.most_frequent_results.length > 0 && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Leggyakoribb 3 eredmény
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {stats.most_frequent_results.slice(0, 3).map((result, idx) => (
                          <div key={idx} className="bg-white/10 p-3 rounded text-center border border-white/20">
                            <div className="text-lg font-bold text-white mb-1">{result.score}</div>
                            <div className="text-xs text-white/70">{result.count}x ({result.percentage}%)</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Stats */}
                  <div className="bg-white/5 p-3 rounded border border-white/10">
                    <div className="text-sm text-white/80 text-center">
                      <span className="font-medium">Félidő/végeredmény eltérés:</span> {stats.halftime_transformations} mérkőzés
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
                  <p className="text-white/70 text-sm">
                    Nincs elegendő adat az elemzéshez
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
