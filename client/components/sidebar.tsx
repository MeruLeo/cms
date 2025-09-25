import { siteConfig } from "@/config/site";
import { Logo } from "./icons";
import { SidebarItem } from "./item.sidebar";

export const Sidebar = () => {
  return (
    <div className="bg-red-500 p-4 h-screen w-[30%]">
      <header className="flex gap-2 items-center">
        <Logo />
        <p className="font-bold text-inherit">CMS</p>
      </header>
      <main className="flex flex-col gap-4">
        <p>منو</p>
        <ul className="space-y-2">
          {siteConfig.navItems.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </ul>
      </main>
      <footer></footer>
    </div>
  );
};
