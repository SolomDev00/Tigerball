"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPlayers() {
  try {
    const players = await prisma.player.findMany({
      include: {
        teams: {
          include: { team: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: players };
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return { success: false, error: "Failed to fetch players" };
  }
}

import { hash } from "bcryptjs";

export async function createPlayer(data: {
  name: string;
  favoriteNumber?: number | null;
  roles: string[];
  gender?: "MALE" | "FEMALE";
  email?: string;
  password?: string;
  phone?: string;
}) {
  try {
    const player = await prisma.$transaction(async (tx) => {
      // 1. Create the Player
      const newPlayer = await tx.player.create({
        data: {
          name: data.name,
          favoriteNumber: data.favoriteNumber,
          roles: data.roles,
          gender: data.gender || "MALE",
        },
      });

      // 2. Create User account if email and password are provided
      if (data.email && data.password) {
        const hashedPassword = await hash(data.password, 10);
        await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role: "PLAYER",
            playerId: newPlayer.id,
          },
        });
      }

      return newPlayer;
    });

    revalidatePath("/players");
    revalidatePath("/matches/new");
    return { success: true, data: player };
  } catch (error) {
    console.error("Failed to create player:", error);
    return { success: false, error: "Failed to create player" };
  }
}

export async function updatePlayer(id: string, data: Prisma.PlayerUpdateInput) {
  try {
    const player = await prisma.player.update({
      where: { id },
      data,
    });
    revalidatePath("/players");
    revalidatePath("/matches/new");
    return { success: true, data: player };
  } catch (error) {
    console.error("Failed to update player:", error);
    return { success: false, error: "Failed to update player" };
  }
}

export async function deletePlayer(id: string) {
  try {
    await prisma.player.delete({
      where: { id },
    });
    revalidatePath("/players");
    revalidatePath("/matches/new");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete player:", error);
    return { success: false, error: "Failed to delete player" };
  }
}
