"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { usePlayers } from "@/components/players/hooks/use-players";
import { PlayerForm } from "@/components/players/PlayerForm";
import { PlayerList } from "@/components/players/PlayerList";

export default function PlayersPage() {
  const { players, loading, isSubmitting, addPlayer, removePlayer } =
    usePlayers();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            إدارة اللاعبين
          </h1>
          <p className="text-muted-foreground mt-2">
            قم بإضافة، تعديل أو حذف اللاعبين المسجلين في النظام.
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            إضافة لاعب جديد
          </Button>
        )}
      </div>

      {isAdding && (
        <PlayerForm
          onSubmit={addPlayer}
          isSubmitting={isSubmitting}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <PlayerList players={players} loading={loading} onDelete={removePlayer} />
    </div>
  );
}
