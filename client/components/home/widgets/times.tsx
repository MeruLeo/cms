"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useOrderStore } from "@/stores/order.store";
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

export const TimesWidget = () => {
  const { periodRevenue, fetchPeriodRevenue, loading } = useOrderStore();
  const [selected, setSelected] = useState<"day" | "week" | "month" | "year">(
    "day"
  );

  useEffect(() => {
    fetchPeriodRevenue(selected);
  }, [selected, fetchPeriodRevenue]);

  return (
    <div className="">
      <Tabs
        placement="bottom"
        radius="full"
        fullWidth
        selectedKey={selected}
        onSelectionChange={(key) =>
          setSelected(key as "day" | "week" | "month" | "year")
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
