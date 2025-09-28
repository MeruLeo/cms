"use client";

import { Tabs, Tab } from "@heroui/tabs";

const timesWidgetTime = [
  {
    label: "امروز",
  },
  {
    label: "هفته",
  },
  {
    label: "ماه",
  },
  {
    label: "سال",
  },
];

export const TimesWidget = () => {
  return (
    <Tabs radius="full" fullWidth className="mt-4">
      {timesWidgetTime.map((time, i) => (
        <Tab title={time.label} key={i} />
      ))}
    </Tabs>
  );
};
