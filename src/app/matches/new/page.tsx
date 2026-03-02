"use client";

import { useMatchStore } from "@/stores/core/match-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Users, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourtPosition, TeamType } from "@/constants/index.types";
import { useEffect, Suspense } from "react";

function MatchSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    availablePlayers,
    homeTeamCourt,
    awayTeamCourt,
    assignPlayerToCourt,
    removePlayerFromCourt,
    changeSet,
    teams,
  } = useMatchStore();

  // Load team template function
  const loadTeamTemplate = (teamType: TeamType, teamId: string) => {
    if (!teamId) return;
    const teamData = teams.find((t) => t.id === teamId);
    if (!teamData) return;

    // Clear current court for this team
    [1, 2, 3, 4, 5, 6].forEach((pos) =>
      removePlayerFromCourt(teamType, pos as CourtPosition),
    );

    // Assign new players
    teamData.players.forEach((playerId, index) => {
      const position = (index + 1) as CourtPosition;
      assignPlayerToCourt(teamType, position, playerId);
    });
  };

  // Check URL params on mount
  useEffect(() => {
    const homeParam = searchParams.get("home");
    const awayParam = searchParams.get("away");

    if (homeParam) loadTeamTemplate("Home", homeParam);
    if (awayParam) loadTeamTemplate("Away", awayParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleStartMatch = () => {
    // Basic validation: Could enforce 6 players per team, but let's allow starting anyway for testing
    changeSet("Set1");
    router.push("/matches/tracker");
  };

  const renderTeamSetup = (team: TeamType, title: string) => {
    const court = team === "Home" ? homeTeamCourt : awayTeamCourt;

    return (
      <Card className="flex-1">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                تكوين {title}
              </CardTitle>
              <CardDescription>
                اختر اللاعبين لكل مركز في التشكيلة الأساسية
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-muted-foreground" />
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                onChange={(e) => loadTeamTemplate(team, e.target.value)}
                defaultValue={searchParams.get(team.toLowerCase()) || ""}
              >
                <option value="">استيراد من الفرق...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((pos) => {
            const position = pos as CourtPosition;
            const currentObj = court.find((c) => c.position === position);
            const currentPlayerId = currentObj?.player?.id || "empty";

            return (
              <div key={pos} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {pos}
                </div>
                <div className="flex-1">
                  {/* Using standard select since shadcn Select might need installation and we want native speed here */}
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentPlayerId}
                    onChange={(e) => {
                      if (e.target.value === "empty") {
                        removePlayerFromCourt(team, position);
                      } else {
                        assignPlayerToCourt(team, position, e.target.value);
                      }
                    }}
                  >
                    <option value="empty">-- اختر لاعب للمركز {pos} --</option>
                    {availablePlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.number} - {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            إعداد مباراة جديدة
          </h1>
          <p className="text-muted-foreground mt-2">
            قم بتوزيع اللاعبين على المراكز من 1 إلى 6 لكلا الفريقين.
          </p>
        </div>
        <Button
          onClick={handleStartMatch}
          size="lg"
          className="gap-2 px-8 text-lg h-12"
        >
          بدء المباراة
          <ArrowLeft className="w-5 h-5 rtl:hidden inline-block" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {renderTeamSetup("Home", "الفريق المحلي (Home)")}
        {renderTeamSetup("Away", "الفريق الضيف (Away)")}
      </div>
    </div>
  );
}

export default function NewMatchSetup() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12 animate-pulse text-lg font-bold text-primary">
          جاري تحميل البيانات...
        </div>
      }
    >
      <MatchSetupContent />
    </Suspense>
  );
}
