"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { TeamType } from "@/constants/index.types";

interface MatchScoreboardProps {
  homeScore: number;
  awayScore: number;
  currentSet: string;
  pointCounter: number;
  pointInProgress: boolean;
  currentActionTeam: TeamType | null;
  touchCount: number;
  onChangeSet: (set: string) => void;
  getActionLabel: () => string;
}

export function MatchScoreboard({
  homeScore,
  awayScore,
  currentSet,
  pointCounter,
  pointInProgress,
  currentActionTeam,
  touchCount,
  onChangeSet,
  getActionLabel,
}: MatchScoreboardProps) {
  const currentActionColor = () => {
    if (!pointInProgress) return "bg-muted text-muted-foreground";
    if (touchCount >= 4) return "bg-red-500 text-white animate-pulse";
    if (currentActionTeam === "Home")
      return "bg-primary text-primary-foreground";
    if (currentActionTeam === "Away")
      return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-md sticky top-16 lg:top-0 z-10 shadow-sm">
      <div className="bg-primary/5 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">
            الفريق المحلي (Home)
          </span>
          <span className="text-5xl font-black text-primary">{homeScore}</span>
        </div>

        <div className="flex flex-col items-center flex-1 gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-muted-foreground mr-2">
              نقطة:
            </span>
            <Badge
              variant="outline"
              className="text-lg font-bold px-3 py-1 bg-background"
            >
              {pointCounter}
            </Badge>

            <select
              value={currentSet}
              onChange={(e) => onChangeSet(e.target.value)}
              className="mx-2 bg-background border rounded px-2 py-1 text-sm font-semibold"
              disabled={pointInProgress}
            >
              <option value="Set1">الشوط 1</option>
              <option value="Set2">الشوط 2</option>
              <option value="Set3">الشوط 3</option>
              <option value="Set4">الشوط 4</option>
              <option value="Set5">الشوط 5</option>
            </select>
          </div>

          <div
            className={cn(
              "px-4 py-2 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 transition-colors duration-300 w-full sm:w-auto justify-center",
              currentActionColor(),
            )}
          >
            <Activity className="w-4 h-4" />
            {getActionLabel()}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">
            الفريق الضيف (Away)
          </span>
          <span className="text-5xl font-black text-secondary">
            {awayScore}
          </span>
        </div>
      </div>
    </Card>
  );
}
