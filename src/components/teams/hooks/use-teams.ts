"use client";

import { useState, useEffect, useCallback } from "react";
import { Prisma } from "@prisma/client";
import {
  getTeams,
  createTeam,
  updateTeam as updateDbTeam,
  deleteTeam as deleteDbTeam,
} from "@/app/actions/teams";
import { getPlayers } from "@/app/actions/players";
import toast from "react-hot-toast";
import { TeamFormValues } from "../utils/team-schema";

export type TeamWithPlayers = Prisma.TeamGetPayload<{
  include: {
    players: {
      include: {
        player: true;
      };
    };
  };
}>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type LocalPlayer = Prisma.PlayerGetPayload<{}>;

export function useTeams() {
  const [teams, setTeams] = useState<TeamWithPlayers[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<LocalPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const res = await getTeams();
      if (res.success) {
        setTeams(res.data ?? []);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الفرق");
    }
  }, []);

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await getPlayers();
      if (res.success) {
        setAvailablePlayers(res.data ?? []);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل اللاعبين");
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchPlayers()]);
      setLoading(false);
    }
    init();
  }, [fetchTeams, fetchPlayers]);

  const addTeam = async (values: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createTeam(values.name, values.playerIds);
      if (res.success) {
        toast.success("تم إنشاء الفريق بنجاح");
        await fetchTeams();
        return true;
      } else {
        toast.error("فشل إنشاء الفريق");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ في النظام");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTeam = async (id: string, values: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await updateDbTeam(id, values.name, values.playerIds);
      if (res.success) {
        toast.success("تم تحديث الفريق بنجاح");
        await fetchTeams();
        return true;
      } else {
        toast.error("فشل تحديث الفريق");
        return false;
      }
    } catch (error) {
      toast.error("حدث خطأ في النظام");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTeam = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفريق؟")) return;

    try {
      const res = await deleteDbTeam(id);
      if (res.success) {
        toast.success("تم الحذف بنجاح");
        setTeams((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error("فشل حذف الفريق");
      }
    } catch (error) {
      toast.error("حدث خطأ في النظام");
    }
  };

  return {
    teams,
    availablePlayers,
    loading,
    isSubmitting,
    addTeam,
    updateTeam,
    removeTeam,
    refreshTeams: fetchTeams,
  };
}
