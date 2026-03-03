import { z } from "zod";

export const playerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  favoriteNumber: z
    .union([
      z.literal(""),
      z.coerce.number().min(1, "رقم القميص مطلوب").max(99),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  role: z.string().min(1, "المركز مطلوب"),
  phone: z.string().optional(),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .optional()
    .or(z.literal("")),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
