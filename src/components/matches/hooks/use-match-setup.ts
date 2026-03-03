"use client";

import { useState, useEffect, useCallback } from "react";
import { useMatchStore } from "@/stores/core/match-store";
import { getPlayers } from "@/app/actions/players";
import { getTeams } from "@/app/actions/teams";
import { Prisma } from "@prisma/client";
import { TeamType, CourtPosition } from "@/constants/index.types";
import { Player } from "@/constants/index.interfaces";

export type DbTeam = Prisma.TeamGetPayload<{
  include: {
    players: {
      include: {
        player: true;
      };
    };
  };
}>;

export function useMatchSetup() {
  const {
    availablePlayers,
    homeTeamCourt,
    awayTeamCourt,
    assignPlayerToCourt,
    removePlayerFromCourt,
    setAvailablePlayers,
  } = useMatchStore();

  const [dbTeams, setDbTeams] = useState<DbTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      // 1. Fetch Teams
      const teamsRes = await getTeams();
      if (teamsRes.success && teamsRes.data && isMounted) {
        setDbTeams(teamsRes.data);
      }

      // 2. Fetch all Players and hydrate the store
      const playersRes = await getPlayers();
      if (playersRes.success && playersRes.data && isMounted) {
        setAvailablePlayers(playersRes.data as Player[]);
      }

      if (isMounted) setLoading(false);
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [setAvailablePlayers]);

  const loadTeamTemplate = useCallback(
    (teamType: TeamType, teamId: string) => {
      if (!teamId) return;
      const teamData = dbTeams.find((t) => t.id === teamId);
      if (!teamData) return;

      // Clear current court for this team
      [1, 2, 3, 4, 5, 6].forEach((pos) =>
        removePlayerFromCourt(teamType, pos as CourtPosition),
      );

      // Assign new players
      teamData.players.forEach((teamPlayer, index) => {
        const position = (index + 1) as CourtPosition;
        assignPlayerToCourt(teamType, position, teamPlayer.playerId);
      });
    },
    [dbTeams, removePlayerFromCourt, assignPlayerToCourt],
  );

  return {
    dbTeams,
    loading,
    availablePlayers,
    homeTeamCourt,
    awayTeamCourt,
    assignPlayerToCourt,
    removePlayerFromCourt,
    loadTeamTemplate,
  };
}
