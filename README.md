# 🗓️ Google Calendar Clone

A high-fidelity, full-stack clone of Google Calendar built with **Next.js 15**, **Tailwind CSS**, **Shadcn UI**, **Prisma**, and **SQLite**.

This project demonstrates a complex interactive UI, global state management, and persistent CRUD operations using modern React patterns (Server Actions).

## 🚀 Features

### 📅 Comprehensive Calendar Views
* **Month View**: Classic grid view with proper date alignment.
* **Week View**: Vertical time-grid layout with sticky headers.
* **Day View**: Focused daily schedule.
* **Year View**: 12-month overview (Interactive - click month to zoom to day).
* **Schedule View**: List/Agenda view of upcoming events.
* **4-Day View**: Rolling 4-day look ahead.

### ⚡ Event Management (CRUD)
* **Create**: Click anywhere on the grid or use the "Create" button.
* **Read**: Events appear across all views instantly.
* **Update**: Edit event details (Title, Date, Time, Description, Calendar/Color).
* **Delete**: Remove events directly from the details card.

### 🎨 UI & Interactivity
* **Sidebar Toggle**: Collapsible sidebar for full-screen calendar viewing.
* **Multi-Calendar Filtering**: Toggle visibility for "Personal" (Blue) or "Work" (Green) calendars.
* **Dynamic Styling**: Events are color-coded based on their category.
* **Responsive**: Adapts to different screen sizes.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix Primitives)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Global store for view state, dates, and modals)
* **Backend Logic**: Next.js Server Actions
* **Database**: SQLite (Local file-based DB)
* **ORM**: [Prisma](https://www.prisma.io/)
* **Date Handling**: [date-fns](https://date-fns.org/)
* **Icons**: Lucide React

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gcal-clone
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize the Database:**
    This project uses Prisma with SQLite. This command creates the local `dev.db` file based on `schema.prisma`.
    ```bash
    npx prisma db push
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture & Implementation Details

### State Management (Zustand)
To avoid "Prop Drilling" and ensure smooth interactions between the Sidebar, Header, and Main Grid, a global store (`useCalendarStore`) was used. It acts as the single source of truth for:
* `currentDate`: The reference date for navigation.
* `view`: The active view mode (Month/Week/Day/Year/etc).
* `calendars`: Visibility and configuration of sub-calendars.
* `isSidebarOpen`: Layout state.

### Data Fetching (Server Actions)
Instead of building a separate REST API, I utilized **Next.js Server Actions** (`src/app/actions.ts`).
* **Choice:** This allows for type-safe, direct backend logic execution from client components. It simplifies the codebase by removing the need for `fetch()` wrappers and API route handlers.

### 🎬 Animations & Interactions
* **CSS Transitions**: Tailwind's `transition-all` and `duration-300` utilities were used for the Sidebar toggle to ensure the layout resizes smoothly rather than snapping.
* **Modal Animations**: Shadcn UI (Radix) handles the entrance/exit animations for the Event Modal and Dropdowns, providing a native-app feel.
* **Hover States**: Grid cells and events have subtle hover states (`hover:bg-gray-50`) to provide immediate visual feedback.

## 🧠 Business Logic & Edge Cases

### Event Rendering Logic
* **Date Filtering**: Logic in `page.tsx` filters events using `date-fns` helpers (`isSameDay`, `isSameMonth`) to map them precisely to grid cells.
* **Time Slots**: In Week/Day views, events are mapped to specific hourly slots using `new Date(event.startTime).getHours()`.

### Edge Cases Handled
* **Navigation Consistency**: Switching views maintains the user's context (e.g., navigating to a specific date in "Year" view and switching to "Day" view keeps you on that date).
* **Edit vs Create**: The Event Modal intelligently detects if it's in "Edit Mode" (populating existing data) or "Create Mode" (defaulting to the selected grid date).
* **Overlap Conflicts**: Currently, events in the same time slot stack vertically within the grid cell. While they do not overlap visually side-by-side (like Google's advanced algorithm), they remain accessible and readable.

## 🔮 Suggestions for Future Enhancements
* **Drag and Drop**: Implement `dnd-kit` to allow moving events by dragging.
* **Advanced Overlap Handling**: Improve the Week View algorithm to calculate visual width percentages for overlapping events so they sit side-by-side.
* **Recurring Events**: Add RRULE support to the database schema to handle repeating events (Daily, Weekly, Monthly) without creating individual database entries for every instance.

---
*Submitted by Ananya Arramalla*
