"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, AlignLeft } from "lucide-react";
import { format } from "date-fns";
import { deleteEvent } from "@/app/action";
import { useCalendarStore } from "@/lib/store";

interface EventDetailsProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  const { setEditingEvent, openModal } = useCalendarStore();

  if (!event) return null;

  const handleDelete = async () => {
    await deleteEvent(event.id);
    onClose();
    window.location.reload();
  };

  const handleEdit = () => {
    setEditingEvent(event);
    openModal(new Date(event.startTime));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden block">
        {/* Header with Actions */}
        <div className="flex justify-between items-center p-2 px-4 bg-gray-50 border-b">
           <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={handleEdit} className="text-gray-600 hover:text-blue-600">
               <Pencil className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" onClick={handleDelete} className="text-gray-600 hover:text-red-600">
               <Trash2 className="h-4 w-4" />
             </Button>
           </div>
        </div>
        
        <div className="p-6 pt-4">
           <div className="flex items-start gap-4 mb-4">
              <div className="w-4 h-4 rounded-sm bg-blue-600 mt-1.5 flex-shrink-0" />
              <div>
                <DialogTitle className="text-xl font-normal text-gray-800 leading-tight">
                    {event.title}
                </DialogTitle>
                <div className="text-sm text-gray-500 mt-1">
                    {format(new Date(event.startTime), "EEEE, MMMM d")} ⋅ {format(new Date(event.startTime), "h:mm a")} – {format(new Date(event.endTime), "h:mm a")}
                </div>
              </div>
           </div>

           {event.description && (
             <div className="flex items-start gap-4 mt-4">
                <AlignLeft className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}