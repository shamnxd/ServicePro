import { z } from "zod";

export const AddQuotationRemarkSchema = z.object({
  text: z.string().min(1, "Remark text is required"),
});

export type AddQuotationRemarkDto = z.infer<typeof AddQuotationRemarkSchema>;

export const EditQuotationRemarkSchema = z.object({
  text: z.string().min(1, "Remark text is required"),
});

export type EditQuotationRemarkDto = z.infer<typeof EditQuotationRemarkSchema>;
