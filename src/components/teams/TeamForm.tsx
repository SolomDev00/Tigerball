/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { teamSchema, TeamFormValues } from "./utils/team-schema";
import { TeamWithPlayers, LocalPlayer } from "./hooks/use-teams";
import { useEffect } from "react";

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TeamFormValues) => Promise<boolean>;
  editingTeam: TeamWithPlayers | null;
  availablePlayers: LocalPlayer[];
  isSubmitting: boolean;
}

export function TeamForm({
  isOpen,
  onClose,
  onSubmit,
  editingTeam,
  availablePlayers,
  isSubmitting,
}: TeamFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema as any),
    defaultValues: {
      name: "",
      playerIds: Array(9).fill(""),
    },
  });

  useEffect(() => {
    if (editingTeam) {
      const playerIds = editingTeam.players.map((tp) => tp.playerId);
      const paddedPlayerIds = Array(9)
        .fill("")
        .map((_, i) => playerIds[i] || "");

      reset({
        name: editingTeam.name,
        playerIds: paddedPlayerIds,
      });
    } else {
      reset({
        name: "",
        playerIds: Array(9).fill(""),
      });
    }
  }, [editingTeam, reset, isOpen]);

  const handleProcessSubmit = async (data: TeamFormValues) => {
    const validPlayerIds = data.playerIds.filter((id) => id.trim() !== "");

    const result = await onSubmit({
      name: data.name,
      playerIds: validPlayerIds,
    });

    if (result) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTeam ? "تعديل الفريق" : "إضافة فريق جديد"}
          </DialogTitle>
          <DialogDescription>
            أدخل اسم الفريق وقم بتعيين لاعبين للمراكز الأساسية والاحتياطية.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleProcessSubmit)}
          className="space-y-6 pt-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold">اسم الفريق</label>
            <input
              {...register("name")}
              placeholder="مثال: نسور النيل"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold">
              تشكيلة المراكز الأساسية
            </label>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {6 - idx}
                </div>
                <select
                  {...register(`playerIds.${idx}`)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">-- فاضي --</option>
                  {availablePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.favoriteNumber} - {p.name} ({p.roles?.[0] || "لاعب"})
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <label className="text-sm font-semibold text-amber-600">
                لاعبين احتياطيين
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                اختر لاعبين بدلاء لاستخدامهم أثناء المباريات.
              </p>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`reserve-${idx}`}
                  className="flex items-center gap-4 mb-3"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ب{idx + 1}
                  </div>
                  <select
                    {...register(`playerIds.${6 + idx}`)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-amber-200 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                  >
                    <option value="">-- فاضي --</option>
                    {availablePlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.favoriteNumber} - {p.name} ({p.roles?.[0] || "لاعب"})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {errors.playerIds && (
              <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded border border-red-100 mt-2">
                {errors.playerIds.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editingTeam ? "حفظ التعديلات" : "إضافة الفريق"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
