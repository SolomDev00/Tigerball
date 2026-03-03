"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Volleyball,
  Trophy,
  LayoutDashboard,
  Menu,
  Shuffle,
  ShieldHalf,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSettingsStore } from "@/stores/core/settings-store";

const navItems = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/players", label: "اللاعبين", icon: Users },
  { href: "/teams", label: "الفرق", icon: ShieldHalf },
  { href: "/matches/draw", label: "قرعة المباريات", icon: Shuffle },
  { href: "/leaderboard", label: "المتصدرين", icon: Trophy },
  { href: "/events", label: "الأخبار والأحداث", icon: CalendarDays },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavContentProps {
  pathname: string;
  onItemClick: () => void;
}

const NavContent = ({
  pathname,
  onItemClick,
  isCollapsed,
}: NavContentProps & { isCollapsed?: boolean }) => (
  <div className="flex flex-col gap-2 p-4 h-full overflow-hidden whitespace-nowrap">
    <div className="flex items-center justify-center py-6 mb-4">
      <Volleyball
        className={cn(
          "text-primary shrink-0 transition-all duration-500",
          isCollapsed ? "w-8 h-8" : "w-10 h-10 group-hover:rotate-180",
        )}
      />
      <span
        className={cn(
          "text-2xl font-bold mr-3 text-primary transition-opacity duration-300",
          isCollapsed ? "opacity-0 hidden" : "opacity-100",
        )}
      >
        Tigerball
      </span>
    </div>
    {navItems.map((item) => {
      const Icon = item.icon;
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);

      return (
        <Button
          key={item.href}
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "justify-start text-lg h-12 w-full",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-primary/10",
            isCollapsed ? "px-0 justify-center" : "px-3",
          )}
          asChild
          onClick={onItemClick}
        >
          <Link href={item.href} title={item.label}>
            <Icon className="w-6 h-6 shrink-0" />
            <span
              className={cn(
                "mr-3 transition-opacity duration-300",
                isCollapsed ? "opacity-0 hidden" : "opacity-100",
              )}
            >
              {item.label}
            </span>
          </Link>
        </Button>
      );
    })}
  </div>
);

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  return (
    <div className="min-h-screen bg-muted/30 flex w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-l min-h-screen shadow-sm transition-all duration-300 z-20 sticky top-0 group",
          isDesktopCollapsed ? "w-20 hover:w-72" : "w-72",
        )}
        onMouseEnter={() => setIsDesktopCollapsed(false)}
        onMouseLeave={() => setIsDesktopCollapsed(true)}
      >
        <NavContent
          pathname={pathname}
          onItemClick={() => setIsOpen(false)}
          isCollapsed={isDesktopCollapsed}
        />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden">
        <header className="lg:hidden h-16 bg-card border-b flex items-center px-4 justify-between sticky top-0 z-30 w-full shadow-sm">
          <div className="flex items-center">
            <Volleyball className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold mr-2 text-primary">
              Tigerball
            </span>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <NavContent
                pathname={pathname}
                onItemClick={() => setIsOpen(false)}
                isCollapsed={false}
              />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
