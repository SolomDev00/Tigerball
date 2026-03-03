"use server";

import { prisma } from "@/lib/prisma";

export async function getGlobalLeaderboard() {
  try {
    // 1. Fetch all players
    const players = await prisma.player.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // 2. Fetch all match actions
    const allActions = await prisma.matchAction.findMany();

    // 3. Aggregate stats per player
    const stats = players.map((player) => {
      const playerActions = allActions.filter((a) => a.playerId === player.id);

      const defences = playerActions.filter(
        (a) => a.action === "Defence",
      ).length;
      const settings = playerActions.filter(
        (a) => a.action === "Setting",
      ).length;
      const strikes = playerActions.filter(
        (a) => a.action === "Striking",
      ).length;

      const blocks = playerActions.filter(
        (a) => a.endPointAction === "Block",
      ).length;
      const aces = playerActions.filter(
        (a) => a.endPointAction === "Ace",
      ).length;
      const faults = playerActions.filter(
        (a) =>
          a.endPointAction === "Fault" ||
          a.endPointAction === "Touch Net" ||
          a.endPointAction === "Out Side" ||
          a.action === "Error",
      ).length;

      // Score formula
      const score =
        strikes * 2 +
        blocks * 3 +
        aces * 4 +
        defences * 1 +
        settings * 1 -
        faults * 2;

      return {
        id: player.id,
        name: player.name,
        favoriteNumber: player.favoriteNumber,
        roles: player.roles,
        defences,
        settings,
        strikes,
        blocks,
        aces,
        faults,
        score,
        totalTouches: playerActions.length,
      };
    });

    // 4. Sort by score descending
    stats.sort((a, b) => b.score - a.score);

    return { success: true, data: stats };
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return { success: false, error: "Failed to load leaderboard data" };
  }
}
