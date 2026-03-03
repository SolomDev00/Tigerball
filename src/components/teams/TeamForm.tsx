"use client";

import { useForm, useFieldArray } from "react-hook-form";
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

interface InternalFormValues {
  name: string;
  slots: { playerId: string }[];
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
    control,
    reset,
    formState: { errors },
  } = useForm<InternalFormValues>({
    resolver: zodResolver(teamSchema as any), // Use any to bridge the gap between internal and external structure
    defaultValues: {
      name: "",
      slots: Array(6).fill({ playerId: "" }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "slots",
  });

  useEffect(() => {
    if (editingTeam) {
      const playerIds = editingTeam.players.map((tp) => tp.playerId);
      const slots = Array(6)
        .fill(null)
        .map((_, i) => ({ playerId: playerIds[i] || "" }));
      reset({
        name: editingTeam.name,
        slots,
      });
    } else {
      reset({
        name: "",
        slots: Array(6).fill({ playerId: "" }),
      });
    }
  }, [editingTeam, reset, isOpen]);

  const handleProcessSubmit = async (data: InternalFormValues) => {
    const validPlayerIds = data.slots
      .map((s) => s.playerId)
      .filter((id) => id !== "");

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
            أدخل اسم الفريق وقم بتعيين لاعبين للمراكز الستة الأساسية.
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
            <label className="text-sm font-semibold">تشكيلة المراكز</label>
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <select
                  {...register(`slots.${idx}.playerId`)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">-- خالي --</option>
                  {availablePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.favoriteNumber} - {p.name} ({p.roles?.[0] || "لاعب"})
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
