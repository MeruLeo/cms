"use client";

import DynamicForm, { FieldConfig } from "@/components/dynamicForm";
import { title } from "@/components/primitives";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import { z } from "zod";

const exampleSchema = z.object({
  fullName: z
    .string("نام کامل اجباری است")
    .min(3, "نام شما باید حداقل سه حرف داشته باشد")
    .max(64, "نام شما نمیتواند بیشتر از شصت و چهار حرف باشد"),
  username: z
    .string("نام کاربری اجباری است")
    .min(3, "نام کاربری باید حداقل سه حرف داشته باشد")
    .max(64, "نام کاربری نمیتواند بیشتر از شصت و چهار حرف باشد"),
  email: z.email("ایمیل اجباری است"),
  password: z
    .string("رمز عبور اجباری است")
    .min(8, "رمزعبور باید حداقل هشت حرف داشته باشد"),
});

type FormData = z.infer<typeof exampleSchema>;

const exampleFields: FieldConfig<FormData>[] = [
  {
    name: "fullName",
    label: "نام کامل شما",
    type: "text",
  },
  {
    name: "username",
    label: "نام کاربری",
    type: "text",
  },
  {
    name: "email",
    label: "ایمیل",
    type: "email",
  },
  {
    name: "password",
    label: "رمز عبور",
    type: "password",
  },
];

const handleSubmit = (data: FormData) => {
  console.log("Form data:", data);
  // Here, send to backend
};

export default function RegisterPage() {
  return (
    <section className="bg-gray4 border border-gray3 w-[20rem] p-4 rounded-4xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <div>
        <header className={title({ size: "sm" })}>خوش آمدید</header>
        {/* <p className="text-gray mt-2">به عنوان مدیر ادامه دهید</p> */}
      </div>
      <Divider className="my-6" />

      <main>
        <DynamicForm<FormData>
          fields={exampleFields}
          onSubmit={handleSubmit}
          submitButtonTitle="ثبت نام"
          formSchema={exampleSchema}
        />
      </main>

      <Divider className="my-6" />

      <footer>
        <div className="text-sm flex gap-2 text-center">
          <p>حساب کاربری دارید ؟</p>
          <Link className="text-link underline" href={`/auth/login`}>
            وارد شوید
          </Link>
        </div>
      </footer>
    </section>
  );
}
