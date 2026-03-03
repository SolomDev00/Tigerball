/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Users, ShieldAlert } from "lucide-react";
import { TeamType, CourtPosition } from "@/constants/index.types";

interface MatchPlayerNodeProps {
  team: TeamType;
  position: CourtPosition;
  player: any;
  isLastClicked: boolean;
  isSelectedServer: boolean;
  pointInProgress: boolean;
  touchCount: number;
  yellowCards: number;
  redCards: number;
  onPlayerClick: (team: TeamType, position: CourtPosition) => void;
  onOpenCardModal: (
    team: TeamType,
    position: CourtPosition,
    e: React.MouseEvent,
  ) => void;
}

export function MatchPlayerNode({
  team,
  position,
  player,
  isLastClicked,
  isSelectedServer,
  pointInProgress,
  touchCount,
  yellowCards,
  redCards,
  onPlayerClick,
  onOpenCardModal,
}: MatchPlayerNodeProps) {
  const getTouchColor = (
    active: boolean,
    isError: boolean,
    teamTouches: number,
  ) => {
    if (isError)
      return "ring-4 ring-red-500 border-red-500 shadow-lg scale-105 bg-red-50 dark:bg-red-950";
    if (!active) return "hover:bg-primary/5";

    if (teamTouches === 1)
      return "ring-4 ring-blue-500 border-blue-500 shadow-lg scale-105 bg-blue-50 dark:bg-blue-950";
    if (teamTouches === 2)
      return "ring-4 ring-green-500 border-green-500 shadow-lg scale-105 bg-green-50 dark:bg-green-950";
    if (teamTouches === 3)
      return "ring-4 ring-orange-500 border-orange-500 shadow-lg scale-105 bg-orange-50 dark:bg-orange-950";

    return "ring-4 ring-primary border-primary shadow-lg scale-105";
  };

  return (
    <button
      onClick={() => onPlayerClick(team, position)}
      disabled={
        (!pointInProgress && !player) ||
        (pointInProgress && (!player || isLastClicked))
      }
      className={cn(
        "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
        "w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed shadow-sm",
        player
          ? "bg-card border-border hover:border-primary cursor-pointer hover:shadow-md"
          : "bg-muted/30 border-muted opacity-50 cursor-not-allowed",
        isLastClicked
          ? getTouchColor(true, touchCount >= 4, touchCount)
          : getTouchColor(false, false, 0),
        isSelectedServer
          ? "ring-4 ring-yellow-400 border-yellow-400 shadow-xl scale-105 bg-yellow-50 dark:bg-yellow-950/30"
          : "",
        !isLastClicked && !isSelectedServer && team === "Home"
          ? "hover:bg-primary/5"
          : "",
        !isLastClicked && !isSelectedServer && team === "Away"
          ? "hover:bg-secondary/5"
          : "",
        "group",
      )}
    >
      <span className="absolute top-1 right-2 text-xs font-bold text-muted-foreground/50">
        {position}
      </span>
      {player ? (
        <>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 shadow-inner",
              team === "Home"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {player.favoriteNumber}
          </div>
          <span className="font-semibold text-xs sm:text-sm truncate w-full px-1">
            {player.name}
          </span>
          <span className="text-[10px] text-muted-foreground truncate w-full px-1">
            {player.roles?.[0] || ""}
          </span>

          <div
            className="absolute top-1 left-2 flex flex-col gap-1 cursor-pointer"
            onClick={(e) => onOpenCardModal(team, position, e)}
          >
            {yellowCards > 0 && (
              <div
                className="w-3 h-4 bg-yellow-400 rounded-sm shadow-sm"
                title={`بطاقات صفراء: ${yellowCards}`}
              />
            )}
            {redCards > 0 && (
              <div
                className="w-3 h-4 bg-red-600 rounded-sm shadow-sm"
                title={`بطاقات حمراء: ${redCards}`}
              />
            )}
            {!pointInProgress && yellowCards === 0 && redCards === 0 && (
              <div className="text-[8px] text-muted-foreground/30 hover:text-muted-foreground w-3 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldAlert className="w-2 h-2" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground/50">
          <Users className="w-6 h-6 mb-1" />
          <span className="text-xs">فارغ</span>
        </div>
      )}
    </button>
  );
}
