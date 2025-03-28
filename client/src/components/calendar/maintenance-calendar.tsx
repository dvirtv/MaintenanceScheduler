import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  MapPin, 
  User, 
  AlertCircle,
  Clock, 
  Wrench,
  FileText
} from 'lucide-react';
import { formatDate, formatLongDate } from '@/lib/utils/dates';

// Import styles for react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css'; // Custom CSS file for RTL and styling overrides

// Setup date-fns localizer for Hebrew
const locales = {
  'he': he,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Event interface
interface MaintenanceEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  equipmentId: number;
  equipmentName: string;
  maintenanceType: string;
  assignedTo?: string;
  location?: string;
  notes?: string;
}

interface MaintenanceCalendarProps {
  events: MaintenanceEvent[];
  onEventClick?: (event: MaintenanceEvent) => void;
  onSlotSelect?: (slotInfo: SlotInfo) => void;
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({
  events,
  onEventClick,
  onSlotSelect,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Custom event styling
  const eventStyleGetter = (event: MaintenanceEvent) => {
    // Determine if event is in the past
    const isPast = event.start < new Date();
    
    // Apply different styling based on event properties
    let style: React.CSSProperties = {
      backgroundColor: '#0F4C81', // Default color (primary)
      borderRadius: '4px',
      opacity: 1,
      color: 'white',
      border: '0',
      display: 'block',
    };
    
    if (isPast) {
      // Past events
      style.backgroundColor = '#3C4858'; // Neutral dark
      style.opacity = 0.8;
    } else if (event.title.includes('דחוף') || event.maintenanceType.includes('דחוף')) {
      // Urgent maintenance
      style.backgroundColor = '#EB5757'; // Danger color
    } else if (event.title.includes('בדיקה') || event.maintenanceType.includes('בדיקה')) {
      // Inspection
      style.backgroundColor = '#F2994A'; // Warning color
    }
    
    return {
      style,
      className: 'rbc-event-content',
    };
  };

  // Handle event click
  const handleSelectEvent = (event: MaintenanceEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (onSlotSelect) {
      onSlotSelect(slotInfo);
    }
  };

  // Get badge style based on date
  const getDateBadgeStyle = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return "bg-neutral-dark text-white";
    }
    
    // Check if today
    if (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()) {
      return "bg-warning text-white";
    }
    
    // Check if within the next 7 days
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    if (date <= nextWeek) {
      return "bg-primary text-white";
    }
    
    return "bg-success text-white";
  };

  return (
    <div className="h-[600px] rtl-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        culture="he"
        messages={{
          month: 'חודש',
          week: 'שבוע',
          day: 'יום',
          agenda: 'רשימה',
          today: 'היום',
          previous: 'הקודם',
          next: 'הבא',
          noEventsInRange: 'אין משימות תחזוקה מתוזמנות בטווח זה',
          showMore: (total: number) => `+ עוד ${total}`,
        }}
      />
      
      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">פרטי משימת תחזוקה</DialogTitle>
            <DialogDescription>
              {selectedEvent?.maintenanceType || "משימת תחזוקה"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">{selectedEvent.equipmentName}</h3>
                  {selectedEvent.location && (
                    <div className="flex items-center text-sm text-neutral-dark mt-1">
                      <MapPin className="ml-1" size={14} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                
                <Badge className={getDateBadgeStyle(selectedEvent.start)}>
                  {selectedEvent.start < new Date() ? "עבר" : "מתוזמן"}
                </Badge>
              </div>
              
              <div className="bg-neutral-light p-3 rounded-md space-y-2">
                <div className="flex items-center">
                  <CalendarIcon className="ml-2 text-primary" size={16} />
                  <div>
                    <p className="font-medium text-sm">תאריך</p>
                    <p>{formatLongDate(selectedEvent.start.toISOString())}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="ml-2 text-primary" size={16} />
                  <div>
                    <p className="font-medium text-sm">שעה</p>
                    <p>{format(selectedEvent.start, 'HH:mm')}</p>
                  </div>
                </div>
                
                {selectedEvent.assignedTo && (
                  <div className="flex items-center">
                    <User className="ml-2 text-primary" size={16} />
                    <div>
                      <p className="font-medium text-sm">איש צוות אחראי</p>
                      <p>{selectedEvent.assignedTo}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Wrench className="ml-2 text-primary" size={16} />
                  <div>
                    <p className="font-medium text-sm">סוג תחזוקה</p>
                    <p>{selectedEvent.maintenanceType}</p>
                  </div>
                </div>
              </div>
              
              {selectedEvent.notes && (
                <div>
                  <p className="font-medium text-sm">הערות</p>
                  <p className="text-sm mt-1">{selectedEvent.notes}</p>
                </div>
              )}
              
              <DialogFooter className="gap-2 flex-row-reverse sm:justify-start">
                <Button onClick={() => setShowEventDetails(false)}>סגירה</Button>
                <Button variant="outline">
                  <FileText className="ml-1" size={16} />
                  פתיחת הזמנת עבודה
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceCalendar;
