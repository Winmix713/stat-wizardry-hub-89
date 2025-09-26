import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import type { MatchStats } from "@/lib/supabase";

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
  if (!predictions.length) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-white">Predikciós eredmények</h3>
        </div>
        <p className="text-sm text-white/70">
          Elemzés a kiválasztott csapatok egymás elleni mérkőzései alapján
        </p>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {predictions.map(({ match, stats }) => {
          const confidenceLevel = stats?.prediction_quality?.confidence_level ?? 0;

          const ConfidenceIcon =
            confidenceLevel >= 65
              ? CheckCircle
              : AlertTriangle;

          const confidenceColor =
            confidenceLevel >= 65
              ? "text-success"
              : confidenceLevel >= 50
              ? "text-warning"
              : "text-destructive";

          return (
            <Card
              key={match.id}
              className="glass-card border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-6">
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h4 className="font-semibold text-white text-lg truncate">
                      {match.home_team}
                    </h4>
                    <div className="text-white/60 text-sm font-medium">VS</div>
                    <h4 className="font-semibold text-white text-lg truncate">
                      {match.away_team}
                    </h4>
                  </div>

                  {stats?.prediction_quality && (
                    <div
                      className="flex items-center gap-2"
                      aria-label={`Prediction confidence: ${confidenceLevel}%`}
                    >
                      <ConfidenceIcon
                        className={`w-5 h-5 ${confidenceColor} flex-shrink-0`}
                      />
                      <span className="text-sm font-medium text-white/90">
                        {Math.round(confidenceLevel)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                {stats ? (
                  <div className="space-y-5">
                    {/* 1x2 Results */}
                    <section className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <h5 className="text-sm font-semibold text-white mb-3">
                        1x2 Eredmények ({stats.total_matches} közös mérkőzésből)
                      </h5>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-lg font-bold text-white">{stats.home_wins}</div>
                          <div className="text-xs text-white/70">Hazai győzelem</div>
                          <div className="text-sm text-emerald-400 font-medium">
                            {stats.home_win_percentage}%
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{stats.draws}</div>
                          <div className="text-xs text-white/70">Döntetlen</div>
                          <div className="text-sm text-yellow-400 font-medium">
                            {stats.draw_percentage}%
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{stats.away_wins}</div>
                          <div className="text-xs text-white/70">Vendég győzelem</div>
                          <div className="text-sm text-blue-400 font-medium">
                            {stats.away_win_percentage}%
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Goal Averages */}
                    <section className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <h5 className="text-sm font-semibold text-white mb-3">
                        Gól átlagok (közös mérkőzések)
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-emerald-400">
                            {stats.home_avg_goals}
                          </div>
                          <div className="text-xs text-white/70">
                            {match.home_team} átlaga
                          </div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-400">
                            {stats.away_avg_goals}
                          </div>
                          <div className="text-xs text-white/70">
                            {match.away_team} átlaga
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-lg font-bold text-white">{stats.avg_goals}</div>
                        <div className="text-xs text-white/70">
                          Összes gól átlaga mérkőzésenként
                        </div>
                      </div>
                    </section>

                    {/* BTTS + Comebacks */}
                    <section className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {stats.btts_count}
                        </div>
                        <div className="text-xs text-white/70 mb-1">BTTS mérkőzés</div>
                        <div className="text-sm text-purple-400 font-medium">
                          {stats.btts_percentage}%
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded border border-white/10 text-center">
                        <div className="text-lg font-bold text-orange-400">
                          {stats.comeback_count}
                        </div>
                        <div className="text-xs text-white/70 mb-1">Fordítás</div>
                        <div className="text-sm text-orange-400 font-medium">
                          {stats.comeback_percentage}%
                        </div>
                      </div>
                    </section>

                    {/* Frequent Results */}
                    {stats.most_frequent_results?.length > 0 && (
                      <section className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" aria-hidden="true" />
                          Leggyakoribb 3 eredmény
                        </h5>
                        <div className="grid grid-cols-3 gap-2">
                          {stats.most_frequent_results.slice(0, 3).map((result, idx) => (
                            <div
                              key={idx}
                              className="bg-white/10 p-3 rounded text-center border border-white/20"
                            >
                              <div className="text-lg font-bold text-white mb-1">
                                {result.score}
                              </div>
                              <div className="text-xs text-white/70">
                                {result.count}x ({result.percentage}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Additional Stats */}
                    <section className="bg-white/5 p-3 rounded border border-white/10 text-center">
                      <span className="text-sm text-white/80">
                        <span className="font-medium">Félidő/végeredmény eltérés:</span>{" "}
                        {stats.halftime_transformations} mérkőzés
                      </span>
                    </section>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
                    <p className="text-white/70 text-sm">Nincs elegendő adat az elemzéshez</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
