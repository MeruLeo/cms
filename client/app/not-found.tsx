"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">صفحه‌ای که دنبال آن هستید یافت نشد!</p>
      <Link href="/" className="px-6 py-3 bg-link rounded-2xl transition">
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
