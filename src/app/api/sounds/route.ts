import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const soundsDir = path.join(process.cwd(), "public/sounds");

    // Check if directory exists
    if (!fs.existsSync(soundsDir)) {
      return NextResponse.json({ success: true, sounds: [] });
    }

    const files = fs.readdirSync(soundsDir);

    // Filter out valid audio files
    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".mp3", ".ogg", ".wav"].includes(ext);
    });

    return NextResponse.json({ success: true, sounds: audioFiles });
  } catch (error) {
    console.error("Error reading sounds directory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load sounds" },
      { status: 500 },
    );
  }
}
