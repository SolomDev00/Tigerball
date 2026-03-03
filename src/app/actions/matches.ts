"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionRecord } from "@/constants/index.interfaces";

export async function saveMatchToDatabase(
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
  actions: ActionRecord[],
) {
  try {
    // We wrap this inside a transaction so if actions fail, the match won't be half-created
    const match = await prisma.$transaction(async (tx) => {
      // 1. Create the Match
      const newMatch = await tx.match.create({
        data: {
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore,
          status: "COMPLETED",
          // actions will be created next
        },
      });

      // 2. Prepare the action items to be created
      const matchActionsData = actions.map((act) => ({
        matchId: newMatch.id,
        set: act.set,
        point: act.point,
        score: act.score,
        teamType: act.team === "Home" ? "Home" : "Away",
        playerId: act.playerId || null,
        action: act.action,
        endPointAction: act.endPointAction || null,
        card: act.card || null,
      }));

      // 3. Batch insert MatchActions
      if (matchActionsData.length > 0) {
        await tx.matchAction.createMany({
          data: matchActionsData,
        });
      }

      return newMatch;
    });

    revalidatePath("/matches");
    revalidatePath("/leaderboard");

    return { success: true, data: match };
  } catch (error) {
    console.error("Failed to save match:", error);
    return { success: false, error: "Failed to save match and actions" };
  }
}
