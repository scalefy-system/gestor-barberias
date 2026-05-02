"use client";

import { useState } from "react";
import { Menu, Scissors } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/40">
        <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-secondary/60">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">Barber House</span>
        </div>
        <div className="w-9" />
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" showCloseButton={false} className="p-0 w-72 bg-card/40">
          <div onClick={() => setOpen(false)}>
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
