"use client";

import { useMatchDraw } from "@/components/matches/hooks/use-match-draw";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  Dices,
  RotateCcw,
  Plus,
  ArrowRight,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function MatchDrawPage() {
  const {
    dbTeams,
    loading,
    selectedTeams,
    isDrawing,
    drawResult,
    toggleTeamSelection,
    handleDraw,
    proceedToMatch,
    resetDraw,
  } = useMatchDraw();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            قرعة المباراة
          </h1>
          <p className="text-muted-foreground mt-2">
            اختر فريقين على الأقل لإجراء القرعة واختيار طرفي المباراة.
          </p>
        </div>
        <Link href="/teams">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            إدارة الفرق
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Team Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              الفرق المتاحة
              <Badge variant="secondary" className="px-3">
                {selectedTeams.length} مختار
              </Badge>
            </CardTitle>
            <CardDescription>
              اضغط على الفرق التي تريد إدخالها في القرعة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dbTeams.map((team) => (
                <div
                  key={team.id}
                  role="button"
                  onClick={() => toggleTeamSelection(team.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedTeams.includes(team.id)
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        selectedTeams.includes(team.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {team.players.length} لاعبين
                      </p>
                    </div>
                    {selectedTeams.includes(team.id) && (
                      <Badge className="bg-primary hover:bg-primary">
                        مختار
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Actions and Result */}
        <div className="space-y-6">
          <Card
            className={`${
              isDrawing ? "border-primary shadow-lg ring-1 ring-primary" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-xl">نتيجة القرعة</CardTitle>
              <CardDescription>
                سيتم اختيار فريقين عشوائياً من القائمة المختارة.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!drawResult && !isDrawing && (
                <div className="py-10 text-center border-2 border-dashed rounded-xl space-y-4">
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Dices className="w-12 h-12 mb-2 opacity-20" />
                    <p>المباراة لم تبدأ بعد</p>
                  </div>
                  <Button
                    onClick={handleDraw}
                    disabled={selectedTeams.length < 2}
                    className="w-full max-w-[200px] gap-2"
                  >
                    <Dices className="w-5 h-5" />
                    بدء القرعة
                  </Button>
                </div>
              )}

              {isDrawing && (
                <div className="py-10 text-center space-y-6">
                  <div className="relative inline-block">
                    <Dices className="w-16 h-16 text-primary animate-bounce" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold animate-pulse">
                      جاري سحب الفرق...
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      لحظات من الترقب...
                    </p>
                  </div>
                </div>
              )}

              {drawResult && !isDrawing && (
                <div className="space-y-8 py-4">
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-full flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        H
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-primary font-semibold">
                          فريق الأرض
                        </p>
                        <h4 className="text-xl font-bold">
                          {dbTeams.find((t) => t.id === drawResult.home)?.name}
                        </h4>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border w-[200px]"></div>
                      <div className="relative bg-background px-4 font-black italic text-2xl text-primary">
                        VS
                      </div>
                    </div>

                    <div className="w-full flex items-center gap-4 bg-muted p-4 rounded-xl border border-border">
                      <div className="w-8 h-8 rounded-full bg-muted-foreground text-background flex items-center justify-center font-bold">
                        A
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-semibold">
                          فريق الضيف
                        </p>
                        <h4 className="text-xl font-bold">
                          {dbTeams.find((t) => t.id === drawResult.away)?.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={proceedToMatch}
                      className="w-full gap-2 text-lg h-12"
                    >
                      متابعة لإعداد المباراة
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetDraw}
                      className="w-full gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      إعادة القرعة
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">معلومات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                القرعة ستقوم باختيار فريقين بشكل عشوائي تماماً من الفرق التي قمت
                بتحديدها في القائمة. فريق الأرض سيتم وضعه في الجانب المحلي،
                والفريق الآخر في جانب الضيف.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
