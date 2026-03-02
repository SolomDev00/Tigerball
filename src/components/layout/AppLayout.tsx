"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Volleyball, Trophy, LayoutDashboard, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/players", label: "اللاعبين", icon: Users },
  { href: "/matches/new", label: "مباراة جديدة", icon: Volleyball },
  { href: "/leaderboard", label: "قائمة المتصدرين", icon: Trophy },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavContentProps {
  pathname: string;
  onItemClick: () => void;
}

const NavContent = ({ pathname, onItemClick }: NavContentProps) => (
  <div className="flex flex-col gap-2 p-4">
    <div className="flex items-center justify-center py-6 mb-4">
      <Volleyball className="w-10 h-10 text-primary" />
      <span className="text-2xl font-bold mr-3 text-primary">Tigerball</span>
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
            "w-full justify-start text-lg h-12",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-primary/10",
          )}
          asChild
          onClick={onItemClick}
        >
          <Link href={item.href}>
            <Icon className="w-5 h-5 ml-3" />
            {item.label}
          </Link>
        </Button>
      );
    })}
  </div>
);

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-card border-l min-h-screen shadow-sm">
        <NavContent pathname={pathname} onItemClick={() => setIsOpen(false)} />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        <header className="lg:hidden h-16 bg-card border-b flex items-center px-4 justify-between sticky top-0 z-10">
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
              />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
