"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { month: "فروردین", فروش: 186 },
  { month: "اردیبهشت", فروش: 305 },
  { month: "خرداد", فروش: 237 },
  { month: "تیر", فروش: 73 },
  { month: "مرداد", فروش: 209 },
  { month: "شهریور", فروش: 214 },
  { month: "مهر", فروش: 209 },
  { month: "آبان", فروش: 14 },
  { month: "آذر", فروش: 214 },
  { month: "دی", فروش: 327 },
  { month: "بهمن", فروش: 45 },
  { month: "اسفند", فروش: 21 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        {/* <CartesianGrid vertical={true} /> */}
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="فروش" fill="var(--color-gray)" radius={10} />
      </BarChart>
    </ChartContainer>
  );
}
