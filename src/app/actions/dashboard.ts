"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [playerCount, matchCount, allActions] = await Promise.all([
      prisma.player.count(),
      prisma.match.count(),
      prisma.matchAction.findMany({
        include: {
          player: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
    ]);

    // Top Player Calculation (Based on simplified logic: most actions)
    // In a real scenario, we might use the score formula from leaderboard
    const playerStats: Record<
      string,
      { name: string; score: number; actions: number }
    > = {};

    allActions.forEach((action) => {
      if (!action.playerId || !action.player) return;
      if (!playerStats[action.playerId]) {
        playerStats[action.playerId] = {
          name: action.player.name,
          score: 0,
          actions: 0,
        };
      }
      playerStats[action.playerId].actions += 1;

      // Basic scoring for dashboard
      if (action.endPointAction === "Ace")
        playerStats[action.playerId].score += 4;
      else if (action.endPointAction === "Block")
        playerStats[action.playerId].score += 3;
      else if (action.action === "Striking")
        playerStats[action.playerId].score += 2;
      else if (action.action === "Defence")
        playerStats[action.playerId].score += 1;
      else if (action.action === "Setting")
        playerStats[action.playerId].score += 1;
    });

    const sortedPlayers = Object.entries(playerStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.score - a.score);

    const topPlayer = sortedPlayers[0] || null;

    // Chart Data: Top 5 players by score
    const topScorersChart = sortedPlayers.slice(0, 5).map((p) => ({
      name: p.name,
      score: p.score,
    }));

    // Chart Data: Action distribution
    const actionDistribution = {
      Striking: allActions.filter((a) => a.action === "Striking").length,
      Defence: allActions.filter((a) => a.action === "Defence").length,
      Setting: allActions.filter((a) => a.action === "Setting").length,
      Errors: allActions.filter(
        (a) => a.action === "Error" || a.endPointAction === "Fault",
      ).length,
    };

    const actionChart = Object.entries(actionDistribution).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    return {
      success: true,
      data: {
        playerCount,
        matchCount,
        topPlayer,
        charts: {
          topScorers: topScorersChart,
          actionDistribution: actionChart,
        },
      },
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return { success: false, error: "Failed to load dashboard statistics" };
  }
}
