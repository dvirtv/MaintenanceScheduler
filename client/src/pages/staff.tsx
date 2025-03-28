import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStaff } from '@/hooks/use-staff';
import { useWorkOrders } from '@/hooks/use-work-orders';
import StaffCard from '@/components/staff/staff-card';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Wrench, Users, ClipboardList } from 'lucide-react';

// Form schema for staff creation/editing
const staffFormSchema = z.object({
  name: z.string().min(2, {
    message: "שם חייב להכיל לפחות 2 תווים",
  }),
  position: z.string().min(2, {
    message: "תפקיד חייב להכיל לפחות 2 תווים",
  }),
  specialization: z.string().optional(),
  contactInfo: z.string().optional(),
  isActive: z.boolean().default(true),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

const StaffPage = () => {
  const { staff, isLoading, createStaff, updateStaff } = useStaff();
  const { workOrders } = useWorkOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      position: "",
      specialization: "",
      contactInfo: "",
      isActive: true,
    },
  });

  // Filter staff based on search term
  const filteredStaff = staff.filter(member => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(search) ||
      member.position.toLowerCase().includes(search) ||
      (member.specialization && member.specialization.toLowerCase().includes(search))
    );
  });
  
  // Active and inactive staff
  const activeStaff = filteredStaff.filter(member => member.isActive);
  const inactiveStaff = filteredStaff.filter(member => !member.isActive);

  // Get work orders count for each staff member
  const getWorkOrdersCount = (staffId: number) => {
    return workOrders.filter(order => 
      order.assignedTo === staffId && 
      order.status !== "הושלמה" && 
      order.status !== "בוטלה"
    ).length;
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember);
    form.reset({
      name: staffMember.name,
      position: staffMember.position,
      specialization: staffMember.specialization || "",
      contactInfo: staffMember.contactInfo || "",
      isActive: staffMember.isActive,
    });
    setShowAddDialog(true);
  };

  const openAddDialog = () => {
    setEditingStaff(null);
    form.reset({
      name: "",
      position: "",
      specialization: "",
      contactInfo: "",
      isActive: true,
    });
    setShowAddDialog(true);
  };

  const onSubmit = (values: StaffFormValues) => {
    if (editingStaff) {
      updateStaff(
        { id: editingStaff.id, staff: values },
        {
          onSuccess: () => {
            toast({
              title: "עודכן בהצלחה",
              description: "פרטי איש צוות עודכנו בהצלחה",
              variant: "success",
            });
            setShowAddDialog(false);
          },
        }
      );
    } else {
      createStaff(values, {
        onSuccess: () => {
          toast({
            title: "נוסף בהצלחה",
            description: "איש צוות חדש נוסף בהצלחה",
            variant: "success",
          });
          setShowAddDialog(false);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
        <h1 className="text-2xl font-semibold text-neutral-dark">צוות תחזוקה</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="חיפוש אנשי צוות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-36 lg:w-64 h-10"
            />
            <Search className="absolute left-3 top-2.5 text-neutral-dark text-opacity-70" size={16} />
          </div>
          <Button onClick={openAddDialog}>
            <Plus size={16} className="ml-1" />
            הוספת איש צוות
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark">סך הכל אנשי צוות</p>
                <h3 className="text-3xl font-bold text-neutral-dark mt-1">{staff.length}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                <Users size={24} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark">צוות פעיל</p>
                <h3 className="text-3xl font-bold text-success mt-1">{activeStaff.length}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-full">
                <Users size={24} className="text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark">הזמנות עבודה פעילות</p>
                <h3 className="text-3xl font-bold text-warning mt-1">
                  {workOrders.filter(order => order.status !== "הושלמה" && order.status !== "בוטלה").length}
                </h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-full">
                <ClipboardList size={24} className="text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="ml-2" size={20} />
            אנשי צוות פעילים
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeStaff.length === 0 ? (
            <div className="text-center py-6">
              <p>לא נמצאו אנשי צוות פעילים</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeStaff.map(member => (
                <StaffCard 
                  key={member.id} 
                  staff={member} 
                  workOrdersCount={getWorkOrdersCount(member.id)}
                  onEdit={() => handleEditStaff(member)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Staff Members */}
      {inactiveStaff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="ml-2" size={20} />
              אנשי צוות לא פעילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveStaff.map(member => (
                <StaffCard 
                  key={member.id} 
                  staff={member} 
                  workOrdersCount={0}
                  onEdit={() => handleEditStaff(member)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Staff Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "עריכת איש צוות" : "הוספת איש צוות חדש"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם מלא</FormLabel>
                    <FormControl>
                      <Input placeholder="ישראל ישראלי" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>תפקיד</FormLabel>
                    <FormControl>
                      <Input placeholder="טכנאי / מנהל אחזקה" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>התמחות</FormLabel>
                    <FormControl>
                      <Input placeholder="מערכות חשמל / מערכות מכניות" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>פרטי קשר</FormLabel>
                    <FormControl>
                      <Input placeholder="טלפון / אימייל" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none mr-2">
                      <FormLabel>פעיל</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        האם איש הצוות פעיל ויכול לקבל משימות חדשות
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  ביטול
                </Button>
                <Button type="submit">
                  {editingStaff ? "עדכון" : "הוספה"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
