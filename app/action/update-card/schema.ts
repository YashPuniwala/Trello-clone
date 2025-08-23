import z from "zod";

export const UpdateCard = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(3, { message: "Title is too short" })
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .min(5, { message: "Description is too short" })
    .optional(),
  id: z.string(),
  boardId: z.string(),
});
