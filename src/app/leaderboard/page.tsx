"use client";

import { useMatchStore } from "@/stores/core/match-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal } from "lucide-react";

export default function LeaderboardPage() {
  const { actions, availablePlayers } = useMatchStore();

  // Aggregate stats per player
  const playerStats = availablePlayers
    .map((player) => {
      const playerActions = actions.filter((a) => a.playerNo === player.number);

      const defences = playerActions.filter(
        (a) => a.action === "Defence",
      ).length;
      const settings = playerActions.filter(
        (a) => a.action === "Setting",
      ).length;
      const strikes = playerActions.filter(
        (a) => a.action === "Striking",
      ).length;

      // An action only has an endPointAction if it's the final action of the point
      const blocks = playerActions.filter(
        (a) => a.endPointAction === "Block",
      ).length;
      const aces = playerActions.filter(
        (a) => a.endPointAction === "Ace",
      ).length;
      const faults = playerActions.filter(
        (a) =>
          a.endPointAction === "Fault" ||
          a.endPointAction === "Touch Net" ||
          a.endPointAction === "Out Side",
      ).length;

      // Simple mock score calculation
      const score =
        strikes * 2 +
        blocks * 3 +
        aces * 4 +
        defences * 1 +
        settings * 1 -
        faults * 2;

      return {
        ...player,
        defences,
        settings,
        strikes,
        blocks,
        aces,
        faults,
        score,
        totalTouches: playerActions.length,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          قائمة المتصدرين والإحصائيات
        </h1>
        <p className="text-muted-foreground mt-2">
          ترتيب اللاعبين وإحصائياتهم الشاملة بناءً على أدائهم في المباريات.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Top 3 Players Cards */}
        {playerStats.slice(0, 3).map((player, index) => (
          <Card
            key={player.id}
            className={`relative overflow-hidden ${index === 0 ? "border-yellow-500 shadow-yellow-500/20 shadow-lg scale-105 z-10" : ""}`}
          >
            {index === 0 && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-bl-full z-0 opacity-20"></div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {player.number}
                  </span>
                  {player.name}
                </span>
                {index === 0 && <Medal className="w-6 h-6 text-yellow-500" />}
                {index === 1 && <Medal className="w-6 h-6 text-slate-400" />}
                {index === 2 && <Medal className="w-6 h-6 text-amber-700" />}
              </CardTitle>
              <CardDescription>{player.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mt-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">التقييم العام</p>
                  <p className="text-3xl font-black text-primary">
                    {player.score}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">
                    إجمالي اللمسات: {player.totalTouches}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    الضرب الساحق: {player.strikes}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    الصد: {player.blocks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">الترتيب العام</TabsTrigger>
          <TabsTrigger value="strikers">أفضل الضاربين</TabsTrigger>
          <TabsTrigger value="defenders">أفضل المدافعين</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">المركز</TableHead>
                    <TableHead>اللاعب</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead className="text-center">اللمسات</TableHead>
                    <TableHead className="text-center text-blue-600">
                      استقبال
                    </TableHead>
                    <TableHead className="text-center text-green-600">
                      إعداد
                    </TableHead>
                    <TableHead className="text-center text-red-600">
                      ضرب
                    </TableHead>
                    <TableHead className="text-center text-slate-600">
                      صد
                    </TableHead>
                    <TableHead className="text-center text-yellow-600">
                      Ace
                    </TableHead>
                    <TableHead className="text-center text-destructive">
                      أخطاء
                    </TableHead>
                    <TableHead className="text-center font-bold">
                      التقييم
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerStats.map((player, i) => (
                    <TableRow key={player.id}>
                      <TableCell className="text-center font-bold">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {player.number}
                          </span>
                          {player.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {player.role}
                      </TableCell>
                      <TableCell className="text-center">
                        {player.totalTouches}
                      </TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">
                        {player.defences}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                        {player.settings}
                      </TableCell>
                      <TableCell className="text-center text-red-600 font-medium">
                        {player.strikes}
                      </TableCell>
                      <TableCell className="text-center text-slate-600 font-medium">
                        {player.blocks}
                      </TableCell>
                      <TableCell className="text-center text-yellow-600 font-medium">
                        {player.aces}
                      </TableCell>
                      <TableCell className="text-center text-destructive font-medium">
                        {player.faults}
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {player.score}
                      </TableCell>
                    </TableRow>
                  ))}
                  {playerStats.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-muted-foreground"
                      >
                        لا توجد بيانات متاحة لعرضها حتى الآن.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strikers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">المركز</TableHead>
                    <TableHead>اللاعب</TableHead>
                    <TableHead className="text-center">ضرب ساحق</TableHead>
                    <TableHead className="text-center">
                      إرسال ساحق (Ace)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...playerStats]
                    .sort((a, b) => b.strikes - a.strikes)
                    .map((player, i) => (
                      <TableRow key={player.id}>
                        <TableCell className="text-center font-bold">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-bold text-lg">
                          {player.strikes}
                        </TableCell>
                        <TableCell className="text-center text-yellow-600">
                          {player.aces}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defenders">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">المركز</TableHead>
                    <TableHead>اللاعب</TableHead>
                    <TableHead className="text-center">استقبال ناجح</TableHead>
                    <TableHead className="text-center">
                      صد هجومي (Block)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...playerStats]
                    .sort(
                      (a, b) => b.defences + b.blocks - (a.defences + a.blocks),
                    )
                    .map((player, i) => (
                      <TableRow key={player.id}>
                        <TableCell className="text-center font-bold">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {player.name}
                        </TableCell>
                        <TableCell className="text-center text-blue-600 font-bold text-lg">
                          {player.defences}
                        </TableCell>
                        <TableCell className="text-center text-slate-600 font-bold text-lg">
                          {player.blocks}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
