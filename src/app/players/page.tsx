"use client";

import { useMatchStore } from "@/stores/core/match-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, UserPlus, Shield, Target, Users } from "lucide-react";
import { useState } from "react";
import { Player } from "@/constants/index.interfaces";
import { PlayerRole } from "@/constants/index.types";

export default function PlayersPage() {
  const { availablePlayers, removePlayerFromRoster, addPlayerToRoster } =
    useMatchStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: "",
    number: "",
    role: "Striker 4",
  });

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.number) return;

    addPlayerToRoster({
      id: Math.random().toString(36).substr(2, 9),
      name: newPlayer.name,
      number: newPlayer.number,
      role: newPlayer.role as PlayerRole,
    });

    setIsAdding(false);
    setNewPlayer({ name: "", number: "", role: "Striker 4" });
  };

  const roleIcons = {
    Libero: <Shield className="w-4 h-4 text-blue-500" />,
    "Striker 4": <Target className="w-4 h-4 text-red-500" />,
    "Striker 2": <Target className="w-4 h-4 text-orange-500" />,
    "Striker 3": <Target className="w-4 h-4 text-yellow-500" />,
    Passer: <Users className="w-4 h-4 text-green-500" />,
  };

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
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>إضافة لاعب جديد</CardTitle>
            <CardDescription>
              أدخل بيانات اللاعب الأساسية لإضافته للقائمة المتاحة.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPlayer} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم اللاعب</label>
                  <input
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPlayer.name}
                    onChange={(e) =>
                      setNewPlayer({ ...newPlayer, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم القميص</label>
                  <input
                    type="number"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPlayer.number}
                    onChange={(e) =>
                      setNewPlayer({ ...newPlayer, number: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">المركز (الدور)</label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newPlayer.role}
                  onChange={(e) =>
                    setNewPlayer({
                      ...newPlayer,
                      role: e.target.value as PlayerRole,
                    })
                  }
                >
                  <option value="Libero">ليبرو (Libero)</option>
                  <option value="Striker 4">ضارب 4 (Striker 4)</option>
                  <option value="Striker 2">ضارب 2 (Striker 2)</option>
                  <option value="Striker 3">ضارب 3 (Striker 3)</option>
                  <option value="Passer">معد (Passer)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ اللاعب</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availablePlayers.map((player) => (
          <Card
            key={player.id}
            className="group hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold bg-linear-to-br from-primary/20 to-primary/5">
                    {player.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{player.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      {roleIcons[player.role] || <Users className="w-4 h-4" />}
                      <span>{player.role}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePlayerFromRoster(player.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {availablePlayers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            لا يوجد لاعبين مسجلين بعد.
          </div>
        )}
      </div>
    </div>
  );
}
