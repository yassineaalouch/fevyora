"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPage } from "@/lib/track";

export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) trackPage(pathname);
  }, [pathname]);
  return null;
}
