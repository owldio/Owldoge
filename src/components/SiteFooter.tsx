import React from "react";
import Link from "next/link";
import Image from "next/image";
import FooterLegal from "@/components/FooterLegal";

const footerLinks = [
  { name: "關於我們", href: "/about" },
  { name: "服務項目", href: "/services" },
  { name: "價目方案", href: "/pricing" },
  { name: "聯絡預約", href: "/contact" },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/owldio.art/" },
  { name: "Facebook", href: "https://www.facebook.com/share/19xTqkqM9Y/?mibextid=wwXIfr" },
  { name: "YouTube", href: "https://youtube.com/@owldioart?si=ypYR6wo0a1LLiGeS" },
];

/**
 * SiteFooter — shared programme colophon used across every page.
 * Warm night-deep ground, hairline rules, copper hovers.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-night-deep">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/Owldio.svg"
                alt="Owldio"
                width={30}
                height={30}
                className="h-7 w-7 brightness-0 invert opacity-90"
              />
              <span className="font-display text-lg font-medium tracking-[0.28em] text-parchment">
                OWLDIO
              </span>
            </div>
            <p className="text-sm font-light leading-relaxed text-parchment-faint">
              音樂會錄影、錄音與後製服務
              <br />
              owldio.art@gmail.com
            </p>
          </div>

          <div className="flex gap-16">
            <nav aria-label="網站導覽" className="flex flex-col gap-3.5">
              <span className="mb-1 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                SITE
              </span>
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-light text-parchment-dim transition-colors duration-300 hover:text-copper-bright"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <nav aria-label="社群連結" className="flex flex-col gap-3.5">
              <span className="mb-1 font-mono text-[10px] tracking-[0.3em] text-parchment-faint">
                SOCIAL
              </span>
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-parchment-dim transition-colors duration-300 hover:text-copper-bright"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 border-t border-hairline pt-7 text-parchment-faint">
          <div className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.25em] sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} OWLDIO. ALL RIGHTS RESERVED.</span>
            <span>BE THE MOMENT — WE MAKE IT STAY</span>
          </div>
          <FooterLegal className="mt-5" />
        </div>
      </div>
    </footer>
  );
}
