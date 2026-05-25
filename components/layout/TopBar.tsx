"use client";

import { Bell, RefreshCw } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, subtitle, action }: TopBarProps) {
  return (
    <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
          <RefreshCw size={15} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-slate-900">
            A
          </div>
          <span className="text-xs text-slate-400">Admin</span>
        </div>
      </div>
    </div>
  );
}
