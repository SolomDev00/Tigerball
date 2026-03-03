"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array to key-value object
    const settingsMap = settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return { success: true, data: settingsMap };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function saveSetting(key: string, value: string) {
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error(`Failed to save setting ${key}:`, error);
    return { success: false, error: `Failed to save setting ${key}` };
  }
}
