"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6", className)}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 pt-0.5">{actions}</div>}
    </motion.div>
  );
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8", className)}>{children}</div>
  );
}
