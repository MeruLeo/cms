"use client";

import { HeaderWidget } from "@/components/home/header.widget";

export function HeaderSection({ widgets }: { widgets: any[] }) {
  return (
    <header className="w-full">
      <ul className="flex w-full gap-2 justify-between">
        {widgets.map((w, i) => (
          <HeaderWidget key={i} {...w} />
        ))}
      </ul>
    </header>
  );
}
