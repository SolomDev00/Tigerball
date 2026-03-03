/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, ShieldAlert, RefreshCcw, Flag, Loader2 } from "lucide-react";
import { TeamType, CourtPosition, EndAction } from "@/constants/index.types";

interface MatchTrackerModalsProps {
  // End Point
  isEndingPoint: boolean;
  onIsEndingPointChange: (open: boolean) => void;
  onEndPoint: (team: TeamType, action: EndAction) => void;
  // Cards
  isCardModalOpen: boolean;
  onIsCardModalOpenChange: (open: boolean) => void;
  onIssueCard: (type: "Yellow" | "Red") => void;
  // Sub
  isSubModalOpen: boolean;
  onIsSubModalOpenChange: (open: boolean) => void;
  subTeam: TeamType;
  onSubTeamChange: (team: TeamType) => void;
  homeTeamCourt: any[];
  awayTeamCourt: any[];
  availablePlayers: any[];
  onAssignPlayer: (
    team: TeamType,
    pos: CourtPosition,
    playerId: string,
  ) => void;
  // End Match
  isEndingMatch: boolean;
  onIsEndingMatchChange: (open: boolean) => void;
  isSavingMatch: boolean;
  homeScore: number;
  awayScore: number;
  onEndMatch: () => void;
}

export function MatchTrackerModals({
  isEndingPoint,
  onIsEndingPointChange,
  onEndPoint,
  isCardModalOpen,
  onIsCardModalOpenChange,
  onIssueCard,
  isSubModalOpen,
  onIsSubModalOpenChange,
  subTeam,
  onSubTeamChange,
  homeTeamCourt,
  awayTeamCourt,
  availablePlayers,
  onAssignPlayer,
  isEndingMatch,
  onIsEndingMatchChange,
  isSavingMatch,
  homeScore,
  awayScore,
  onEndMatch,
}: MatchTrackerModalsProps) {
  return (
    <>
      {/* End Point Dialog */}
      <Dialog open={isEndingPoint} onOpenChange={onIsEndingPointChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              تحديد نتيجة النقطة
            </DialogTitle>
            <DialogDescription>
              اختر الفريق الفائز وسبب إنهاء النقطة.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-6">
            <div className="space-y-4">
              <div className="text-center font-bold text-lg text-primary border-b pb-2">
                فوز المحلي (Home)
              </div>
              <div className="flex flex-col gap-2">
                {["Inside", "Block", "Ace", "Fault"].map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="justify-start hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onEndPoint("Home", action as EndAction)}
                  >
                    {action === "Inside" && "كرة داخل الملعب (Inside)"}
                    {action === "Block" && "صد هجومي (Block)"}
                    {action === "Ace" && "إرسال ساحق (Ace)"}
                    {action === "Fault" && "خطأ منافس (Fault)"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center font-bold text-lg text-secondary border-b pb-2">
                فوز الضيف (Away)
              </div>
              <div className="flex flex-col gap-2">
                {["Inside", "Block", "Ace", "Fault"].map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="justify-start hover:bg-secondary hover:text-secondary-foreground"
                    onClick={() => onEndPoint("Away", action as EndAction)}
                  >
                    {action === "Inside" && "كرة داخل الملعب (Inside)"}
                    {action === "Block" && "صد هجومي (Block)"}
                    {action === "Ace" && "إرسال ساحق (Ace)"}
                    {action === "Fault" && "خطأ منافس (Fault)"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="col-span-2 space-y-4 mt-4 text-center">
              <div className="text-center font-bold text-lg text-muted-foreground border-b pb-2">
                أخطاء مشتركة أو خارجية
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => onEndPoint("Away", "Out Side")}
                >
                  خارج الملعب (Out Side) - لصالح الضيف
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEndPoint("Home", "Out Side")}
                >
                  خارج الملعب (Out Side) - لصالح المحلي
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEndPoint("Away", "Touch Net")}
                >
                  لمس الشبكة (Touch Net) - لصالح الضيف
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onEndPoint("Home", "Touch Net")}
                >
                  لمس الشبكة (Touch Net) - لصالح المحلي
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Issue Dialog */}
      <Dialog open={isCardModalOpen} onOpenChange={onIsCardModalOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              منح بطاقة انضباطية
            </DialogTitle>
            <DialogDescription>
              هل تريد منح اللاعب بطاقة صفراء للتحذير أم حمراء للاستبعاد؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button
              className="flex-1 h-14 text-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              onClick={() => onIssueCard("Yellow")}
            >
              بطاقة صفراء
            </Button>
            <Button
              className="flex-1 h-14 text-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => onIssueCard("Red")}
            >
              بطاقة حمراء
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Substitutions Dialog */}
      <Dialog open={isSubModalOpen} onOpenChange={onIsSubModalOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <RefreshCcw className="w-6 h-6 text-primary" />
              تغيير اللاعبين والمراكز
            </DialogTitle>
            <DialogDescription>
              اختر الفريق وقم بتغيير اللاعبين في المراكز الحالية.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex justify-center gap-4 border-b pb-4">
              <Button
                variant={subTeam === "Home" ? "default" : "outline"}
                onClick={() => onSubTeamChange("Home")}
                className="w-32"
              >
                المحلي (Home)
              </Button>
              <Button
                variant={subTeam === "Away" ? "default" : "outline"}
                onClick={() => onSubTeamChange("Away")}
                className="w-32"
              >
                الضيف (Away)
              </Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((pos) => {
                const position = pos as CourtPosition;
                const court =
                  subTeam === "Home" ? homeTeamCourt : awayTeamCourt;
                const currentObj = court.find((c) => c.position === position);
                const currentPlayerId = currentObj?.player?.id || "empty";

                return (
                  <div key={pos} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {pos}
                    </div>
                    <div className="flex-1">
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={currentPlayerId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "empty") {
                            onAssignPlayer(subTeam, position, val);
                          }
                        }}
                      >
                        <option value="empty">-- اختر لاعب للتبديل --</option>
                        {availablePlayers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.favoriteNumber} - {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => onIsSubModalOpenChange(false)}
            >
              إغلاق وتطبيق التعديلات
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Match Dialog */}
      <Dialog open={isEndingMatch} onOpenChange={onIsEndingMatchChange}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex justify-center items-center gap-2 text-destructive">
              <Flag className="w-6 h-6" />
              إنهاء المباراة
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center space-y-4">
            <h2 className="text-5xl font-black text-primary">
              {homeScore} - {awayScore}
            </h2>
            <p className="text-muted-foreground text-lg">
              هل أنت متأكد من إنهاء هذه المباراة نهائياً وتسجيل النتيجة والأحداث
              في قاعدة البيانات؟
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onIsEndingMatchChange(false)}
              disabled={isSavingMatch}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={onEndMatch}
              disabled={isSavingMatch}
            >
              {isSavingMatch ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Flag className="w-4 h-4" />
              )}
              تأكيد الإنهاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
