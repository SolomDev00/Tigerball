import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getPlayers,
  createPlayer,
  deletePlayer as deleteDbPlayer,
} from "@/app/actions/players";
import { Prisma } from "@prisma/client";
import { PlayerFormValues } from "../utils/player-schema";

type LocalPlayer = Prisma.PlayerGetPayload<{
  include: {
    teams: {
      include: { team: true };
    };
  };
}>;

export function usePlayers() {
  const [players, setPlayers] = useState<LocalPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPlayers();
      if (res.success) {
        setPlayers(res.data as LocalPlayer[]);
      } else {
        toast.error("فشل في تحميل بيانات اللاعبين");
      }
    } catch (_error) {
      toast.error("حدث خطأ في عرض اللاعبين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const addPlayer = async (values: PlayerFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createPlayer({
        name: values.name,
        favoriteNumber: values.favoriteNumber,
        roles: [values.role],
        gender: "MALE",
        email: values.email || undefined,
        password: values.password || undefined,
        phone: values.phone || undefined,
      });

      if (res.success && res.data) {
        toast.success("تم اضافة اللاعب بنجاح");
        // We cast to LocalPlayer because we know createPlayer returns the player object
        setPlayers((prev) => [res.data as LocalPlayer, ...prev]);
        return true;
      } else {
        toast.error("فشل في إضافة اللاعب");
        return false;
      }
    } catch (_error) {
      toast.error("حدث خطأ في النظام");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePlayer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا اللاعب؟")) return;

    try {
      const res = await deleteDbPlayer(id);
      if (res.success) {
        toast.success("تم الحذف بنجاح");
        setPlayers((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("فشل في حذف اللاعب");
      }
    } catch (_error) {
      toast.error("حدث خطأ في النظام");
    }
  };

  return {
    players,
    loading,
    isSubmitting,
    addPlayer,
    removePlayer,
    refresh: fetchPlayers,
  };
}
