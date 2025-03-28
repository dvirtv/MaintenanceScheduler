import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertEquipmentSchema, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUSES, Equipment } from "@shared/schema";
import { useEquipment } from "@/hooks/use-equipment";

// Extend the schema for form validation
const formSchema = z.object({
  equipmentId: z.string().min(3, { message: "מזהה ציוד חייב להכיל לפחות 3 תווים" }),
  name: z.string().min(2, { message: "שם הציוד חייב להכיל לפחות 2 תווים" }),
  category: z.string({ required_error: "יש לבחור קטגוריה" }),
  location: z.string().min(2, { message: "יש להזין מיקום" }),
  status: z.string({ required_error: "יש לבחור סטטוס" }),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  installDate: z.string().optional(),
  specifications: z.record(z.string()).optional().nullable(),
  notes: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
  lastMaintenanceStatus: z.string().optional(),
});

interface EquipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment;
  onSave?: (equipment: Equipment) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  open,
  onOpenChange,
  equipment,
  onSave
}) => {
  const isEditing = !!equipment;
  const { createEquipment, updateEquipment, isPending } = useEquipment();

  // Create form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: equipment ? {
      ...equipment,
      specifications: equipment.specifications || {},
    } : {
      equipmentId: `EQP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: "",
      location: "",
      status: "פעיל",
      manufacturer: "",
      model: "",
      installDate: "",
      specifications: {},
      notes: "",
      nextMaintenanceDate: "",
      lastMaintenanceDate: "",
      lastMaintenanceStatus: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && equipment) {
      updateEquipment({ 
        id: equipment.id, 
        equipment: values 
      }, {
        onSuccess: (updatedEquipment) => {
          if (onSave) onSave(updatedEquipment);
          onOpenChange(false);
        }
      });
    } else {
      createEquipment(values, {
        onSuccess: (newEquipment) => {
          if (onSave) onSave(newEquipment);
          onOpenChange(false);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "עריכת פרטי ציוד" : "הוספת ציוד חדש"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "ערוך את פרטי הציוד ולחץ על שמירה כדי לעדכן את הנתונים."
              : "הזן את פרטי הציוד החדש ולחץ על שמירה להוספה למערכת."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Equipment ID */}
              <FormField
                control={form.control}
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מזהה ציוד</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Equipment Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הציוד</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>קטגוריה</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר קטגוריה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EQUIPMENT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
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
                        {EQUIPMENT_STATUSES.map((status) => (
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
              
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Manufacturer */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>יצרן</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מודל</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Install Date */}
              <FormField
                control={form.control}
                name="installDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך התקנה</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Next Maintenance Date */}
              <FormField
                control={form.control}
                name="nextMaintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך תחזוקה הבא</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Maintenance Date */}
              <FormField
                control={form.control}
                name="lastMaintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תאריך תחזוקה אחרון</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Maintenance Status */}
              <FormField
                control={form.control}
                name="lastMaintenanceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סטטוס תחזוקה אחרונה</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>הערות</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      {...field} 
                      value={field.value || ""} 
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
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    שומר...
                  </span>
                ) : isEditing ? "עדכון" : "שמירה"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentForm;
