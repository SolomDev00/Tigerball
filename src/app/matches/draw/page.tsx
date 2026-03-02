"use client";

import { useState } from "react";
import { useMatchStore } from "@/stores/core/match-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, ArrowLeft, ShieldHalf, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MatchDrawPage() {
  const router = useRouter();
  const { teams: teamsData } = useMatchStore();

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<{
    home: string;
    away: string;
  } | null>(null);

  const toggleTeamSelection = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams((prev) => prev.filter((id) => id !== teamId));
    } else {
      setSelectedTeams((prev) => [...prev, teamId]);
    }
  };

  const handleDraw = () => {
    if (selectedTeams.length < 2) return;

    setIsDrawing(true);
    setDrawResult(null);

    // Simulate a spinning wheel delay
    setTimeout(() => {
      const shuffled = [...selectedTeams].sort(() => 0.5 - Math.random());
      setDrawResult({ home: shuffled[0], away: shuffled[1] });
      setIsDrawing(false);
    }, 2000);
  };

  const proceedToMatch = () => {
    // We would typically store this result in global state to pre-fill the match setup
    router.push(
      `/matches/new?home=${drawResult?.home}&away=${drawResult?.away}`,
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary flex items-center justify-center gap-3">
          <Shuffle className="w-10 h-10" />
          قرعة المباريات الحظ
        </h1>
        <p className="text-muted-foreground text-lg">
          اختر الفرق المشاركة ودع النظام يختار فريقين عشوائياً للمواجهة.
        </p>
      </div>

      {!drawResult && !isDrawing && (
        <Card className="border-2 border-dashed border-primary/30 p-8 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6 text-foreground">
              1. اختر الفرق للمشاركة في القرعة (الحد الأدنى 2)
            </h3>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {teamsData.map((team) => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => toggleTeamSelection(team.id)}
                    className={cn(
                      "relative px-6 py-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                      isSelected
                        ? "border-primary bg-primary/10 scale-105 shadow-md"
                        : "border-border bg-card hover:border-primary/50 text-muted-foreground",
                    )}
                  >
                    <ShieldHalf
                      className={cn(
                        "w-8 h-8",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="font-bold">{team.name}</span>
                    {isSelected && (
                      <Badge className="absolute -top-3 -right-3 bg-primary text-primary-foreground border-2 border-background w-6 h-6 rounded-full flex items-center justify-center p-0">
                        ✓
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              size="lg"
              className="w-full max-w-sm rounded-full h-14 text-lg font-bold shadow-lg"
              disabled={selectedTeams.length < 2}
              onClick={handleDraw}
            >
              <PlayCircle className="w-6 h-6 ml-2" /> إبدأ القرعة
            </Button>
          </div>
        </Card>
      )}

      {isDrawing && (
        <Card className="p-12 text-center border-primary/50 bg-primary/5 shadow-inner">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Shuffle
              className="w-20 h-20 text-primary animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <h2 className="text-3xl font-black text-primary animate-pulse">
              يتم الآن سحب الورق...
            </h2>
            <p className="text-muted-foreground font-semibold text-lg">
              النظام يختار بحيادية تامة 🎲
            </p>
          </div>
        </Card>
      )}

      {drawResult && !isDrawing && (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Home Team Result */}
            <Card className="flex-1 w-full border-4 border-primary/20 bg-linear-to-br from-primary/10 to-transparent relative overflow-hidden shadow-xl">
              <div className="absolute -top-10 -right-10 opacity-10">
                <ShieldHalf className="w-48 h-48" />
              </div>
              <CardContent className="p-8 flex flex-col items-center relative z-10">
                <Badge
                  variant="outline"
                  className="mb-4 bg-background px-4 py-1"
                >
                  الفريق المحلي (Home)
                </Badge>
                <h2 className="text-3xl font-black text-primary mb-2">
                  {teamsData.find((t) => t.id === drawResult.home)?.name}
                </h2>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center z-10">
              <div className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xl font-black shadow-lg ring-4 ring-background">
                VS
              </div>
            </div>

            {/* Away Team Result */}
            <Card className="flex-1 w-full border-4 border-secondary/20 bg-linear-to-br from-secondary/10 to-transparent relative overflow-hidden shadow-xl">
              <div className="absolute -top-10 -left-10 opacity-10">
                <ShieldHalf className="w-48 h-48" />
              </div>
              <CardContent className="p-8 flex flex-col items-center relative z-10">
                <Badge
                  variant="outline"
                  className="mb-4 bg-background px-4 py-1"
                >
                  الفريق الضيف (Away)
                </Badge>
                <h2 className="text-3xl font-black text-secondary mb-2">
                  {teamsData.find((t) => t.id === drawResult.away)?.name}
                </h2>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-12 px-8"
              onClick={() => setDrawResult(null)}
            >
              <Shuffle className="w-5 h-5 ml-2" /> سحب مرة أخرى
            </Button>
            <Button
              size="lg"
              className="rounded-full h-12 px-8 shadow-md"
              onClick={proceedToMatch}
            >
              الانتقال للمباراة <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
