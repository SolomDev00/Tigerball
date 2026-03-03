"use client";

import { Loader2 } from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { Prisma } from "@prisma/client";

type LocalPlayer = Prisma.PlayerGetPayload<{
  include: {
    teams: {
      include: { team: true };
    };
  };
}>;

interface PlayerListProps {
  players: LocalPlayer[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function PlayerList({ players, loading, onDelete }: PlayerListProps) {
  if (loading) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
        لا يوجد لاعبين مسجلين بعد.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} onDelete={onDelete} />
      ))}
    </div>
  );
}
