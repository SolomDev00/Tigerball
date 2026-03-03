/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { playerSchema, PlayerFormValues } from "./utils/player-schema";

interface PlayerFormProps {
  onSubmit: (values: PlayerFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function PlayerForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: PlayerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema as any),
    defaultValues: {
      name: "",
      favoriteNumber: undefined,
      role: "Striker 4",
      email: "",
      password: "",
      phone: "",
    },
  });

  const handleFormSubmit = async (values: PlayerFormValues) => {
    const success = await onSubmit(values);
    if (success) {
      reset();
    }
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>إضافة لاعب جديد</CardTitle>
        <CardDescription>
          أدخل بيانات اللاعب الأساسية ومعلومات الحساب الاختيارية.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم اللاعب</label>
              <input
                {...register("name")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم القميص</label>
              <input
                type="number"
                {...register("favoriteNumber", { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {errors.favoriteNumber && (
                <p className="text-xs text-destructive">
                  {errors.favoriteNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">المركز (الدور)</label>
              <select
                {...register("role")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="Libero">ليبرو (Libero)</option>
                <option value="Striker 4">ضارب 4 (Striker 4)</option>
                <option value="Striker 2">ضارب 2 (Striker 2)</option>
                <option value="Striker 3">ضارب 3 (Striker 3)</option>
                <option value="Passer">معد (Passer)</option>
              </select>
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">رقم الهاتف</label>
              <input
                {...register("phone")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              معلومات الحساب (اختياري)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ اللاعب"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
