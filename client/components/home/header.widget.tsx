"use client";

import React from "react";
import * as Icons from "lucide-react";

export interface HeaderWidgetProps {
  header: {
    title: string;
    optionalValue?: React.ReactNode;
    icon?: keyof typeof Icons;
  };
  main: {
    value: string;
  };
  footer?: {
    optionalValue?: React.ReactNode;
  };
  styles?: {
    bg?: string;
    fontSize?: string;
  };
}

export const HeaderWidget = ({
  header,
  main,
  footer,
  styles,
}: HeaderWidgetProps) => {
  const IconComponent = header.icon
    ? (Icons[header.icon] as React.ElementType)
    : null;

  return (
    <li
      className={`${styles?.bg ?? "bg-gray4"}  flex flex-col justify-between p-4 rounded-4xl h-[12rem] w-full`}
    >
      <header className="flex justify-between items-center w-full">
        <section className="flex items-center gap-2">
          {IconComponent ? (
            <IconComponent className="w-5 h-5 text-gray" />
          ) : null}
          <h4 className="text-xl text-gray">{header.title}</h4>
        </section>
        <section>
          <div>{header.optionalValue}</div>
        </section>
      </header>
      <main>
        <h2 className={`font-bold ${styles?.fontSize ?? "text-5xl"}`}>
          {main.value}
        </h2>
      </main>
      <footer>{footer?.optionalValue}</footer>
    </li>
  );
};
