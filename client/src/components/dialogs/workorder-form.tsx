import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEquipment } from '@/hooks/use-equipment';
import { useStaff } from '@/hooks/use-staff';
import { useWorkOrders } from '@/hooks/use-work-orders';
import { PRIORITY_LEVELS, WORK_ORDER_STATUSES, Equipment } from '@shared/schema';
import { getPriorityClass } from '@/lib/utils/priorities';

// Validation schema for the work order form
const workOrderSchema = z.object({
  title: z.string().min(3, {
    message: "כותרת חייבת להכיל לפחות 3 תווים",
  }),
  description: z.string().min(10, {
    message: "תיאור חייב להכיל לפחות 10 תווים",
  }),
  equipmentId: z.number({
    required_error: "יש לבחור ציוד",
  }),
  priority: z.string({
    required_error: "יש לבחור רמת דחיפות",
  }),
  status: z.string({
    required_error: "יש לבחור סטטוס",
  }),
  assignedTo: z.number().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder?: any;
  equipment?: Equipment;
  onSave?: (workOrder: any) => void;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  open,
  onOpenChange,
  workOrder,
  equipment,
  onSave
}) => {
  const { equipment: allEquipment, isLoading: isLoadingEquipment } = useEquipment();
  const { staff, isLoading: isLoadingStaff } = useStaff();
  const { createWorkOrder, updateWorkOrder, isPending } = useWorkOrders();
  
  const isEditing = !!workOrder;

  // Setup form with default values or values from existing work order
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: workOrder
      ? {
          ...workOrder,
          equipmentId: workOrder.equipmentId,
          assignedTo: workOrder.assignedTo || undefined,
          dueDate: workOrder.dueDate || '',
          notes: workOrder.notes || '',
        }
      : {
          title: '',
          description: '',
          equipmentId: equipment ? equipment.id : undefined,
          priority: 'בינונית',
          status: 'פתוחה',
          dueDate: '',
          notes: '',
        },
  });

  const onSubmit = (values: WorkOrderFormValues) => {
    if (isEditing) {
      updateWorkOrder(
        { id: workOrder.id, workOrder: values },
        {
          onSuccess: (updatedWorkOrder) => {
            if (onSave) onSave(updatedWorkOrder);
            onOpenChange(false);
          },
        }
      );
    } else {
      createWorkOrder(
        { 
          ...values, 
          createdDate: new Date().toISOString().split('T')[0] 
        },
        {
          onSuccess: (newWorkOrder) => {
            if (onSave) onSave(newWorkOrder);
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'עריכת הזמנת עבודה' : 'הזמנת עבודה חדשה'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'ערוך את פרטי הזמנת העבודה'
              : 'הוסף הזמנת עבודה חדשה למערכת'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>כותרת</FormLabel>
                  <FormControl>
                    <Input placeholder="כותרת הזמנת העבודה" {...field} />
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
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="תיאור מפורט של העבודה הנדרשת"
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
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ציוד</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                      disabled={!!equipment}
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
                          allEquipment.map((item) => (
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>דחיפות</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={field.value ? getPriorityClass(field.value) : ""}>
                          <SelectValue placeholder="בחר דחיפות" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_LEVELS.map((priority) => (
                          <SelectItem 
                            key={priority} 
                            value={priority}
                            className={getPriorityClass(priority)}
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סטטוס</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORK_ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      onValueChange={(value) => field.onChange(value === "0" ? null : parseInt(value))}
                      defaultValue={field.value?.toString() || "0"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר טכנאי" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">לא הוקצה</SelectItem>
                        {isLoadingStaff ? (
                          <div className="text-center p-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                          </div>
                        ) : (
                          staff
                            .filter(member => member.isActive)
                            .map((member) => (
                              <SelectItem key={member.id} value={member.id.toString()}>
                                {member.name} ({member.position})
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
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תאריך לביצוע</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ביטול
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    שומר...
                  </span>
                ) : isEditing ? (
                  'עדכון'
                ) : (
                  'יצירה'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderForm;
