"use client";

import { useMatchStore } from "@/stores/core/match-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Volleyball, Activity, ShieldAlert, Target, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CourtPosition, EndAction, TeamType } from "@/constants/index.types";

export default function MatchTracker() {
  const {
    homeScore,
    awayScore,
    currentSet,
    pointCounter,
    homeTeamCourt,
    awayTeamCourt,
    pointInProgress,
    currentActionTeam,
    touchCount,
    startPoint,
    recordTouch,
    endPoint,
    changeSet,
  } = useMatchStore();

  const [isEndingPoint, setIsEndingPoint] = useState(false);
  const [lastClickedPos, setLastClickedPos] = useState<{
    team: TeamType;
    pos: CourtPosition;
  } | null>(null);

  const handleServe = () => {
    setLastClickedPos(null);
    startPoint();
  };

  const handlePlayerClick = (team: TeamType, position: CourtPosition) => {
    if (!pointInProgress) return;

    // Prevent double clicking the same player consecutively to simulate realistic flow
    if (lastClickedPos?.team === team && lastClickedPos?.pos === position)
      return;

    setLastClickedPos({ team, pos: position });
    recordTouch(team, position);
  };

  const handleEndPoint = (winningTeam: TeamType, actionResult: EndAction) => {
    endPoint(winningTeam, actionResult);
    setIsEndingPoint(false);
    setLastClickedPos(null);
  };

  // Helper to get action label based on touches
  const getActionLabel = () => {
    if (!pointInProgress || touchCount === 0) return "بانتظار الإرسال...";
    if (touchCount === 1) return "استقبال (Defence)";
    if (touchCount === 2) return "إعداد (Setting)";
    if (touchCount === 3) return "ضرب هجومي (Striking)";
    if (touchCount >= 4) return "خطأ لمسة رابعة (Error)";
    return "";
  };

  const getTouchColor = (
    isActive: boolean,
    isError: boolean,
    teamTouches: number,
  ) => {
    if (isError)
      return "ring-4 ring-red-500 border-red-500 shadow-lg scale-105 bg-red-50 dark:bg-red-950";
    if (!isActive) return "hover:bg-primary/5";

    // Defence = Blue, Setting = Green, Striking = Orange
    if (teamTouches === 1)
      return "ring-4 ring-blue-500 border-blue-500 shadow-lg scale-105 bg-blue-50 dark:bg-blue-950";
    if (teamTouches === 2)
      return "ring-4 ring-green-500 border-green-500 shadow-lg scale-105 bg-green-50 dark:bg-green-950";
    if (teamTouches === 3)
      return "ring-4 ring-orange-500 border-orange-500 shadow-lg scale-105 bg-orange-50 dark:bg-orange-950";

    return "ring-4 ring-primary border-primary shadow-lg scale-105";
  };

  const currentActionColor = () => {
    if (!pointInProgress) return "bg-muted text-muted-foreground";
    if (touchCount >= 4) return "bg-red-500 text-white animate-pulse";
    if (currentActionTeam === "Home")
      return "bg-primary text-primary-foreground";
    if (currentActionTeam === "Away")
      return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const renderPlayerNode = (team: TeamType, position: CourtPosition) => {
    const court = team === "Home" ? homeTeamCourt : awayTeamCourt;
    const cp = court.find((c) => c.position === position);
    const player = cp?.player;

    const isLastClicked =
      lastClickedPos?.team === team && lastClickedPos?.pos === position;

    return (
      <button
        key={position}
        onClick={() => handlePlayerClick(team, position)}
        disabled={!pointInProgress || !player || isLastClicked}
        className={cn(
          "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
          "w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed shadow-sm",
          player
            ? "bg-card border-border hover:border-primary cursor-pointer hover:shadow-md"
            : "bg-muted/30 border-muted opacity-50 cursor-not-allowed",
          isLastClicked
            ? getTouchColor(true, touchCount >= 4, touchCount)
            : getTouchColor(false, false, 0),
          !isLastClicked && team === "Home" ? "hover:bg-primary/5" : "",
          !isLastClicked && team === "Away" ? "hover:bg-secondary/5" : "",
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
              {player.number}
            </div>
            <span className="font-semibold text-xs sm:text-sm truncate w-full px-1">
              {player.name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate w-full px-1">
              {player.role}
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground/50">
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs">فارغ</span>
          </div>
        )}
      </button>
    );
  };

  // Fixed visual layout mappings for volleyball court:
  // Back row: 5, 6, 1
  // Front row: 4, 3, 2
  // We mirror for Away vs Home

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Scoreboard Header */}
      <Card className="overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-md sticky top-16 lg:top-0 z-10 shadow-sm">
        <div className="bg-primary/5 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-1">
              الفريق المحلي (Home)
            </span>
            <span className="text-5xl font-black text-primary">
              {homeScore}
            </span>
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
                onChange={(e) => changeSet(e.target.value)}
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

      {/* Action Controls */}
      <div className="flex justify-center gap-4 py-4">
        {!pointInProgress ? (
          <Button
            size="lg"
            className="w-48 text-lg h-14 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary"
            onClick={handleServe}
          >
            <Volleyball className="w-6 h-6 ml-2" /> إرسال (Serve)
          </Button>
        ) : (
          <Button
            size="lg"
            variant="destructive"
            className="w-48 text-lg h-14 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={() => setIsEndingPoint(true)}
          >
            <ShieldAlert className="w-6 h-6 ml-2" /> إنهاء النقطة
          </Button>
        )}
      </div>

      {/* The Court UI */}
      <div className="relative w-full overflow-x-auto pb-8">
        <div className="min-w-[700px] border-4 border-slate-300 mx-auto bg-orange-50/50 dark:bg-orange-950/20 rounded-xl overflow-hidden relative shadow-inner">
          {/* Net Line in the middle */}
          <div className="absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 bg-slate-400 z-0"></div>

          <div className="flex w-full divide-x divide-x-reverse divide-slate-300 relative z-10 p-4">
            {/* Away Side (Left side of screen) */}
            <div className="flex-1 p-4 sm:p-8 flex flex-col justify-between items-center bg-secondary/5 rounded-r-lg min-h-[400px]">
              <div className="flex w-full justify-between pr-0 pl-10 mb-8">
                {renderPlayerNode("Away", 5)}
                {renderPlayerNode("Away", 4)}
              </div>
              <div className="flex w-full justify-between pr-0 pl-10 mb-8">
                {renderPlayerNode("Away", 6)}
                {renderPlayerNode("Away", 3)}
              </div>
              <div className="flex w-full justify-between pr-0 pl-10">
                {renderPlayerNode("Away", 1)}
                {renderPlayerNode("Away", 2)}
              </div>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 text-2xl font-black text-secondary/20 tracking-[0.5em] pointer-events-none">
                AWAY
              </span>
            </div>

            {/* Home Side (Right side of screen) */}
            <div className="flex-1 p-4 sm:p-8 flex flex-col justify-between items-center bg-primary/5 rounded-l-lg min-h-[400px]">
              <div className="flex w-full justify-between pl-0 pr-10 mb-8">
                {renderPlayerNode("Home", 2)}
                {renderPlayerNode("Home", 1)}
              </div>
              <div className="flex w-full justify-between pl-0 pr-10 mb-8">
                {renderPlayerNode("Home", 3)}
                {renderPlayerNode("Home", 6)}
              </div>
              <div className="flex w-full justify-between pl-0 pr-10">
                {renderPlayerNode("Home", 4)}
                {renderPlayerNode("Home", 5)}
              </div>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-2xl font-black text-primary/20 tracking-[0.5em] pointer-events-none">
                HOME
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* End Point Dialog */}
      <Dialog open={isEndingPoint} onOpenChange={setIsEndingPoint}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              تحديد نتيجة النقطة
            </DialogTitle>
            <DialogDescription>
              اختر الفريق الفائز وسبب إنهاء النقطة.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-6">
            {/* Home Wins */}
            <div className="space-y-4">
              <div className="text-center font-bold text-lg text-primary border-b pb-2">
                فوز المحلي (Home)
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="justify-start hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleEndPoint("Home", "Inside")}
                >
                  كرة داخل الملعب (Inside)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleEndPoint("Home", "Block")}
                >
                  صد هجومي (Block)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleEndPoint("Home", "Ace")}
                >
                  إرسال ساحق (Ace)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleEndPoint("Home", "Fault")}
                >
                  خطأ منافس (Fault)
                </Button>
              </div>
            </div>

            {/* Away Wins */}
            <div className="space-y-4">
              <div className="text-center font-bold text-lg text-secondary border-b pb-2">
                فوز الضيف (Away)
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="justify-start hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => handleEndPoint("Away", "Inside")}
                >
                  كرة داخل الملعب (Inside)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => handleEndPoint("Away", "Block")}
                >
                  صد هجومي (Block)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => handleEndPoint("Away", "Ace")}
                >
                  إرسال ساحق (Ace)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => handleEndPoint("Away", "Fault")}
                >
                  خطأ منافس (Fault)
                </Button>
              </div>
            </div>

            {/* Neutral Ends */}
            <div className="col-span-2 space-y-4 mt-4">
              <div className="text-center font-bold text-lg text-muted-foreground border-b pb-2">
                أخطاء مشتركة أو خارجية
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEndPoint("Away", "Out Side")}
                >
                  خارج الملعب (Out Side) - لصالح الضيف
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEndPoint("Home", "Out Side")}
                >
                  خارج الملعب (Out Side) - لصالح المحلي
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEndPoint("Away", "Touch Net")}
                >
                  لمس الشبكة (Touch Net) - لصالح الضيف
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleEndPoint("Home", "Touch Net")}
                >
                  لمس الشبكة (Touch Net) - لصالح المحلي
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
