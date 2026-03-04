"use client";

import { useState, useCallback, useEffect } from "react";
import { useMatchStore } from "@/stores/core/match-store";
import { useSettingsStore } from "@/stores/core/settings-store";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import * as xlsx from "xlsx";
import { TeamType, CourtPosition, EndAction } from "@/constants/index.types";
import { saveMatchToDatabase } from "@/app/actions/matches";

export function useMatchTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    availablePlayers,
    assignPlayerToCourt,
    actions,
    issueCard,
  } = useMatchStore();

  const { courtTheme, whistleVolume, selectedWhistle, setSelectedWhistle } =
    useSettingsStore();

  const [isEndingPoint, setIsEndingPoint] = useState(false);
  const [selectedServer, setSelectedServer] = useState<{
    team: TeamType;
    pos: CourtPosition;
  } | null>(null);
  const [lastClickedPos, setLastClickedPos] = useState<{
    team: TeamType;
    pos: CourtPosition;
  } | null>(null);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subTeam, setSubTeam] = useState<TeamType>("Home");
  const [isEndingMatch, setIsEndingMatch] = useState(false);
  const [isSavingMatch, setIsSavingMatch] = useState(false);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardTarget, setCardTarget] = useState<{
    team: TeamType;
    pos: CourtPosition;
  } | null>(null);

  // Auto-select whistle if none configured
  useEffect(() => {
    if (!selectedWhistle) {
      fetch("/api/sounds")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.sounds.length > 0) {
            setSelectedWhistle(data.sounds[0]);
          }
        })
        .catch(() => {});
    }
  }, [selectedWhistle, setSelectedWhistle]);

  const playWhistle = useCallback(() => {
    if (!selectedWhistle) return;
    const audio = new Audio(`/sounds/${selectedWhistle}`);
    audio.volume = whistleVolume;
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }, [selectedWhistle, whistleVolume]);

  const handleServe = useCallback(() => {
    if (!selectedServer) {
      toast.error(
        "الرجاء اختيار اللاعب المرسل أولاً بالضغط على مركزه في الملعب",
      );
      return;
    }
    setLastClickedPos(null);
    startPoint();
    playWhistle();
    toast.success("بدأت النقطة!");
  }, [selectedServer, startPoint, playWhistle]);

  const handlePlayerClick = useCallback(
    (team: TeamType, position: CourtPosition) => {
      if (!pointInProgress) {
        setSelectedServer({ team, pos: position });
        return;
      }

      if (lastClickedPos?.team === team && lastClickedPos?.pos === position)
        return;

      setLastClickedPos({ team, pos: position });
      recordTouch(team, position);
    },
    [pointInProgress, lastClickedPos, recordTouch],
  );

  const handleEndPoint = useCallback(
    (winningTeam: TeamType, actionResult: EndAction) => {
      endPoint(winningTeam, actionResult);
      playWhistle();
      setIsEndingPoint(false);
      setLastClickedPos(null);
    },
    [endPoint, playWhistle],
  );

  const handleIssueCard = useCallback(
    (cardType: "Yellow" | "Red") => {
      if (!cardTarget) return;
      issueCard(cardTarget.team, cardTarget.pos, cardType);
      toast.error(`تم منح بطاقة ${cardType === "Yellow" ? "صفراء" : "حمراء"}`);
      setIsCardModalOpen(false);
      setCardTarget(null);
    },
    [cardTarget, issueCard],
  );

  const handleExportExcel = useCallback(() => {
    if (actions.length === 0) {
      toast.error("لا توجد أحداث لتصديرها بعد!");
      return;
    }

    const exportData = actions.map((act) => ({
      "الشوط (Set)": act.set,
      "النقطة (Point)": act.point,
      "النتيجة (Score)": act.score,
      "الفريق (Team)": act.team === "Home" ? "المحلي" : "الضيف",
      "رقم اللاعب (Player No)": act.playerNo,
      "اسم اللاعب (Player Name)": act.playerName,
      "الإجراء (Action)": act.action,
      "ملاحظة الإنهاء (End Action)": act.endPointAction || "-",
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Match Actions");

    const fileName = `Tigerball_Match_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    xlsx.writeFile(workbook, fileName);
    toast.success("تم التصدير بنجاح!");
  }, [actions]);

  const handleEndMatch = useCallback(async () => {
    const homeTeamId = searchParams?.get("home");
    const awayTeamId = searchParams?.get("away");

    if (!homeTeamId || !awayTeamId) {
      toast.error(
        "بيانات الفرق غير مكتملة، لا يمكن حفظ المباراة في قاعدة البيانات.",
      );
      setIsEndingMatch(false);
      return;
    }

    setIsSavingMatch(true);

    const res = await saveMatchToDatabase(
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      actions,
    );

    if (res.success) {
      toast.success("تم إنهاء المباراة وحفظ البيانات بنجاح!");
      router.push("/leaderboard");
    } else {
      toast.error(res.error || "حدث خطأ أثناء حفظ المباراة.");
      setIsSavingMatch(false);
      setIsEndingMatch(false);
    }
  }, [searchParams, homeScore, awayScore, actions, router]);

  const getActionLabel = useCallback(() => {
    if (!pointInProgress || touchCount === 0) return "بانتظار الإرسال...";
    if (touchCount === 1) return "استقبال (Defence)";
    if (touchCount === 2) return "إعداد (Setting)";
    if (touchCount === 3) return "ضرب هجومي (Striking)";
    if (touchCount >= 4) return "خطأ لمسة رابعة (Error)";
    return "";
  }, [pointInProgress, touchCount]);

  return {
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
    setSelectedServer,
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
  };
}
