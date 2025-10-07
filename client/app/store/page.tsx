import { HeaderSection } from "@/components/store/modules/headerSection";
import { MainSection } from "@/components/store/modules/mainSection";
import { widgetConfigStore } from "@/config/store/widgets.config";

export default function StorePage() {
  return (
    <section className="flex w-full overflow-auto h-fit flex-col items-center justify-center gap-2 py-5 px-4">
      <HeaderSection widgets={widgetConfigStore} />
      <MainSection />
    </section>
  );
}
