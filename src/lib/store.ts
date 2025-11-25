import { create } from 'zustand';
import { 
  addMonths, subMonths, 
  addWeeks, subWeeks, 
  addDays, subDays, 
  addYears, subYears 
} from 'date-fns';

export type Event = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  color: string;
};

type ViewType = 'month' | 'week' | 'day' | 'year' | 'schedule' | '4days';

export type CalendarConfig = {
  label: string;
  color: string;
  isVisible: boolean;
};

interface CalendarState {
  currentDate: Date;
  view: ViewType;
  isModalOpen: boolean;
  selectedDate: Date | null;
  events: Event[];
  editingEvent: Event | null;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  

  calendars: {
    personal: CalendarConfig; // Maps to 'blue' events
    work: CalendarConfig;     // Maps to 'green' events
  };

  displayOnly: (id: 'personal' | 'work') => void;
  setDate: (date: Date) => void;
  setView: (view: ViewType) => void;
  openModal: (date: Date) => void;
  closeModal: () => void;
  setEvents: (events: Event[]) => void;
  setEditingEvent: (event: Event | null) => void;
  
  toggleCalendar: (id: 'personal' | 'work') => void;
  setCalendarColor: (id: 'personal' | 'work', color: string) => void;

  next: () => void;
  prev: () => void;
  today: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  currentDate: new Date(),
  view: 'month',
  isModalOpen: false,
  selectedDate: null,
  events: [],
  editingEvent: null,
  isSidebarOpen: true,

  calendars: {
    personal: { label: "Ananya", color: "blue", isVisible: true },
    work: { label: "Tasks", color: "green", isVisible: true },
  },

  setDate: (date) => set({ currentDate: date }),
  setView: (view) => set({ view }),
  setEvents: (events) => set({ events }),
  setEditingEvent: (event) => set({ editingEvent: event }),
  
  openModal: (date) => set({ isModalOpen: true, selectedDate: date }),
  closeModal: () => set({ isModalOpen: false, selectedDate: null, editingEvent: null }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleCalendar: (id) => set((state) => ({
    calendars: {
      ...state.calendars,
      [id]: { ...state.calendars[id], isVisible: !state.calendars[id].isVisible }
    }
  })),

  setCalendarColor: (id, color) => set((state) => ({
    calendars: {
      ...state.calendars,
      [id]: { ...state.calendars[id], color: color }
    }
  })),

  displayOnly: (id) => set((state) => ({
    calendars: {
      personal: { ...state.calendars.personal, isVisible: id === 'personal' },
      work: { ...state.calendars.work, isVisible: id === 'work' },
    }
  })),

  next: () => set((state) => {
    switch (state.view) {
      case 'year': return { currentDate: addYears(state.currentDate, 1) };
      case 'month': return { currentDate: addMonths(state.currentDate, 1) };
      case 'week': return { currentDate: addWeeks(state.currentDate, 1) };
      case '4days': return { currentDate: addDays(state.currentDate, 4) };
      case 'day': 
      case 'schedule': return { currentDate: addDays(state.currentDate, 1) };
      default: return { currentDate: addMonths(state.currentDate, 1) };
    }
  }),
  
  prev: () => set((state) => {
    switch (state.view) {
      case 'year': return { currentDate: subYears(state.currentDate, 1) };
      case 'month': return { currentDate: subMonths(state.currentDate, 1) };
      case 'week': return { currentDate: subWeeks(state.currentDate, 1) };
      case '4days': return { currentDate: subDays(state.currentDate, 4) };
      case 'day': 
      case 'schedule': return { currentDate: subDays(state.currentDate, 1) };
      default: return { currentDate: subMonths(state.currentDate, 1) };
    }
  }),
  
  today: () => set({ currentDate: new Date() }),
}));