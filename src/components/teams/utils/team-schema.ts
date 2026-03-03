import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "اسم الفريق يجب أن يكون حرفين على الأقل"),
  playerIds: z.array(z.string()).min(1, "يجب اختيار لاعب واحد على الأقل"),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
