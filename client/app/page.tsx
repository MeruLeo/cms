import { Chart } from "@/components/home/chart";
import { Actions } from "@/components/home/actions";
import { HeaderWidget } from "@/components/home/header.widget";
import { widgetConfig } from "@/config/home/widget.config";
import { Button } from "@heroui/button";
import { ChartNoAxesColumn, Component, UsersRound } from "lucide-react";
import { UsersPreview } from "@/components/home/userPriview";
import AnimatedList from "@/components/animatedList";

export default function Home() {
  const users = [
    {
      fullName: "علی رضایی",
      email: "ali@example.com",
      countOfBuys: 12,
      createdAt: "1402/07/01",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
    {
      fullName: "مریم محمدی",
      email: "maryam@example.com",
      countOfBuys: 5,
      createdAt: "1401/12/10",
    },
  ];

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
      <footer className="flex justify-between gap-2 w-full items-stretch">
        <section className="bg-gray4 p-4 rounded-4xl">
          <div className="flex items-center gap-2 mb-4">
            <UsersRound className="w-5 h-5 text-gray" />
            <h4 className="text-xl text-gray">مشریان جدید</h4>
          </div>
          <AnimatedList items={users} displayScrollbar={false} />
        </section>
        <section className="bg-gray4 p-4 rounded-4xl">
          <div className="flex items-center gap-2 mb-4">
            <UsersRound className="w-5 h-5 text-gray" />
            <h4 className="text-xl text-gray">مشریان جدید</h4>
          </div>
          <UsersPreview />
        </section>
      </footer>
    </section>
  );
}
