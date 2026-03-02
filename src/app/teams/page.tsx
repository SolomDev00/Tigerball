"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldHalf, Users, Plus, Edit2, Trash2 } from "lucide-react";
import { useMatchStore } from "@/stores/core/match-store";
import { TeamTemplate } from "@/constants/index.interfaces";

export default function TeamsPage() {
  const { availablePlayers, teams, addTeam, updateTeam, deleteTeam } =
    useMatchStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamTemplate | null>(null);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [teamPlayers, setTeamPlayers] = useState<string[]>(Array(6).fill(""));

  const getPlayerDetails = (playerId: string) => {
    return availablePlayers.find((p) => p.id === playerId);
  };

  const openAddDialog = () => {
    setEditingTeam(null);
    setTeamName("");
    setTeamPlayers(Array(6).fill(""));
    setIsDialogOpen(true);
  };

  const openEditDialog = (team: TeamTemplate) => {
    setEditingTeam(team);
    setTeamName(team.name);
    // Pad array to 6 elements in case of old data
    const players = [...team.players];
    while (players.length < 6) players.push("");
    setTeamPlayers(players.slice(0, 6));
    setIsDialogOpen(true);
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...teamPlayers];
    newPlayers[index] = value;
    setTeamPlayers(newPlayers);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    // Filter out empty player slots (optional, but a team usually needs 6)
    const validPlayers = teamPlayers.filter((p) => p !== "");

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: teamName,
        players: validPlayers,
      });
    } else {
      addTeam({
        id: Math.random().toString(36).substring(7),
        name: teamName,
        players: validPlayers,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الفريق؟")) {
      deleteTeam(id);
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
        <Button onClick={openAddDialog} className="gap-2 shrink-0">
          <Plus className="w-5 h-5" />
          إضافة فريق جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            لا يوجد فرق مسجلة. اضغط على أضف فريق جديد للبدء.
          </div>
        )}

        {teams.map((team) => (
          <Card
            key={team.id}
            className="overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
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
                {team.players.map((playerId, index) => {
                  const player = getPlayerDetails(playerId);
                  return (
                    <li
                      key={index}
                      className="p-3 flex items-center justify-between hover:bg-muted/30"
                    >
                      {player ? (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {player.number}
                            </span>
                            <span className="font-semibold">{player.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {player.role}
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

            {/* Actions Footer */}
            <div className="flex items-center justify-between bg-muted/20 p-3 pt-4 border-t gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => openEditDialog(team)}
              >
                <Edit2 className="w-4 h-4 ml-2" /> تعديل
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteTeam(team.id)}
              >
                <Trash2 className="w-4 h-4 ml-2" /> حذف
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? "تعديل الفريق" : "إضافة فريق جديد"}
            </DialogTitle>
            <DialogDescription>
              أدخل اسم الفريق وقم بتعيين لاعبين للمراكز الستة الأساسية.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTeam} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">اسم الفريق</label>
              <input
                required
                type="text"
                placeholder="مثال: نسور النيل"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold">تشكيلة المراكز</label>
              {[1, 2, 3, 4, 5, 6].map((pos, idx) => (
                <div key={pos} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {pos}
                  </div>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={teamPlayers[idx]}
                    onChange={(e) => handlePlayerChange(idx, e.target.value)}
                  >
                    <option value="">-- خالي --</option>
                    {availablePlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.number} - {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">
                {editingTeam ? "حفظ التعديلات" : "إضافة الفريق"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
