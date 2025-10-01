"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Skeleton } from "@heroui/skeleton";
import { formatNumber } from "@/utils/persianNumber";

const timesWidgetTime = [
  {
    label: "امروز",
    value: "day",
  },
  {
    label: "هفته",
    value: "week",
  },
  {
    label: "ماه",
    value: "month",
  },
  {
    label: "سال",
    value: "year",
  },
];

export const TimesWidget = ({
  periodRevenue,
  loading,
  selected,
  onChange,
}: {
  periodRevenue: number;
  loading: boolean;
  selected: "day" | "week" | "month" | "year"; // 🔥 کنترل کامل از والد
  onChange: (value: "day" | "week" | "month" | "year") => void;
}) => {
  return (
    <div className="">
      <Tabs
        placement="bottom"
        radius="full"
        fullWidth
        selectedKey={selected}
        onSelectionChange={(key) =>
          onChange(key as "day" | "week" | "month" | "year")
        }
      >
        {timesWidgetTime.map((time) => (
          <Tab title={time.label} key={time.value}>
            <div className="mb-4 text-center">
              {loading ? (
                <Skeleton className="h-10 w-4/5 rounded-full" />
              ) : (
                <span className="text-3xl font-bold">
                  {formatNumber(periodRevenue, "price")} تومان
                </span>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
