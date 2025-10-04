"use client";

import { ChartNoAxesColumn, Component } from "lucide-react";
import { Chart } from "@/components/home/chart";
import { Actions } from "@/components/home/actions";

export function MainSection() {
  return (
    <main className="flex justify-between gap-2 w-full items-stretch">
      <section className="bg-gray4 p-4 rounded-4xl">
        <div className="flex items-center gap-2 mb-4">
          <ChartNoAxesColumn className="w-5 h-5 text-gray" />
          <h4 className="text-xl text-gray">آنالیز فروش سالانه</h4>
        </div>
        <Chart />
      </section>
      <section className="bg-gray4 p-4 rounded-4xl">
        <div className="flex items-center gap-2 mb-4">
          <Component className="w-5 h-5 text-gray" />
          <h4 className="text-xl text-gray">دسترسی سریع</h4>
        </div>
        <Actions />
      </section>
    </main>
  );
}
