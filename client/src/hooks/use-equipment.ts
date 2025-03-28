import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Equipment, InsertEquipment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data = [], isLoading, error } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const createEquipmentMutation = useMutation({
    mutationFn: async (newEquipment: InsertEquipment) => {
      const res = await apiRequest("POST", "/api/equipment", newEquipment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "ציוד נוסף בהצלחה",
        description: "פריט הציוד החדש נוסף למערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בהוספת ציוד",
        description: error.message || "אירעה שגיאה בהוספת פריט הציוד. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, equipment }: { id: number; equipment: Partial<Equipment> }) => {
      const res = await apiRequest("PUT", `/api/equipment/${id}`, equipment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "ציוד עודכן בהצלחה",
        description: "פרטי הציוד עודכנו במערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בעדכון ציוד",
        description: error.message || "אירעה שגיאה בעדכון פרטי הציוד. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/equipment/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "ציוד הוסר בהצלחה",
        description: "פריט הציוד הוסר מהמערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה במחיקת ציוד",
        description: error.message || "אירעה שגיאה במחיקת פריט הציוד. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  return {
    equipment: data,
    isLoading,
    error,
    createEquipment: createEquipmentMutation.mutate,
    updateEquipment: updateEquipmentMutation.mutate,
    deleteEquipment: deleteEquipmentMutation.mutate,
    isPending: createEquipmentMutation.isPending || updateEquipmentMutation.isPending || deleteEquipmentMutation.isPending
  };
};

// Hook for getting a single equipment item by ID
export const useEquipmentById = (id: number) => {
  return useQuery<Equipment>({
    queryKey: [`/api/equipment/${id}`],
    enabled: !!id,
  });
};

// Hook for getting work orders related to an equipment
export const useEquipmentWorkOrders = (equipmentId: number) => {
  return useQuery({
    queryKey: [`/api/equipment/${equipmentId}/work-orders`],
    enabled: !!equipmentId,
  });
};

// Hook for getting maintenance history for an equipment
export const useEquipmentMaintenanceHistory = (equipmentId: number) => {
  return useQuery({
    queryKey: [`/api/equipment/${equipmentId}/maintenance-history`],
    enabled: !!equipmentId,
  });
};
