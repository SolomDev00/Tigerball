"use client";

import { Loader2 } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { TeamWithPlayers, LocalPlayer } from "./hooks/use-teams";

interface TeamListProps {
  teams: TeamWithPlayers[];
  availablePlayers: LocalPlayer[];
  loading: boolean;
  onEdit: (team: TeamWithPlayers) => void;
  onDelete: (id: string) => void;
}

export function TeamList({
  teams,
  availablePlayers,
  loading,
  onEdit,
  onDelete,
}: TeamListProps) {
  if (loading) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
        لا يوجد فرق مسجلة. اضغط على أضف فريق جديد للبدء.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          availablePlayers={availablePlayers}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
