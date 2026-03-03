/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMatchStore } from "@/stores/core/match-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useMatchSetup } from "@/components/matches/hooks/use-match-setup";
import { MatchTeamSetup } from "@/components/matches/MatchTeamSetup";

function MatchSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { changeSet } = useMatchStore();
  const {
    dbTeams,
    loading,
    availablePlayers,
    homeTeamCourt,
    awayTeamCourt,
    assignPlayerToCourt,
    removePlayerFromCourt,
    loadTeamTemplate,
  } = useMatchSetup();

  useEffect(() => {
    if (loading) return;
    const homeParam = searchParams.get("home");
    const awayParam = searchParams.get("away");

    if (homeParam) loadTeamTemplate("Home", homeParam);
    if (awayParam) loadTeamTemplate("Away", awayParam);
  }, [searchParams, loading, loadTeamTemplate]);

  const handleStartMatch = () => {
    changeSet("Set1");
    // We pass the team IDs in the URL to the tracker for persistence
    const homeId = searchParams.get("home") || "";
    const awayId = searchParams.get("away") || "";
    router.push(`/matches/tracker?home=${homeId}&away=${awayId}`);
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
        <MatchTeamSetup
          teamType="Home"
          title="الفريق المحلي (Home)"
          dbTeams={dbTeams}
          availablePlayers={availablePlayers as any[]}
          court={homeTeamCourt}
          onLoadTemplate={loadTeamTemplate}
          onAssignPlayer={assignPlayerToCourt}
          onRemovePlayer={removePlayerFromCourt}
          defaultTeamId={searchParams.get("home") || undefined}
        />
        <MatchTeamSetup
          teamType="Away"
          title="الفريق الضيف (Away)"
          dbTeams={dbTeams}
          availablePlayers={availablePlayers as any[]}
          court={awayTeamCourt}
          onLoadTemplate={loadTeamTemplate}
          onAssignPlayer={assignPlayerToCourt}
          onRemovePlayer={removePlayerFromCourt}
          defaultTeamId={searchParams.get("away") || undefined}
        />
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
