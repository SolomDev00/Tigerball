"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Download } from "lucide-react";
import { TeamType, CourtPosition } from "@/constants/index.types";
import { DbTeam } from "./hooks/use-match-setup";

interface MatchTeamSetupProps {
  teamType: TeamType;
  title: string;
  dbTeams: DbTeam[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availablePlayers: any[]; // Use any[] temporarily for store-to-prisma bridge
  court: { position: CourtPosition; player: any | null }[];
  onLoadTemplate: (teamType: TeamType, teamId: string) => void;
  onAssignPlayer: (
    teamType: TeamType,
    pos: CourtPosition,
    playerId: string,
  ) => void;
  onRemovePlayer: (teamType: TeamType, pos: CourtPosition) => void;
  defaultTeamId?: string;
}

export function MatchTeamSetup({
  teamType,
  title,
  dbTeams,
  availablePlayers,
  court,
  onLoadTemplate,
  onAssignPlayer,
  onRemovePlayer,
  defaultTeamId,
}: MatchTeamSetupProps) {
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
              onChange={(e) => onLoadTemplate(teamType, e.target.value)}
              defaultValue={defaultTeamId || ""}
            >
              <option value="">استيراد من الفرق...</option>
              {dbTeams.map((t) => (
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
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={currentPlayerId}
                  onChange={(e) => {
                    if (e.target.value === "empty") {
                      onRemovePlayer(teamType, position);
                    } else {
                      onAssignPlayer(teamType, position, e.target.value);
                    }
                  }}
                >
                  <option value="empty">-- اختر لاعب للمركز {pos} --</option>
                  {availablePlayers.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.favoriteNumber} - {p.name} ({p.roles?.[0] || ""})
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
}
