import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { Bell, Cog, Settings, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

export const Navbar = ({ title }: { title: string }) => {
  const pathname = usePathname();

  const hiddenPaths = ["/auth"];
  const isAuthRoute = hiddenPaths.some((p) => pathname.startsWith(p));

  if (isAuthRoute) return null;

  const searchInput = (
    <Input
      aria-label="Search"
      radius="full"
      classNames={{
        inputWrapper: "bg-default-100 border border-gray3",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder="جستجو..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-gray4 border-b border-gray3"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold  text-2xl text-inherit">{title}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            className="bg-default-100 p-2 rounded-full border border-gray3"
            isExternal
            aria-label="Github"
            href={siteConfig.links.github}
          >
            <GithubIcon className="text-default-500" />
          </Link>
          <Link
            className="bg-default-100 p-2 border border-gray3 rounded-full"
            aria-label="Notification-center"
            href={`/settings`}
          >
            <Bell className="text-default-500" />
          </Link>
          <Link
            className="bg-default-100 p-2 border border-gray3 rounded-full"
            aria-label="Settings"
            href={`/settings`}
          >
            <Cog className="text-default-500" />
          </Link>

          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>

        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
    </HeroUINavbar>
  );
};
