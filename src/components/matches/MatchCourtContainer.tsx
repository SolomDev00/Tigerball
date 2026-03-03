/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { MatchPlayerNode } from "./MatchPlayerNode";
import { TeamType, CourtPosition } from "@/constants/index.types";

interface MatchCourtContainerProps {
  courtTheme: string;
  homeTeamCourt: any[];
  awayTeamCourt: any[];
  selectedServer: { team: TeamType; pos: CourtPosition } | null;
  lastClickedPos: { team: TeamType; pos: CourtPosition } | null;
  pointInProgress: boolean;
  touchCount: number;
  onPlayerClick: (team: TeamType, position: CourtPosition) => void;
  onOpenCardModal: (
    team: TeamType,
    position: CourtPosition,
    e: React.MouseEvent,
  ) => void;
}

export function MatchCourtContainer({
  courtTheme,
  homeTeamCourt,
  awayTeamCourt,
  selectedServer,
  lastClickedPos,
  pointInProgress,
  touchCount,
  onPlayerClick,
  onOpenCardModal,
}: MatchCourtContainerProps) {
  const renderNode = (team: TeamType, position: CourtPosition) => {
    const court = team === "Home" ? homeTeamCourt : awayTeamCourt;
    const cp = court.find((c) => c.position === position);

    return (
      <MatchPlayerNode
        key={position}
        team={team}
        position={position}
        player={cp?.player}
        isLastClicked={
          lastClickedPos?.team === team && lastClickedPos?.pos === position
        }
        isSelectedServer={
          !pointInProgress &&
          selectedServer?.team === team &&
          selectedServer?.pos === position
        }
        pointInProgress={pointInProgress}
        touchCount={touchCount}
        yellowCards={cp?.yellowCards || 0}
        redCards={cp?.redCards || 0}
        onPlayerClick={onPlayerClick}
        onOpenCardModal={onOpenCardModal}
      />
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-8">
      <div
        className={cn(
          "border-4 rounded-xl overflow-hidden relative shadow-inner",
          courtTheme === "classic" &&
            "border-slate-300 bg-orange-50/50 dark:bg-orange-950/20",
          courtTheme === "wood" &&
            "border-yellow-900 bg-amber-100 dark:bg-amber-900/40",
          courtTheme === "blue" &&
            "border-blue-900 bg-blue-100/50 dark:bg-blue-900/30",
          courtTheme === "sand" &&
            "border-yellow-600 bg-yellow-200/40 dark:bg-yellow-800/20",
        )}
      >
        <div
          className={cn(
            "absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 z-0",
            courtTheme === "classic" && "bg-slate-400",
            courtTheme === "wood" && "bg-amber-800",
            courtTheme === "blue" && "bg-slate-200",
            courtTheme === "sand" && "bg-amber-700",
          )}
        ></div>

        <div
          className={cn(
            "flex flex-col w-full divide-y-4 relative z-10",
            courtTheme === "classic" && "divide-slate-300",
            courtTheme === "wood" && "divide-amber-800",
            courtTheme === "blue" && "divide-slate-200",
            courtTheme === "sand" && "divide-amber-700",
          )}
        >
          {/* Away Side (Top Half) */}
          <div
            className={cn(
              "p-4 sm:p-8 flex flex-col justify-between items-center min-h-[350px] relative transition-colors",
              courtTheme === "classic" && "bg-secondary/5",
              courtTheme !== "classic" && "bg-white/10 dark:bg-black/10",
            )}
          >
            <span className="absolute top-4 left-4 text-2xl font-black opacity-30 text-current tracking-[0.2em] pointer-events-none">
              AWAY
            </span>
            <div className="flex w-full justify-around mb-8 z-10">
              {renderNode("Away", 1)}
              {renderNode("Away", 6)}
              {renderNode("Away", 5)}
            </div>
            <div className="flex w-full justify-around mt-4 z-10">
              {renderNode("Away", 2)}
              {renderNode("Away", 3)}
              {renderNode("Away", 4)}
            </div>
          </div>

          {/* Home Side (Bottom Half) */}
          <div
            className={cn(
              "p-4 sm:p-8 flex flex-col justify-between items-center min-h-[350px] relative transition-colors",
              courtTheme === "classic" && "bg-primary/5",
              courtTheme !== "classic" && "bg-black/5 dark:bg-white/5",
            )}
          >
            <span className="absolute bottom-4 right-4 text-2xl font-black opacity-30 text-current tracking-[0.2em] pointer-events-none">
              HOME
            </span>
            <div className="flex w-full justify-around mb-4 z-10">
              {renderNode("Home", 4)}
              {renderNode("Home", 3)}
              {renderNode("Home", 2)}
            </div>
            <div className="flex w-full justify-around mt-8 z-10">
              {renderNode("Home", 5)}
              {renderNode("Home", 6)}
              {renderNode("Home", 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
