"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useCalendarStore } from "@/lib/store";
import { MoreVertical, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "blue", class: "bg-blue-500" },
  { name: "red", class: "bg-red-500" },
  { name: "green", class: "bg-green-500" },
  { name: "yellow", class: "bg-yellow-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "orange", class: "bg-orange-500" },
];

export default function Sidebar() {
  const { currentDate, setDate, openModal, calendars, toggleCalendar, setCalendarColor, displayOnly, isSidebarOpen } = useCalendarStore();

  const renderCalendarItem = (id: 'personal' | 'work') => {
    const calendar = calendars[id];
    const colorObj = COLORS.find(c => c.name === calendar.color) || COLORS[0];

    return (
      <div className="flex items-center justify-between group h-9 pl-1 pr-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
        <div 
            className="flex items-center gap-3 flex-1"
            onClick={() => toggleCalendar(id)}
        >
            <div className={cn(
                "w-4 h-4 rounded flex items-center justify-center border transition-colors",
                calendar.isVisible ? colorObj.class : "border-gray-400 bg-transparent"
            )}>
                {calendar.isVisible && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700 font-medium">{calendar.label}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-full">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start" className="w-56 p-2">
            
            <DropdownMenuItem 
                onClick={() => displayOnly(id)}
                className="text-sm text-gray-700 hover:bg-gray-100 cursor-pointer py-2 mb-1"
            >
                Display this only
            </DropdownMenuItem>

            <div className="h-px bg-gray-200 my-1" />

            <DropdownMenuLabel className="text-xs font-normal text-gray-500 mb-2 mt-1">Choose color</DropdownMenuLabel>
            <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => (
                    <div 
                        key={c.name}
                        onClick={() => setCalendarColor(id, c.name)}
                        className={cn(
                            "w-6 h-6 rounded-full cursor-pointer hover:ring-2 ring-offset-1 ring-gray-300 flex items-center justify-center",
                            c.class
                        )}
                    >
                        {calendar.color === c.name && <Check className="w-3 h-3 text-white" />}
                    </div>
                ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  if (!isSidebarOpen) return null;
  return (
    <aside className="w-64 hidden md:flex flex-col p-3 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
      <div className="mb-6 pl-1">
        <Button 
          onClick={() => openModal(new Date())}
          className="rounded-full h-12 pl-3 pr-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] bg-white text-gray-700 hover:bg-gray-50 border-none flex items-center gap-3 transition-all hover:shadow-[0_4px_8px_3px_rgba(60,64,67,0.15)]"
        >
          <svg width="36" height="36" viewBox="0 0 36 36">
            <path fill="#34A853" d="M16 16v14h4V20z"></path>
            <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
            <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
            <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
            <path fill="none" d="M0 0h36v36H0z"></path>
          </svg>
          <span className="text-base font-normal tracking-wide">Create</span>
        </Button>
      </div>

      <div className="mb-4">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && setDate(date)}
          className="rounded-md p-0"
        />
      </div>

      <div className="relative mb-6">
        <input 
            type="text" 
            placeholder="Search for people" 
            className="w-full bg-gray-100 border-none rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-4">
        <div>
           <div className="flex items-center justify-between mb-2 group cursor-pointer">
            <span className="text-sm font-medium text-gray-700">My calendars</span>
          </div>
          <div className="space-y-1">
            {renderCalendarItem('personal')}
            {renderCalendarItem('work')}
          </div>
        </div>
      </div>
    </aside>
  );
}