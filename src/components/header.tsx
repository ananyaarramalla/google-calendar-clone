"use client";

import React from "react";
import { Menu, ChevronLeft, ChevronRight, Search, Settings, HelpCircle, Grip, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, endOfWeek, startOfWeek } from "date-fns";
import { useCalendarStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { currentDate, view, setView, next, prev, today, toggleSidebar } = useCalendarStore();

  const getHeaderText = () => {
    if (view === 'year') return format(currentDate, "yyyy");
    if (view === 'month') return format(currentDate, "MMMM yyyy");
    if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      if (format(start, 'MMM') === format(end, 'MMM')) {
          return `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`;
      }
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    }
    if (view === 'day') return format(currentDate, "MMMM d, yyyy");
    return format(currentDate, "MMMM yyyy");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 py-2 bg-white min-w-[1000px]">
      <div className="flex items-center gap-2 min-w-[240px]">
        <Button variant="ghost" size="icon" className="rounded-full text-gray-600" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 px-2">
          <span className="text-[22px] text-gray-600 relative top-[-1px]">Calendar</span>
        </div>
      </div>

      <div className="flex items-center flex-1 justify-between max-w-4xl">
         <div className="flex items-center gap-4">
            <Button variant="outline" className="px-4 h-9 text-sm font-medium" onClick={today}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={prev} className="rounded-full h-8 w-8">
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={next} className="rounded-full h-8 w-8">
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <h2 className="text-[22px] font-normal text-gray-700 ml-2">
              {getHeaderText()}
            </h2>
         </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 mr-2">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                <Search className="h-5 w-5" />
            </Button>

            {/* HELP MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                    <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">Help</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Training</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Send feedback to Google</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* SETTINGS MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                    <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Trash</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Appearance</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.print()}>
                    Print
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Get add-ons</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* View Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 px-3 gap-2 flex items-center bg-white min-w-[90px] justify-between">
              <span className="capitalize">{view === '4days' ? '4 Days' : view}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setView('day')}>
                <span>Day</span>
                <span className="ml-auto text-xs text-gray-500">D</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('week')}>
                <span>Week</span>
                <span className="ml-auto text-xs text-gray-500">W</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('month')}>
                <span>Month</span>
                <span className="ml-auto text-xs text-gray-500">M</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('year')}>
                <span>Year</span>
                <span className="ml-auto text-xs text-gray-500">Y</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('schedule')}>
                <span>Schedule</span>
                <span className="ml-auto text-xs text-gray-500">A</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView('4days')}>
                <span>4 days</span>
                <span className="ml-auto text-xs text-gray-500">X</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 pl-2">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                <Grip className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:bg-blue-700">
                A
            </div>
        </div>
      </div>
    </header>
  );
}