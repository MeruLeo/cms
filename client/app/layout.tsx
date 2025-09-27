import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { sfBold, sfLight, sfMed } from "@/config/fonts";
import { Sidebar } from "@/components/sidebar";
import { CurrentNavbar } from "@/components/currentNavLable";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" dir="rtl">
      <head />
      <body
        className={clsx(
          sfLight.variable,
          sfMed.variable,
          sfBold.variable,
          "relative z-0 min-h-screen font-sf-med text-foreground bg-background antialiased"
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex h-screen">
            <Sidebar />
            <main className="mx-auto flex-grow">
              <CurrentNavbar />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
