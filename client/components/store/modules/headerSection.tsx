"use client";

import { HeaderWidgetStore } from "@/components/store/header.widget";

export function HeaderSection({ widgets }: { widgets: any[] }) {
  return (
    <header className="w-full">
      <ul className="flex w-full gap-2 justify-between">
        {widgets.map((w, i) => (
          <HeaderWidgetStore key={i} {...w} />
        ))}
      </ul>
    </header>
  );
}
