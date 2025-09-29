import { Chart } from "@/components/chart";
import { Actions } from "@/components/home/actions";
import { HeaderWidget } from "@/components/home/header.widget";
import { widgetConfig } from "@/config/home/widget.config";
import { Button } from "@heroui/button";
import { ChartNoAxesColumn, Component } from "lucide-react";

export default function Home() {
  return (
    <section className="flex w-full overflow-auto h-fit flex-col items-center justify-center gap-2 py-5 px-4">
      <header className="w-full">
        <ul className="flex w-full gap-2 justify-between">
          {widgetConfig.map((w) => (
            <HeaderWidget key={w.header.title} {...w} />
          ))}
        </ul>
      </header>
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
    </section>
  );
}
