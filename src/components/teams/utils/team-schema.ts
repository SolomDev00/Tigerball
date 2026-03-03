import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "اسم الفريق يجب أن يكون حرفين على الأقل"),
  playerIds: z
    .array(z.string())
    .refine((items) => items.filter((id) => id.trim() !== "").length >= 1, {
      message: "يجب اختيار لاعب واحد على الأقل",
    })
    .refine(
      (items) => {
        const filledSlots = items.filter((id) => id.trim() !== "");
        return new Set(filledSlots).size === filledSlots.length;
      },
      {
        message: "لا يمكن اختيار نفس اللاعب مرتين في نفس الفريق",
      }
    ),
});

export type TeamFormValues = z.infer<typeof teamSchema>;