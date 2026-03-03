import { create } from "zustand";
import { getSettings, saveSetting } from "@/app/actions/settings";

type CourtTheme = "blue" | "sand" | "wood" | "classic";

interface SettingsState {
  courtTheme: CourtTheme;
  whistleVolume: number;
  selectedWhistle: string | null;
  initialize: () => Promise<void>;
  setCourtTheme: (theme: CourtTheme) => void;
  setWhistleVolume: (volume: number) => void;
  setSelectedWhistle: (whistle: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  courtTheme: "wood",
  whistleVolume: 0.5,
  selectedWhistle: null,

  initialize: async () => {
    const res = await getSettings();
    if (res.success && res.data) {
      set({
        courtTheme: (res.data.courtTheme as CourtTheme) || "wood",
        whistleVolume: res.data.whistleVolume
          ? parseFloat(res.data.whistleVolume)
          : 0.5,
        selectedWhistle: res.data.selectedWhistle || null,
      });
    }
  },

  setCourtTheme: (theme) => {
    set({ courtTheme: theme });
    saveSetting("courtTheme", theme);
  },

  setWhistleVolume: (volume) => {
    set({ whistleVolume: volume });
    saveSetting("whistleVolume", volume.toString());
  },

  setSelectedWhistle: (whistle) => {
    set({ selectedWhistle: whistle });
    saveSetting("selectedWhistle", whistle || "");
  },
}));
