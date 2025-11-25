"use client";

import { useEffect, useState } from "react";
import { useCalendarStore } from "@/lib/store";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, AlignLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { createEvent, updateEvent } from "@/app/action";

export default function EventModal() {
  const { isModalOpen, closeModal, selectedDate, editingEvent } = useCalendarStore();
  
  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  
  // State for Color Selection
  const [selectedColor, setSelectedColor] = useState("blue"); 

  useEffect(() => {
    if (isModalOpen) {
      if (editingEvent) {
        // EDIT MODE: Fill state
        setTitle(editingEvent.title);
        setDescription(editingEvent.description || "");
        setDateStr(format(new Date(editingEvent.startTime), "yyyy-MM-dd"));
        setStartTime(format(new Date(editingEvent.startTime), "HH:mm"));
        setEndTime(format(new Date(editingEvent.endTime), "HH:mm"));
        setSelectedColor(editingEvent.color || "blue");
      } else if (selectedDate) {
        // CREATE MODE: Reset state
        setTitle("");
        setDescription("");
        setDateStr(format(selectedDate, "yyyy-MM-dd"));
        setStartTime("10:00");
        setEndTime("11:00");
        setSelectedColor("blue");
      }
    }
  }, [isModalOpen, selectedDate, editingEvent]);

  const handleSubmit = async (formData: FormData) => {
    
    if (editingEvent) {
      await updateEvent(editingEvent.id, formData);
    } else {
      await createEvent(formData);
    }
    closeModal();
    window.location.reload();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 overflow-hidden rounded-lg shadow-xl block">
        <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-200">
           <DialogTitle className="text-sm font-medium text-gray-600">
             {editingEvent ? "Edit Event" : "Add Event"}
           </DialogTitle>
        </div>
        
        <form action={handleSubmit} className="p-4">
          <div className="grid gap-4">
            <div className="pl-8">
                <Input 
                    name="title" 
                    placeholder="Add title" 
                    className="border-0 border-b border-gray-200 shadow-none text-2xl px-0 focus-visible:ring-0 rounded-none focus-visible:border-blue-500 placeholder:text-gray-400 font-normal" 
                    autoFocus
                    required
                    defaultValue={title} 
                    key={title} 
                />
            </div>

            <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-gray-500 mt-2.5" />
                <div className="grid gap-3 flex-1">
                    <div className="flex gap-2">
                        <Input 
                            type="date" 
                            name="date"
                            required
                            defaultValue={dateStr}
                            key={dateStr}
                            className="w-full border-gray-200 bg-gray-50/50"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Input type="time" name="startTime" required defaultValue={startTime} key={`start-${startTime}`} className="w-28 border-0 bg-gray-50/50" />
                        <span className="text-gray-400">-</span>
                        <Input type="time" name="endTime" required defaultValue={endTime} key={`end-${endTime}`} className="w-28 border-0 bg-gray-50/50" />
                    </div>
                </div>
            </div>

            {/* --- COLOR SELECTION UI --- */}
            <div className="flex items-center gap-4 pl-9 pb-2">
             <div className="flex gap-2">
                {/* Blue Option */}
                <div 
                    onClick={() => setSelectedColor("blue")}
                    className={`w-6 h-6 rounded-full bg-blue-600 cursor-pointer flex items-center justify-center hover:opacity-80 transition-all ${selectedColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}
                >
                    {selectedColor === "blue" && <Check className="w-3 h-3 text-white" />}
                </div>

                {/* Green Option */}
                <div 
                    onClick={() => setSelectedColor("green")}
                    className={`w-6 h-6 rounded-full bg-green-600 cursor-pointer flex items-center justify-center hover:opacity-80 transition-all ${selectedColor === 'green' ? 'ring-2 ring-offset-2 ring-green-600' : ''}`}
                >
                    {selectedColor === "green" && <Check className="w-3 h-3 text-white" />}
                </div>
             </div>
             <span className="text-sm text-gray-500">
                 {selectedColor === 'blue' ? 'Ananya' : 'Tasks'}
             </span>
            </div>

            <div className="flex items-start gap-4">
                <AlignLeft className="w-5 h-5 text-gray-500 mt-2.5" />
                <Textarea 
                    name="description" 
                    placeholder="Add description" 
                    className="resize-none min-h-[100px] border-0 bg-gray-50/50 focus:bg-white focus:ring-1 ring-blue-500 transition-all"
                    defaultValue={description}
                    key={description}
                />
            </div>
            <input type="hidden" name="color" value={selectedColor} />
            
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 font-medium">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}