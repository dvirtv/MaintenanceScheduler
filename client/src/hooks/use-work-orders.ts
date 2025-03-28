import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { WorkOrder, InsertWorkOrder } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useWorkOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all work orders
  const { data = [], isLoading, error } = useQuery<WorkOrder[]>({
    queryKey: ["/api/work-orders"],
  });

  // Add staff/equipment names to work orders data
  const enrichedWorkOrders = data.map(workOrder => {
    // Get staff data from cache
    const staffData = queryClient.getQueryData<any[]>(["/api/staff"]) || [];
    const assignedStaff = staffData.find(staff => staff.id === workOrder.assignedTo);

    // Get equipment data from cache
    const equipmentData = queryClient.getQueryData<any[]>(["/api/equipment"]) || [];
    const equipment = equipmentData.find(eq => eq.id === workOrder.equipmentId);

    return {
      ...workOrder,
      assignedToName: assignedStaff ? assignedStaff.name : null,
      equipmentName: equipment ? equipment.name : "ציוד לא ידוע",
      equipmentLocation: equipment ? equipment.location : null,
    };
  });

  // Create work order
  const createWorkOrderMutation = useMutation({
    mutationFn: async (newWorkOrder: InsertWorkOrder) => {
      const res = await apiRequest("POST", "/api/work-orders", newWorkOrder);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      toast({
        title: "הזמנת עבודה נוצרה בהצלחה",
        description: "הזמנת העבודה החדשה נוספה למערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה ביצירת הזמנת עבודה",
        description: error.message || "אירעה שגיאה ביצירת הזמנת העבודה. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  // Update work order
  const updateWorkOrderMutation = useMutation({
    mutationFn: async ({ id, workOrder }: { id: number; workOrder: Partial<WorkOrder> }) => {
      const res = await apiRequest("PUT", `/api/work-orders/${id}`, workOrder);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      toast({
        title: "הזמנת עבודה עודכנה בהצלחה",
        description: "פרטי הזמנת העבודה עודכנו במערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בעדכון הזמנת עבודה",
        description: error.message || "אירעה שגיאה בעדכון הזמנת העבודה. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  // Delete work order
  const deleteWorkOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/work-orders/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/work-orders"] });
      toast({
        title: "הזמנת עבודה נמחקה בהצלחה",
        description: "הזמנת העבודה הוסרה מהמערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה במחיקת הזמנת עבודה",
        description: error.message || "אירעה שגיאה במחיקת הזמנת העבודה. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  return {
    workOrders: enrichedWorkOrders,
    isLoading,
    error,
    createWorkOrder: createWorkOrderMutation.mutate,
    updateWorkOrder: updateWorkOrderMutation.mutate,
    deleteWorkOrder: deleteWorkOrderMutation.mutate,
    isPending: createWorkOrderMutation.isPending || 
              updateWorkOrderMutation.isPending || 
              deleteWorkOrderMutation.isPending
  };
};

// Hook for getting a single work order by ID
export const useWorkOrderById = (id: number) => {
  return useQuery<WorkOrder>({
    queryKey: [`/api/work-orders/${id}`],
    enabled: !!id,
  });
};

// Hook for getting work orders for specific equipment
export const useEquipmentWorkOrders = (equipmentId: number) => {
  return useQuery({
    queryKey: [`/api/equipment/${equipmentId}/work-orders`],
    enabled: !!equipmentId,
  });
};
