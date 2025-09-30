"use client";

import DynamicForm, { FieldConfig } from "@/components/dynamicForm";
import { title } from "@/components/primitives";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import { z } from "zod";

const exampleSchema = z.object({
  identifier: z
    .string("ایمیل یا نام کاربری الزامی است")
    .min(3, "نام کاربری یا ایمیل باید حداقل سه حرف باشد"),
  password: z
    .string("رمزعبور الزامی است")
    .min(8, "رمزعبور باید حداقل هشت حرف باشد"),
});

type FormData = z.infer<typeof exampleSchema>;

const exampleFields: FieldConfig<FormData>[] = [
  {
    name: "identifier",
    label: "ایمیل یا نام کاربری",
    type: "text",
  },
  {
    name: "password",
    label: "رمزعبور",
    type: "password",
  },
];

const handleSubmit = (data: FormData) => {
  console.log("Form data:", data);
  // Here, send to backend
};

export default function LogInPage() {
  return (
    <section className="bg-gray4 border border-gray3 w-[20rem] p-4 rounded-4xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <div>
        <header className={title({ size: "sm" })}>وارد شوید</header>
        <p className="text-gray mt-2">به عنوان مدیر ادامه دهید</p>
      </div>
      <Divider className="my-6" />

      <main>
        <DynamicForm<FormData>
          fields={exampleFields}
          onSubmit={handleSubmit}
          submitButtonTitle="ارسال"
          formSchema={exampleSchema}
        />
      </main>

      <Divider className="my-6" />

      <footer>
        <div className="text-sm flex gap-2 text-center">
          <p>رمزعبور خود را فراموش کردید ؟</p>
          <Link className="text-link underline" href={`/auth/register`}>
            بازنشانی
          </Link>
        </div>
        <div className="text-sm flex gap-2 text-center">
          <p>حساب کاربری ندارید ؟</p>
          <Link className="text-link underline" href={`/auth/register`}>
            ایجاد کنید
          </Link>
        </div>
      </footer>
    </section>
  );
}
