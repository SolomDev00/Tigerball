"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang].header;

  const NAV_LINKS = [
    { href: "/about", label: t.about },
    { href: "/projects", label: t.projects },
    { href: "/media-center", label: t.mediaCenter },
    { href: "/contact", label: t.contact },
    { href: "/login", label: t.login },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-9999 transition-all duration-300 h-24 flex items-center border-b border-transparent",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm h-20 border-gray-100"
          : "bg-transparent text-white",
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Right: Logo */}
        <Link
          href="/"
          className="shrink-0 relative z-10 transition-transform hover:scale-105"
        >
          <Image
            src={isScrolled ? "/logo-dark.svg" : "/logo.svg"}
            alt="Almajdouie Logo"
            width={180}
            height={60}
            className={cn("h-12 w-auto object-contain transition-all")}
          />
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-secondary relative group",
                isScrolled ? "text-primary" : "text-white",
              )}
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Left: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className={cn(
              "hidden md:inline-flex text-base hover:text-secondary hover:bg-transparent font-cairo",
              isScrolled ? "text-primary" : "text-white",
            )}
          >
            {t.languageBtn}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:text-secondary hover:bg-transparent",
              isScrolled ? "text-primary" : "text-white",
            )}
          >
            <SearchIcon className="w-5 h-5" />
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden hover:text-secondary hover:bg-transparent",
                  isScrolled ? "text-primary" : "text-white",
                )}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={lang === "ar" ? "right" : "left"}
              className="w-[300px] sm:w-[400px]"
            >
              <SheetHeader className="mb-8">
                <SheetTitle
                  className={cn(lang === "ar" ? "text-right" : "text-left")}
                >
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={140}
                    height={50}
                    className="w-32"
                  />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium hover:text-secondary transition-colors px-2 py-2 border-b border-border/50 hover:border-secondary",
                      lang === "ar" ? "text-right" : "text-left",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className={cn(
                    "px-2 text-lg font-medium hover:text-secondary hover:bg-transparent",
                    lang === "ar" ? "justify-end" : "justify-start",
                  )}
                >
                  {t.languageBtn}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
