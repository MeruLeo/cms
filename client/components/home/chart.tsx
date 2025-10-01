"use client";

import { Bar, BarChart, XAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useOrderStore } from "@/stores/order.store";
import { useEffect } from "react";

const chartConfig = {
  sales: {
    label: "تعداد فروش ها",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const jalaliMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export function Chart() {
  const { fetchMonthlySales, monthlySales } = useOrderStore();

  useEffect(() => {
    fetchMonthlySales();
  }, [fetchMonthlySales]);

  const reversedData = [...monthlySales].reverse();

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart data={reversedData}>
        <XAxis
          dataKey="month"
          tickLine={true}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value: number) => jalaliMonths[value - 1]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value: number) => jalaliMonths[value - 1]}
            />
          }
        />
        <Bar dataKey="sales" fill="#2563eb" radius={10} />
      </BarChart>
    </ChartContainer>
  );
}
