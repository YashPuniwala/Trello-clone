import z from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { RazorpayRedirect } from "./schema";

export type InputType = z.infer<typeof RazorpayRedirect>
export type ReturnType = ActionState<InputType, string>;