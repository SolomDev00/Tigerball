"use client";

import { useState, useEffect, useCallback } from "react";
import { getTeams } from "@/app/actions/teams";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

export type DbTeam = Prisma.TeamGetPayload<{
  include: {
    players: {
      include: {
        player: true;
      };
    };
  };
}>;

export function useMatchDraw() {
  const router = useRouter();
  const [dbTeams, setDbTeams] = useState<DbTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<{
    home: string;
    away: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTeams() {
      const res = await getTeams();
      if (res.success && res.data && isMounted) {
        setDbTeams(res.data);
      }
      if (isMounted) setLoading(false);
    }
    fetchTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTeamSelection = useCallback((teamId: string) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  }, []);

  const handleDraw = useCallback(() => {
    if (selectedTeams.length < 2) return;

    setIsDrawing(true);
    setDrawResult(null);

    // Simulate a spinning wheel delay
    setTimeout(() => {
      const shuffled = [...selectedTeams].sort(() => 0.5 - Math.random());
      setDrawResult({ home: shuffled[0], away: shuffled[1] });
      setIsDrawing(false);
    }, 2000);
  }, [selectedTeams]);

  const proceedToMatch = useCallback(() => {
    if (!drawResult) return;
    router.push(`/matches/new?home=${drawResult.home}&away=${drawResult.away}`);
  }, [drawResult, router]);

  const resetDraw = useCallback(() => {
    setDrawResult(null);
  }, []);

  return {
    dbTeams,
    loading,
    selectedTeams,
    isDrawing,
    drawResult,
    toggleTeamSelection,
    handleDraw,
    proceedToMatch,
    resetDraw,
  };
}
