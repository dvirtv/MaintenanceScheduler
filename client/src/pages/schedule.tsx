import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MaintenanceCalendar from '@/components/calendar/maintenance-calendar';
import { useToast } from '@/hooks/use-toast';
import { useEquipment } from '@/hooks/use-equipment';
import { useStaff } from '@/hooks/use-staff';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarCheck, Clock, ArrowRight, AlertCircle, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/dates';

// Schema for the schedule maintenance form
const scheduleFormSchema = z.object({
  equipmentId: z.number({
    required_error: "נא לבחור ציוד"
  }),
  maintenanceType: z.string().min(2, {
    message: "נא להזין סוג תחזוקה"
  }),
  description: z.string().min(5, {
    message: "נא להזין תיאור מפורט יותר"
  }),
  scheduledDate: z.string().min(1, {
    message: "נא לבחור תאריך"
  }),
  assignedTo: z.number().optional(),
  notes: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

const SchedulePage = () => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { equipment, isLoading: isLoadingEquipment } = useEquipment();
  const { staff, isLoading: isLoadingStaff } = useStaff();
  const { toast } = useToast();

  // Upcoming maintenance tasks (would come from API)
  const upcomingTasks = [
    {
      id: 1,
      equipmentId: 1,
      equipmentName: "משאבת סחרור ראשית",
      location: "אולם ייצור - קו 2",
      scheduledDate: "2023-07-25",
      maintenanceType: "תחזוקה שוטפת רבעונית",
      assignedTo: "יוסי לוי",
      notes: "יש לבדוק את האטמים ולהחליף במידת הצורך"
    },
    {
      id: 2,
      equipmentId: 2,
      equipmentName: "מסוע אבקה #3",
      location: "מחלקת אריזה",
      scheduledDate: "2023-06-10",
      maintenanceType: "החלפת רצועה",
      assignedTo: "דוד כהן",
      notes: "רצועת ההנעה שחוקה, יש להחליף בהתאם להוראות היצרן"
    },
    {
      id: 3,
      equipmentId: 6,
      equipmentName: "גנרטור חירום 100kW",
      location: "חדר גנרטורים",
      scheduledDate: "2023-07-02",
      maintenanceType: "בדיקת דלק וסוללות",
      assignedTo: "אבי כהן",
      notes: "יש לבדוק את מפלס הדלק ולוודא תקינות הסוללות"
    },
    {
      id: 4,
      equipmentId: 5,
      equipmentName: "מעבד חום תעשייתי",
      location: "יחידת עיבוד חום",
      scheduledDate: "2023-08-18",
      maintenanceType: "ניקוי מסננים",
      assignedTo: "יוסי לוי",
      notes: "יש לנקות את כל המסננים ולבדוק את חיישני הטמפרטורה"
    }
  ];

  // Calendar events based on upcoming tasks
  const events = upcomingTasks.map(task => ({
    id: task.id,
    title: `${task.maintenanceType} - ${task.equipmentName}`,
    start: new Date(task.scheduledDate),
    end: new Date(task.scheduledDate),
    equipmentId: task.equipmentId,
    equipmentName: task.equipmentName,
    maintenanceType: task.maintenanceType,
    assignedTo: task.assignedTo,
    location: task.location,
    notes: task.notes
  }));

  // Sort tasks by date
  const sortedTasks = [...upcomingTasks].sort((a, b) => {
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });

  // Form for scheduling maintenance
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      description: "",
      maintenanceType: "",
      notes: "",
    }
  });

  const onSubmit = (values: ScheduleFormValues) => {
    console.log(values);
    toast({
      title: "תחזוקה תוזמנה בהצלחה",
      description: "משימת התחזוקה נוספה ללוח הזמנים",
      variant: "success",
    });
    setShowAddDialog(false);
    form.reset();
  };

  // Helper to get days until scheduled date
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const scheduledDate = new Date(dateStr);
    const diffTime = scheduledDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (daysUntil: number) => {
    if (daysUntil < 0) {
      return <Badge className="bg-danger text-white">באיחור</Badge>;
    } else if (daysUntil === 0) {
      return <Badge className="bg-warning text-white">היום</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge className="bg-warning text-white">השבוע</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge className="bg-primary text-white">החודש</Badge>;
    } else {
      return <Badge className="bg-success text-white">מתוזמן</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-neutral-dark">לוח זמנים לתחזוקה</h1>
        <div className="flex space-x-2">
          <Tabs value={view} onValueChange={(value: string) => setView(value as 'calendar' | 'list')}>
            <TabsList>
              <TabsTrigger value="calendar">
                <Calendar className="ml-1" size={16} />
                לוח שנה
              </TabsTrigger>
              <TabsTrigger value="list">
                <Clock className="ml-1" size={16} />
                רשימה
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setShowAddDialog(true)}>
            <CalendarCheck className="ml-1" size={16} />
            תזמון תחזוקה
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {view === 'calendar' ? (
            <MaintenanceCalendar events={events} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-medium mb-3 flex items-center">
                    <AlertCircle className="ml-1 text-warning" size={16} />
                    תחזוקה בקרוב
                  </h2>
                  <div className="space-y-3">
                    {sortedTasks
                      .filter(task => {
                        const daysUntil = getDaysUntil(task.scheduledDate);
                        return daysUntil >= 0 && daysUntil <= 7;
                      })
                      .map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg border border-neutral-medium">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.maintenanceType}</h3>
                              <p className="text-sm">{task.equipmentName}</p>
                              <p className="text-xs text-neutral-dark">{task.location}</p>
                            </div>
                            <div className="text-left">
                              {getStatusBadge(getDaysUntil(task.scheduledDate))}
                              <p className="text-sm mt-1 text-neutral-dark">{formatDate(task.scheduledDate)}</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>הוקצה ל: {task.assignedTo}</p>
                            {task.notes && <p className="text-xs mt-1 text-neutral-dark">{task.notes}</p>}
                          </div>
                        </div>
                      ))}
                    {sortedTasks.filter(task => {
                      const daysUntil = getDaysUntil(task.scheduledDate);
                      return daysUntil >= 0 && daysUntil <= 7;
                    }).length === 0 && (
                      <p className="text-center text-sm text-neutral-dark py-4">אין משימות תחזוקה בשבוע הקרוב</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-3 flex items-center">
                    <CalendarCheck className="ml-1 text-primary" size={16} />
                    תחזוקה מתוזמנת
                  </h2>
                  <div className="space-y-3">
                    {sortedTasks
                      .filter(task => {
                        const daysUntil = getDaysUntil(task.scheduledDate);
                        return daysUntil > 7;
                      })
                      .slice(0, 5)
                      .map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg border border-neutral-medium">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.maintenanceType}</h3>
                              <p className="text-sm">{task.equipmentName}</p>
                              <p className="text-xs text-neutral-dark">{task.location}</p>
                            </div>
                            <div className="text-left">
                              {getStatusBadge(getDaysUntil(task.scheduledDate))}
                              <p className="text-sm mt-1 text-neutral-dark">{formatDate(task.scheduledDate)}</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>הוקצה ל: {task.assignedTo}</p>
                            {task.notes && <p className="text-xs mt-1 text-neutral-dark">{task.notes}</p>}
                          </div>
                        </div>
                      ))}
                    {sortedTasks.filter(task => {
                      const daysUntil = getDaysUntil(task.scheduledDate);
                      return daysUntil > 7;
                    }).length === 0 && (
                      <p className="text-center text-sm text-neutral-dark py-4">אין משימות תחזוקה עתידיות נוספות</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium mb-3 flex items-center">
                  <Clock className="ml-1 text-danger" size={16} />
                  תחזוקה שעברה
                </h2>
                <div className="space-y-3">
                  {sortedTasks
                    .filter(task => {
                      const daysUntil = getDaysUntil(task.scheduledDate);
                      return daysUntil < 0;
                    })
                    .slice(0, 3)
                    .map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-lg border border-neutral-medium">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{task.maintenanceType}</h3>
                            <p className="text-sm">{task.equipmentName}</p>
                            <p className="text-xs text-neutral-dark">{task.location}</p>
                          </div>
                          <div className="text-left">
                            <Badge className="bg-danger text-white">באיחור</Badge>
                            <p className="text-sm mt-1 text-neutral-dark">{formatDate(task.scheduledDate)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <p>הוקצה ל: {task.assignedTo}</p>
                          {task.notes && <p className="text-xs mt-1 text-neutral-dark">{task.notes}</p>}
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button variant="outline" size="sm">סימון כבוצע</Button>
                        </div>
                      </div>
                    ))}
                  {sortedTasks.filter(task => {
                    const daysUntil = getDaysUntil(task.scheduledDate);
                    return daysUntil < 0;
                  }).length === 0 && (
                    <p className="text-center text-sm text-neutral-dark py-4">אין משימות תחזוקה באיחור - כל הכבוד!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>תזמון תחזוקה</DialogTitle>
            <DialogDescription>
              הגדר משימת תחזוקה חדשה עבור ציוד במערכת
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ציוד</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר ציוד" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingEquipment ? (
                          <div className="text-center p-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                          </div>
                        ) : (
                          equipment.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} ({item.equipmentId})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenanceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סוג תחזוקה</FormLabel>
                    <FormControl>
                      <Input placeholder="תחזוקה שוטפת רבעונית" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תיאור העבודה</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="תאר את העבודה שיש לבצע"
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>הקצה לטכנאי</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר טכנאי" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingStaff ? (
                            <div className="text-center p-2">
                              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                            </div>
                          ) : (
                            staff.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name} ({item.position})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>הערות</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="הערות נוספות"
                        rows={2} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  ביטול
                </Button>
                <Button type="submit">תזמון</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
