"use client";

import { useEffect, useState } from "react";
import { useCalendarStore, Event } from "@/lib/store";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import EventModal from "@/components/event-modal";
import EventDetails from "@/components/event-details";
import { getEvents } from "@/app/action"; 
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
  format, isSameMonth, isToday, addDays, isSameDay, subDays
} from "date-fns";
import { 
  startOfYear, endOfYear, eachMonthOfInterval, 
  startOfDay, isAfter, compareAsc 
} from "date-fns";
import { cn } from "@/lib/utils";


export default function Home() {
  const { currentDate, view, openModal, setEvents, events, calendars } = useCalendarStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filteredEvents = events.filter((event) => {
    if (event.color === 'blue' || !event.color) return calendars.personal.isVisible;
    if (event.color === 'green') return calendars.work.isVisible;
    return true;
  });

  const getEventStyles = (dbColor: string) => {
    const calendarConfig = dbColor === 'green' ? calendars.work : calendars.personal;
    const color = calendarConfig.color;

    switch (color) {
      case 'red': return "bg-red-100 text-red-700 border-red-600 hover:bg-red-200";
      case 'green': return "bg-green-100 text-green-700 border-green-600 hover:bg-green-200";
      case 'yellow': return "bg-yellow-100 text-yellow-700 border-yellow-600 hover:bg-yellow-200";
      case 'purple': return "bg-purple-100 text-purple-700 border-purple-600 hover:bg-purple-200";
      case 'orange': return "bg-orange-100 text-orange-700 border-orange-600 hover:bg-orange-200";
      default: return "bg-blue-100 text-blue-700 border-blue-600 hover:bg-blue-200";
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, [setEvents]);

  const renderCustomDayView = (days: number) => {
    const start = startOfDay(currentDate); 
    const viewDates = Array.from({ length: days }).map((_, i) => addDays(start, i));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    return (
        <div className="flex flex-col h-full overflow-hidden">
             {/* Header */}
             <div className="flex border-b border-gray-200 pl-16 scrollbar-hide">
                {viewDates.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center py-3 border-l border-gray-200 first:border-l-0">
                         <span className={cn("text-[11px] font-medium uppercase mb-1", isToday(day) ? "text-blue-600" : "text-gray-500")}>
                             {format(day, "EEE")}
                         </span>
                         <div className={cn("w-10 h-10 flex items-center justify-center rounded-full text-2xl font-normal", isToday(day) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 cursor-pointer")}>
                             {format(day, "d")}
                         </div>
                    </div>
                ))}
            </div>
            {/* Grid Body (Same as Week View) */}
            <div className="flex-1 overflow-y-auto relative">
                 <div className="flex min-h-[1200px]">
                     <div className="w-16 flex-shrink-0 flex flex-col text-xs text-gray-500 text-right pr-2 -mt-2.5">
                         {hours.map(hour => (
                             <div key={hour} className="h-12 relative">
                                 <span className="relative -top-2">{hour === 0 ? '' : format(new Date().setHours(hour), "h a")}</span>
                             </div>
                         ))}
                     </div>
                     <div className="flex-1 grid grid-cols-4 border-l border-gray-200"> {/* grid-cols-4 explicitly */}
                        {viewDates.map((day, colIndex) => (
                             <div key={colIndex} className="border-r border-gray-200 relative">
                                 {hours.map(hour => {
                                     const hourEvents = filteredEvents.filter(event => 
                                        isSameDay(new Date(event.startTime), day) && 
                                        new Date(event.startTime).getHours() === hour
                                     );
                                     return (
                                         <div 
                                            key={hour} 
                                            className="h-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative group"
                                            onClick={() => {
                                                const d = new Date(day);
                                                d.setHours(hour);
                                                openModal(d);
                                            }}
                                         >
                                            {hourEvents.map(event => (
                                                <div 
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                                    className={cn("absolute inset-x-1 top-0 border-l-4 text-xs p-1 rounded shadow-sm z-10 overflow-hidden cursor-pointer", getEventStyles(event.color))}
                                                    style={{ height: '90%' }}
                                                >
                                                    <span className="font-semibold block">{event.title}</span>
                                                </div>
                                            ))}
                                         </div>
                                     );
                                 })}
                             </div>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
    );
  }


  const renderScheduleView = () => {
    const sortedEvents = filteredEvents
      .filter(e => isAfter(new Date(e.startTime), subDays(currentDate, 1)))
      .sort((a, b) => compareAsc(new Date(a.startTime), new Date(b.startTime)));

    const groupedEvents: { [key: string]: Event[] } = {};
    sortedEvents.forEach(event => {
        const dateKey = format(new Date(event.startTime), "yyyy-MM-dd");
        if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
        groupedEvents[dateKey].push(event);
    });

    return (
        <div className="flex flex-col h-full overflow-y-auto p-4">
            {Object.keys(groupedEvents).length === 0 ? (
                <div className="text-center text-gray-500 mt-10">No upcoming events</div>
            ) : (
                Object.keys(groupedEvents).map(dateKey => (
                    <div key={dateKey} className="mb-6">
                        <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100 mb-2 flex items-baseline gap-4">
                            <span className="font-medium text-sm text-gray-500 uppercase">{format(new Date(dateKey), "EEE")}</span>
                            <span className="text-xl font-medium text-gray-900">{format(new Date(dateKey), "d MMM")}</span>
                        </div>
                        <div className="space-y-2">
                            {groupedEvents[dateKey].map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={() => setSelectedEvent(event)}
                                    className="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-md cursor-pointer transition-colors"
                                >
                                    <div className="w-24 text-xs text-gray-500 text-right">
                                        {format(new Date(event.startTime), "h:mm a")}
                                    </div>
                                    <div className={cn("w-3 h-3 rounded-full", event.color === 'green' ? "bg-green-500" : "bg-blue-500")}></div>
                                    <div className="font-medium text-sm text-gray-700">{event.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
  }

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const months = eachMonthOfInterval({ start: yearStart, end: endOfYear(yearStart) });

    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
          {months.map((month) => {
            const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) });
            return (
              <div key={month.toISOString()}>
                <h3 className="text-sm font-medium text-gray-800 mb-3 ml-2">{format(month, "MMMM")}</h3>
                <div className="grid grid-cols-7 text-center">
                  {["S","M","T","W","T","F","S"].map((d, i) => (
                      <div key={`${d}-${i}`} className="text-[10px] text-gray-400 mb-1">{d}</div>
                  ))}
                  {days.map(day => (
                    <div 
                        key={day.toISOString()} 
                        className={cn(
                            "h-6 w-6 mx-auto flex items-center justify-center text-[10px] rounded-full cursor-pointer hover:bg-gray-100 relative",
                            !isSameMonth(day, month) && "invisible",
                            isToday(day) && "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                        onClick={() => {
                            useCalendarStore.setState({ currentDate: day, view: 'day' });
                        }}
                    >
                        {format(day, "d")}
                        {/* Tiny dot if event exists */}
                        {filteredEvents.some(e => isSameDay(new Date(e.startTime), day)) && !isToday(day) && (
                            <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-400"></div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  // --- Month View ---
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="py-2 text-[11px] font-medium text-gray-500 text-center uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
          {calendarDays.map((day) => {
            const dayEvents = filteredEvents.filter(event => isSameDay(new Date(event.startTime), day));
            return (
              <div
                key={day.toISOString()}
                onClick={() => openModal(day)}
                className={cn(
                  "border-b border-r border-gray-200 p-1 transition-colors hover:bg-gray-50 cursor-pointer min-h-[100px] overflow-hidden",
                  !isSameMonth(day, monthStart) && "bg-gray-50/30"
                )}
              >
                <div className="flex flex-col items-center mb-1">
                   <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full", isToday(day) ? "bg-blue-600 text-white" : !isSameMonth(day, monthStart) ? "text-gray-400" : "text-gray-700")}>
                    {format(day, "d")}
                    {format(day, "d") === "1" && !isToday(day) && <span className="ml-1">{format(day, "MMM")}</span>}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {dayEvents.map((event) => (
                    <div 
                        key={event.id}
                        className={cn(
                            "px-2 py-0.5 text-[11px] font-medium rounded truncate border-l-2 cursor-pointer relative z-10",
                            getEventStyles(event.color)
                        )}
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                    >
                        {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Week View ---
  const renderWeekView = () => {
    const start = startOfWeek(currentDate);
    const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    return (
        <div className="flex flex-col h-full overflow-hidden">
             <div className="flex border-b border-gray-200 pl-16 scrollbar-hide">
                {weekDates.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-center py-3 border-l border-gray-200 first:border-l-0">
                         <span className={cn("text-[11px] font-medium uppercase mb-1", isToday(day) ? "text-blue-600" : "text-gray-500")}>
                             {format(day, "EEE")}
                         </span>
                         <div className={cn("w-10 h-10 flex items-center justify-center rounded-full text-2xl font-normal", isToday(day) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 cursor-pointer")}>
                             {format(day, "d")}
                         </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto relative">
                 <div className="flex min-h-[1200px]">
                     <div className="w-16 flex-shrink-0 flex flex-col text-xs text-gray-500 text-right pr-2 -mt-2.5">
                         {hours.map(hour => (
                             <div key={hour} className="h-12 relative">
                                 <span className="relative -top-2">{hour === 0 ? '' : format(new Date().setHours(hour), "h a")}</span>
                             </div>
                         ))}
                     </div>
                     
                     <div className="flex-1 grid grid-cols-7 border-l border-gray-200">
                        {weekDates.map((day, colIndex) => (
                             <div key={colIndex} className="border-r border-gray-200 relative">
                                 {hours.map(hour => {
                                     const hourEvents = filteredEvents.filter(event => 
                                        isSameDay(new Date(event.startTime), day) && 
                                        new Date(event.startTime).getHours() === hour
                                     );

                                     return (
                                         <div 
                                            key={hour} 
                                            className="h-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative group"
                                            onClick={() => {
                                                const d = new Date(day);
                                                d.setHours(hour);
                                                openModal(d);
                                            }}
                                         >
                                            {hourEvents.map(event => (
                                                <div 
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                                    className={cn(
                                                        "absolute inset-x-1 top-0 border-l-4 text-xs p-1 rounded shadow-sm z-10 overflow-hidden cursor-pointer",
                                                        getEventStyles(event.color) // Use helper
                                                    )}
                                                    style={{ height: '90%' }}
                                                >
                                                    <span className="font-semibold block">{event.title}</span>
                                                    <span className="text-[10px]">{format(new Date(event.startTime), "h:mm a")}</span>
                                                </div>
                                            ))}
                                         </div>
                                     );
                                 })}
                             </div>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
    );
  }

  // --- Day View ---
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    return (
        <div className="flex flex-col h-full overflow-hidden">
             <div className="flex border-b border-gray-200 pl-16 py-4">
                <div className="flex flex-col">
                     <span className={cn("text-[11px] font-medium uppercase mb-1 text-gray-500", isToday(currentDate) && "text-blue-600")}>
                         {format(currentDate, "EEEE")}
                     </span>
                     <div className={cn("w-10 h-10 flex items-center justify-center rounded-full text-2xl font-normal", isToday(currentDate) ? "bg-blue-600 text-white" : "text-gray-700")}>
                         {format(currentDate, "d")}
                     </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative">
                 <div className="flex min-h-[1200px]">
                     <div className="w-16 flex-shrink-0 flex flex-col text-xs text-gray-500 text-right pr-2 -mt-2.5">
                         {hours.map(hour => (
                             <div key={hour} className="h-12 relative">
                                 <span className="relative -top-2">{hour === 0 ? '' : format(new Date().setHours(hour), "h a")}</span>
                             </div>
                         ))}
                     </div>
                     
                     <div className="flex-1 border-l border-gray-200 relative">
                         {hours.map(hour => {
                             const hourEvents = filteredEvents.filter(event => 
                                isSameDay(new Date(event.startTime), currentDate) && 
                                new Date(event.startTime).getHours() === hour
                             );

                             return (
                                 <div 
                                    key={hour} 
                                    className="h-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                                    onClick={() => {
                                        const d = new Date(currentDate);
                                        d.setHours(hour);
                                        openModal(d);
                                    }}
                                 >
                                    {hourEvents.map(event => (
                                        <div 
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                            className={cn(
                                                "absolute inset-x-2 top-0 border-l-4 text-sm p-2 rounded shadow-sm z-10 cursor-pointer",
                                                getEventStyles(event.color)
                                            )}
                                            style={{ height: '90%' }}
                                        >
                                            <div className="font-semibold">{event.title}</div>
                                            <div className="text-xs opacity-80">{format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}</div>
                                            {event.description && <div className="text-xs mt-1 line-clamp-1">{event.description}</div>}
                                        </div>
                                    ))}
                                 </div>
                             );
                         })}
                     </div>
                 </div>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
          <main className="flex-1 flex flex-col border-l border-t border-gray-200 overflow-hidden relative">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
            {view === '4days' && renderCustomDayView(4)}
            {view === 'schedule' && renderScheduleView()}
            {view === 'year' && renderYearView()}
          </main>
      </div>
      
      <EventModal /> 
      <EventDetails event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}