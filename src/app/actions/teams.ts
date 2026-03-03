"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: teams };
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function createTeam(name: string, playerIds: string[]) {
  try {
    const cleanName = name === "$undefined" ? "" : name;
    const team = await prisma.team.create({
      data: {
        name: cleanName,
        // create TeamPlayer relationships
        players: {
          create: playerIds.map((playerId) => ({
            player: {
              connect: { id: playerId },
            },
          })),
        },
      },
    });
    revalidatePath("/teams");
    revalidatePath("/matches/new");
    revalidatePath("/matches/draw");
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function updateTeam(
  id: string,
  name: string,
  playerIds?: string[],
) {
  try {
    const cleanName = name === "$undefined" ? "" : name;
    // If playerIds provided, we must sync them. Simplest is delete all old links, create new
    if (playerIds) {
      // Run in transaction to ensure integrity
      const team = await prisma.$transaction(async (tx) => {
        // Delete existing relationships
        await tx.teamPlayer.deleteMany({
          where: { teamId: id },
        });

        // Update team name and create new relationships
        return await tx.team.update({
          where: { id },
          data: {
            name: cleanName,
            players: {
              create: playerIds.map((playerId) => ({
                player: { connect: { id: playerId } },
              })),
            },
          },
        });
      });
      revalidatePath("/teams");
      revalidatePath("/matches/new");
      revalidatePath("/matches/draw");
      return { success: true, data: team };
    } else {
      // Just update Name
      const team = await prisma.team.update({
        where: { id },
        data: { name: cleanName },
      });
      revalidatePath("/teams");
      revalidatePath("/matches/new");
      revalidatePath("/matches/draw");
      return { success: true, data: team };
    }
  } catch (error) {
    console.error("Failed to update team:", error);
    return { success: false, error: "Failed to update team" };
  }
}

export async function deleteTeam(id: string) {
  try {
    await prisma.team.delete({
      where: { id },
    });
    revalidatePath("/teams");
    revalidatePath("/matches/new");
    revalidatePath("/matches/draw");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team:", error);
    return { success: false, error: "Failed to delete team" };
  }
}
