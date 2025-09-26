import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp, Target, BarChart3 } from "lucide-react";
import { memo, useMemo } from "react";
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

// Constants for better maintainability
const CONFIDENCE_THRESHOLDS = {
  HIGH: 65,
  MEDIUM: 50
} as const;

// Helper functions
const getConfidenceIcon = (level: number) => {
  if (level >= CONFIDENCE_THRESHOLDS.HIGH) return CheckCircle;
  if (level >= CONFIDENCE_THRESHOLDS.MEDIUM) return AlertTriangle;
  return AlertTriangle;
};

const getConfidenceIconColor = (level: number) => {
  if (level >= CONFIDENCE_THRESHOLDS.HIGH) return "text-success";
  if (level >= CONFIDENCE_THRESHOLDS.MEDIUM) return "text-warning";
  return "text-destructive";
};

const safeRound = (value: number | undefined | null): number => {
  return Math.round(value ?? 0);
};

export const PredictionResults = memo(({ predictions }: PredictionResultsProps) => {
  // Memoize processed data to avoid recalculation on each render
  const processedPredictions = useMemo(() => {
    return predictions.map(({ match, stats }) => {
      const confidenceLevel = stats?.prediction_quality?.confidence_level ?? 0;
      const ConfidenceIcon = getConfidenceIcon(confidenceLevel);
      const confidenceIconColor = getConfidenceIconColor(confidenceLevel);
      const roundedConfidence = safeRound(confidenceLevel);
      
      return {
        match,
        stats,
        hasValidStats: stats !== null,
        confidenceLevel,
        ConfidenceIcon,
        confidenceIconColor,
        roundedConfidence,
        // Generate unique key for this prediction
        uniqueKey: `${match.id}-${match.home_team}-${match.away_team}`
      };
    });
  }, [predictions]);

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
        {processedPredictions.map((prediction) => {
          const { match, stats, hasValidStats, ConfidenceIcon, confidenceIconColor, roundedConfidence, uniqueKey } = prediction;
          
          return (
            <Card key={uniqueKey} className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group">
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
                      <ConfidenceIcon className={`w-5 h-5 ${confidenceIconColor} flex-shrink-0`} />
                      <span className="text-sm font-medium text-white/90">
                        {roundedConfidence}%
                      </span>
                    </div>
                  )}
                </div>
                
                {hasValidStats && stats ? (
                  <div className="space-y-4">
                    {/* 1x2 Results Section */}
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <h5 className="text-sm font-semibold text-white mb-3">
                        1x2 Eredmények ({stats.total_matches ?? 0} közös mérkőzésből)
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{stats.home_wins ?? 0}</div>
                          <div className="text-xs text-white/70">Hazai győzelem</div>
                          <div className="text-sm text-emerald-400 font-medium">{stats.home_win_percentage ?? 0}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{stats.draws ?? 0}</div>
                          <div className="text-xs text-white/70">Döntetlen</div>
                          <div className="text-sm text-yellow-400 font-medium">{stats.draw_percentage ?? 0}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{stats.away_wins ?? 0}</div>
                          <div className="text-xs text-white/70">Vendég győzelem</div>
                          <div className="text-sm text-blue-400 font-medium">{stats.away_win_percentage ?? 0}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Goal Averages */}
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <h5 className="text-sm font-semibold text-white mb-3">Gól átlagok (közös mérkőzések)</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-emerald-400">{stats.home_avg_goals ?? 0}</div>
                          <div className="text-xs text-white/70">{match.home_team} átlaga</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-400">{stats.away_avg_goals ?? 0}</div>
                          <div className="text-xs text-white/70">{match.away_team} átlaga</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-lg font-bold text-white">{stats.avg_goals ?? 0}</div>
                        <div className="text-xs text-white/70">Összes gól átlaga mérkőzésenként</div>
                      </div>
                    </div>

                    {/* BTTS and Comeback Statistics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                        <div className="text-lg font-bold text-purple-400">{stats.btts_count ?? 0}</div>
                        <div className="text-xs text-white/70 mb-1">BTTS mérkőzés</div>
                        <div className="text-sm text-purple-400 font-medium">{stats.btts_percentage ?? 0}%</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                        <div className="text-lg font-bold text-orange-400">{stats.comeback_count ?? 0}</div>
                        <div className="text-xs text-white/70 mb-1">Fordítás</div>
                        <div className="text-sm text-orange-400 font-medium">{stats.comeback_percentage ?? 0}%</div>
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
                            <div key={`${uniqueKey}-result-${idx}`} className="bg-white/10 p-3 rounded text-center border border-white/20">
                              <div className="text-lg font-bold text-white mb-1">{result.score ?? 'N/A'}</div>
                              <div className="text-xs text-white/70">{result.count ?? 0}x ({result.percentage ?? 0}%)</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Stats */}
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="text-sm text-white/80 text-center">
                        <span className="font-medium">Félidő/végeredmény eltérés:</span> {stats.halftime_transformations ?? 0} mérkőzés
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
          );
        })}
      </div>
    </div>
  );
});
