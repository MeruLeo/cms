"use client";

import React from "react";
import {
  useForm,
  Controller,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

// Define types for field configurations
type FieldType = "text" | "email" | "password" | "number" | "select";

export interface FieldConfig<T extends FieldValues> {
  name: keyof T;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[]; // For select fields
  validation?: z.ZodTypeAny; // Optional Zod schema for this field
}

interface DynamicFormProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  onSubmit: (data: T) => void; // Submit logic handler
  submitButtonTitle: string;
  formSchema?: z.ZodObject<any>; // Optional full Zod schema for the entire form
  defaultValues?: DefaultValues<T>;
}

// DynamicForm component
const DynamicForm = <T extends FieldValues>({
  fields,
  onSubmit,
  submitButtonTitle,
  formSchema,
  defaultValues,
}: DynamicFormProps<T>) => {
  // Create a default schema if not provided, based on fields
  const defaultSchema = fields.reduce((schema, field) => {
    return schema.extend({
      [field.name]:
        field.validation ||
        z.string().min(1, { message: `${field.label} الزامی است` }),
    });
  }, z.object({}));

  const schema = (formSchema || defaultSchema) as z.ZodType<T>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <Controller
          key={field.name as string}
          name={field.name}
          control={control}
          render={({ field: { onChange, value } }) => {
            const error = errors[field.name];
            const isInvalid = !!error;
            const errorMessage = error?.message as string;

            if (field.type === "select") {
              return (
                <Select
                  label={field.label}
                  selectedKeys={value ? [value as string] : []}
                  onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
                  isInvalid={isInvalid}
                  errorMessage={errorMessage}
                  selectionMode="single" // Explicitly set to single for better type inference
                >
                  {field.options
                    ? field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    : null}
                </Select>
              );
            } else {
              return (
                <Input
                  type={field.type}
                  label={field.label}
                  value={(value as string) || ""}
                  onChange={onChange}
                  radius="lg"
                  size="sm"
                  isInvalid={isInvalid}
                  errorMessage={errorMessage}
                />
              );
            }
          }}
        />
      ))}
      <Button fullWidth type="submit" color="primary">
        {submitButtonTitle}
      </Button>
    </form>
  );
};

export default DynamicForm;
