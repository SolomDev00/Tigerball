"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, Target, Users } from "lucide-react";
import { Prisma } from "@prisma/client";

type LocalPlayer = Prisma.PlayerGetPayload<{
  include: {
    teams: {
      include: { team: true };
    };
  };
}>;

interface PlayerCardProps {
  player: LocalPlayer;
  onDelete: (id: string) => void;
}

const roleIcons = {
  Libero: <Shield className="w-4 h-4 text-blue-500" />,
  "Striker 4": <Target className="w-4 h-4 text-red-500" />,
  "Striker 2": <Target className="w-4 h-4 text-orange-500" />,
  "Striker 3": <Target className="w-4 h-4 text-yellow-500" />,
  Passer: <Users className="w-4 h-4 text-green-500" />,
};

export function PlayerCard({ player, onDelete }: PlayerCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold bg-linear-to-br from-primary/20 to-primary/5">
              {player.favoriteNumber}
            </div>
            <div>
              <h3 className="font-bold text-lg">{player.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                {roleIcons[
                  (player.roles?.[0] || "") as keyof typeof roleIcons
                ] || <Users className="w-4 h-4" />}
                <span>{player.roles?.[0] || "لاعب"}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(player.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
