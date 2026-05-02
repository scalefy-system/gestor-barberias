"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scissors, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { signOut, getStoredUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Diego");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const u = getStoredUser();
    if (u) {
      setUserName(u.name);
      setUserEmail(u.email);
    }
  }, []);

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card/40">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Scissors className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold tracking-tight">Barber House</span>
          <span className="text-[11px] text-muted-foreground tracking-wider uppercase">Panel admin</span>
        </div>
      </div>

      <motion.nav
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex-1 overflow-y-auto p-3"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <motion.div key={item.id} variants={staggerItem}>
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all my-0.5",
                  "indent" in item && item.indent && "ml-6",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge && (
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 rounded-md p-2 hover:bg-secondary/60 transition-colors"
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center text-primary-foreground font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-left leading-tight overflow-hidden">
            <div className="text-sm font-medium truncate">{userName}</div>
            <div className="text-[11px] text-muted-foreground truncate">{userEmail || "barbería"}</div>
          </div>
          <LogOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </aside>
  );
}
