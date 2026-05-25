"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  function select(id: string) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <div className={cn("flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => select(t.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            active === t.id
              ? "bg-slate-200 text-slate-900"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function useTabs(tabs: Tab[], defaultTab?: string) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return { active, setActive, tabs };
}
