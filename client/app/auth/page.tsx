import { title } from "@/components/primitives";
import { Ripple } from "@/components/ui/ripple";
import { Button } from "@heroui/button";
import { LogIn, UserPlus } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <Ripple />
      </header>

      <main className="absolute flex flex-col justify-center items-center w-full gap-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className={`${title({ color: "blue" })} font-sf-pro-bold`}>
          مدرن ترین سیستم مدیریت محتوا
        </h1>
        <div className="flex gap-2 w-[15rem] flex-col">
          <Link className="bg-blue p-2 rounded-4xl" href="/auth/register">
            ساخت حساب
          </Link>
          <Link className="bg-gray3 p-2 rounded-4xl" href="/auth/login">
            ورود به حساب
          </Link>
        </div>
      </main>
    </div>
  );
}
