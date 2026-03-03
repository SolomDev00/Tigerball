"use client";

import { useSettingsStore } from "@/stores/core/settings-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Settings, Volume2, Palette, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const {
    courtTheme,
    whistleVolume,
    selectedWhistle,
    setCourtTheme,
    setWhistleVolume,
    setSelectedWhistle,
  } = useSettingsStore();

  const [sounds, setSounds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("/api/sounds")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSounds(data.sounds);
          // Auto select first if none selected
          if (!selectedWhistle && data.sounds.length > 0) {
            setSelectedWhistle(data.sounds[0]);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [selectedWhistle, setSelectedWhistle]);

  const themes = [
    { id: "wood", name: "ملعب خشبي (Wood)" },
    { id: "blue", name: "ملعب أزرق (Blue)" },
    { id: "sand", name: "شاطئي (Sand)" },
    { id: "classic", name: "كلاسيك (Classic)" },
  ] as const;

  const playPreview = () => {
    if (!selectedWhistle) return;
    const audio = new Audio(`/sounds/${selectedWhistle}`);
    audio.volume = whistleVolume;
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Settings className="w-8 h-8" />
          الإعدادات والتخصيص
        </h1>
        <p className="text-muted-foreground mt-2">
          خصّص مظهر شاشة المباريات وأصوات التنبيهات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Court Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" /> ثيمات الملعب
            </CardTitle>
            <CardDescription>
              اختر لون وشكل أرضية الملعب الذي يناسبك ليعرض في شاشة المطابقة
              الشغالة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCourtTheme(theme.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                    ${
                      courtTheme === theme.id
                        ? "border-primary bg-primary/10 scale-105 shadow-md font-bold"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }
                  `}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            <div className="bg-muted p-3 rounded-md flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="w-5 h-5 shrink-0" />
              يتم تطبيق هذا الثيم فوراً على شاشة "تعقب المقابلة" (Match
              Tracker).
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" /> إعدادات الصوت
            </CardTitle>
            <CardDescription>
              التحكم في مستويات أصوات التنبيهات وصفارة الحكم. يمكنك إضافة أي ملف
              صوتي لمجلد /public/sounds/ وسيظهر هنا.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>مستوى صوت الصافرة</span>
                <span>{Math.round(whistleVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={whistleVolume}
                onChange={(e) => setWhistleVolume(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <label className="text-sm font-semibold">اختر صوت الصافرة</label>
              <div className="flex items-center gap-2">
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={selectedWhistle || ""}
                  onChange={(e) => setSelectedWhistle(e.target.value)}
                >
                  {sounds.length === 0 && (
                    <option value="">
                      لا توجد أصوات (أضف في /public/sounds)
                    </option>
                  )}
                  {sounds.map((sound) => (
                    <option key={sound} value={sound}>
                      {sound}
                    </option>
                  ))}
                </select>
                <button
                  onClick={playPreview}
                  disabled={!selectedWhistle || isPlaying}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 break-keep whitespace-nowrap"
                >
                  {isPlaying ? "جاري العزف" : "تشغيل"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
