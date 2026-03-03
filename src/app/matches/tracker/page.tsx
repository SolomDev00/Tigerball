"use client";

import { Suspense } from "react";
import { useMatchTracker } from "@/components/matches/hooks/use-match-tracker";
import { MatchScoreboard } from "@/components/matches/MatchScoreboard";
import { MatchCourtContainer } from "@/components/matches/MatchCourtContainer";
import { MatchTrackerActions } from "@/components/matches/MatchTrackerActions";
import { MatchTrackerModals } from "@/components/matches/MatchTrackerModals";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

function MatchTrackerContent() {
  const {
    // State
    homeScore,
    awayScore,
    currentSet,
    pointCounter,
    homeTeamCourt,
    awayTeamCourt,
    pointInProgress,
    currentActionTeam,
    touchCount,
    isEndingPoint,
    selectedServer,
    lastClickedPos,
    isSubModalOpen,
    subTeam,
    isEndingMatch,
    isSavingMatch,
    isCardModalOpen,
    cardTarget,
    courtTheme,
    availablePlayers,

    // Setters
    setIsEndingPoint,
    setIsSubModalOpen,
    setSubTeam,
    setIsEndingMatch,
    setIsCardModalOpen,
    setCardTarget,

    // Actions
    handleServe,
    handlePlayerClick,
    handleEndPoint,
    handleIssueCard,
    handleExportExcel,
    handleEndMatch,
    playWhistle,
    changeSet,
    assignPlayerToCourt,
    getActionLabel,
  } = useMatchTracker();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <MatchScoreboard
        homeScore={homeScore}
        awayScore={awayScore}
        currentSet={currentSet}
        pointCounter={pointCounter}
        pointInProgress={pointInProgress}
        currentActionTeam={currentActionTeam}
        touchCount={touchCount}
        onChangeSet={changeSet}
        getActionLabel={getActionLabel}
      />

      <MatchTrackerActions
        pointInProgress={pointInProgress}
        onServe={handleServe}
        onOpenEndPoint={() => setIsEndingPoint(true)}
        onPlayWhistle={playWhistle}
        onOpenSub={() => setIsSubModalOpen(true)}
        onExportExcel={handleExportExcel}
      />

      <MatchCourtContainer
        courtTheme={courtTheme}
        homeTeamCourt={homeTeamCourt}
        awayTeamCourt={awayTeamCourt}
        selectedServer={selectedServer}
        lastClickedPos={lastClickedPos}
        pointInProgress={pointInProgress}
        touchCount={touchCount}
        onPlayerClick={handlePlayerClick}
        onOpenCardModal={(team, pos, e) => {
          e.stopPropagation();
          setCardTarget({ team, pos });
          setIsCardModalOpen(true);
        }}
      />

      <div className="flex justify-center mt-12 pb-10 border-t pt-8">
        <Button
          size="lg"
          variant="destructive"
          className="w-full max-w-sm gap-2 text-xl h-16 rounded-full shadow-2xl hover:scale-105 transition-all font-black"
          onClick={() => setIsEndingMatch(true)}
        >
          <Flag className="w-6 h-6" />
          إنهاء وتسجيل المباراة نهائياً
        </Button>
      </div>

      <MatchTrackerModals
        isEndingPoint={isEndingPoint}
        onIsEndingPointChange={setIsEndingPoint}
        onEndPoint={handleEndPoint}
        isCardModalOpen={isCardModalOpen}
        onIsCardModalOpenChange={setIsCardModalOpen}
        onIssueCard={handleIssueCard}
        isSubModalOpen={isSubModalOpen}
        onIsSubModalOpenChange={setIsSubModalOpen}
        subTeam={subTeam}
        onSubTeamChange={setSubTeam}
        homeTeamCourt={homeTeamCourt}
        awayTeamCourt={awayTeamCourt}
        availablePlayers={availablePlayers}
        onAssignPlayer={assignPlayerToCourt}
        isEndingMatch={isEndingMatch}
        onIsEndingMatchChange={setIsEndingMatch}
        isSavingMatch={isSavingMatch}
        homeScore={homeScore}
        awayScore={awayScore}
        onEndMatch={handleEndMatch}
      />
    </div>
  );
}

export default function MatchTrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          جاري تحميل لوحة التحكم...
        </div>
      }
    >
      <MatchTrackerContent />
    </Suspense>
  );
}
