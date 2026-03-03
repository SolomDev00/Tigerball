"use client";

import { useState } from "react";
import { ShieldHalf, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeams, TeamWithPlayers } from "@/components/teams/hooks/use-teams";
import { TeamList } from "@/components/teams/TeamList";
import { TeamForm } from "@/components/teams/TeamForm";
import { TeamFormValues } from "@/components/teams/utils/team-schema";

export default function TeamsPage() {
  const {
    teams,
    availablePlayers,
    loading,
    isSubmitting,
    addTeam,
    updateTeam,
    removeTeam,
  } = useTeams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamWithPlayers | null>(null);

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (team: TeamWithPlayers) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (values: TeamFormValues) => {
    if (editingTeam) {
      return await updateTeam(editingTeam.id, values);
    } else {
      return await addTeam(values);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <ShieldHalf className="w-8 h-8" />
            الفرق
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة الفرق الجاهزة لاستخدامها في المباريات.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shrink-0">
          <Plus className="w-5 h-5" />
          إضافة فريق جديد
        </Button>
      </div>

      <TeamList
        teams={teams}
        availablePlayers={availablePlayers}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={removeTeam}
      />

      <TeamForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        editingTeam={editingTeam}
        availablePlayers={availablePlayers}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
