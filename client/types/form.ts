// types/form.ts
import { ZodTypeAny } from "zod";

export type FieldType = "text" | "email" | "password" | "number" | "textarea";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  validation?: ZodTypeAny; // اعتبارسنجی مخصوص این فیلد
}

export interface DynamicFormProps {
  fields: FormField[];
  submitLabel: string;
  onSubmit: (values: Record<string, any>) => void;
}
