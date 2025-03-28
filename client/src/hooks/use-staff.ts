import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Staff, InsertStaff } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useStaff = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all staff members
  const { data = [], isLoading, error } = useQuery<Staff[]>({
    queryKey: ["/api/staff"],
  });

  // Create staff member
  const createStaffMutation = useMutation({
    mutationFn: async (newStaff: InsertStaff) => {
      const res = await apiRequest("POST", "/api/staff", newStaff);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "איש צוות נוסף בהצלחה",
        description: "איש הצוות החדש נוסף למערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בהוספת איש צוות",
        description: error.message || "אירעה שגיאה בהוספת איש צוות. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  // Update staff member
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, staff }: { id: number; staff: Partial<Staff> }) => {
      const res = await apiRequest("PUT", `/api/staff/${id}`, staff);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "איש צוות עודכן בהצלחה",
        description: "פרטי איש הצוות עודכנו במערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בעדכון איש צוות",
        description: error.message || "אירעה שגיאה בעדכון פרטי איש הצוות. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  // Delete staff member
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/staff/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "איש צוות הוסר בהצלחה",
        description: "איש הצוות הוסר מהמערכת",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה במחיקת איש צוות",
        description: error.message || "אירעה שגיאה במחיקת איש הצוות. אנא נסה שוב.",
        variant: "destructive",
      });
    },
  });

  return {
    staff: data,
    isLoading,
    error,
    createStaff: createStaffMutation.mutate,
    updateStaff: updateStaffMutation.mutate,
    deleteStaff: deleteStaffMutation.mutate,
    isPending: createStaffMutation.isPending || updateStaffMutation.isPending || deleteStaffMutation.isPending
  };
};

// Hook for getting a single staff member by ID
export const useStaffById = (id: number) => {
  return useQuery<Staff>({
    queryKey: [`/api/staff/${id}`],
    enabled: !!id,
  });
};

// Hook for getting work orders assigned to a staff member
export const useStaffWorkOrders = (staffId: number) => {
  return useQuery({
    queryKey: [`/api/staff/${staffId}/work-orders`],
    enabled: !!staffId,
  });
};
