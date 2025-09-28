import { HeaderWidget } from "@/components/home/header.widget";
import { widgetConfig } from "@/config/home/widget.config";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 py-5 px-4">
      <header className="w-full">
        <ul className="flex w-full gap-2 justify-between">
          {widgetConfig.map((w) => (
            <HeaderWidget key={w.header.title} {...w} />
          ))}
        </ul>
      </header>
    </section>
  );
}
