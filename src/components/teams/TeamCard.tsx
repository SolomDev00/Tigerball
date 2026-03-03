"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit2, Trash2 } from "lucide-react";
import { TeamWithPlayers, LocalPlayer } from "./hooks/use-teams";

interface TeamCardProps {
  team: TeamWithPlayers;
  availablePlayers: LocalPlayer[];
  onEdit: (team: TeamWithPlayers) => void;
  onDelete: (id: string) => void;
}

export function TeamCard({
  team,
  availablePlayers,
  onEdit,
  onDelete,
}: TeamCardProps) {
  const getPlayerDetails = (playerId: string) => {
    return availablePlayers.find((p) => p.id === playerId);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-4 border-b bg-card">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>{team.name}</span>
          <Badge
            variant="outline"
            className="bg-background text-primary flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            {team.players.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          تشكيلة ثابتة من {team.players.length} لاعبين
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ul className="divide-y relative h-full">
          {Array(6)
            .fill(null)
            .map((_, index) => {
              const teamPlayerRef = team.players[index];
              const playerId = teamPlayerRef?.playerId;
              const player = playerId ? getPlayerDetails(playerId) : null;

              return (
                <li
                  key={index}
                  className="p-3 flex items-center justify-between hover:bg-muted/30"
                >
                  {player ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {player.favoriteNumber}
                        </span>
                        <span className="font-semibold">{player.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {player.roles?.[0] || "لاعب"}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic text-sm">
                      {playerId ? `لاعب محذوف (${playerId})` : `مركز فارغ`}
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </CardContent>

      <div className="flex items-center justify-between bg-muted/20 p-3 pt-4 border-t gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => onEdit(team)}
        >
          <Edit2 className="w-4 h-4 ml-2" /> تعديل
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(team.id)}
        >
          <Trash2 className="w-4 h-4 ml-2" /> حذف
        </Button>
      </div>
    </Card>
  );
}
