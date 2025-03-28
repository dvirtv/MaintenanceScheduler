import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Equipment, WorkOrder, Staff } from "@shared/schema";

export const useDashboard = () => {
  // Stats for equipment
  const [equipmentStats, setEquipmentStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    needsInspection: 0,
  });

  // Work orders by status
  const [workOrdersByStatus, setWorkOrdersByStatus] = useState([
    { name: "פתוחה", value: 0 },
    { name: "בטיפול", value: 0 },
    { name: "ממתינה לחלקים", value: 0 },
    { name: "הושלמה", value: 0 },
    { name: "בוטלה", value: 0 },
  ]);

  // Work orders by priority
  const [workOrdersByPriority, setWorkOrdersByPriority] = useState([
    { name: "נמוכה", value: 0 },
    { name: "בינונית", value: 0 },
    { name: "גבוהה", value: 0 },
    { name: "דחופה", value: 0 },
  ]);

  // Upcoming maintenance
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<Array<{
    id: number;
    equipmentId: string;
    equipmentName: string;
    location: string;
    scheduledDate: string;
    maintenanceType: string;
    daysUntil: number;
  }>>([]);

  // Fetch equipment data
  const equipmentQuery = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  // Fetch work orders data
  const workOrdersQuery = useQuery<WorkOrder[]>({
    queryKey: ["/api/work-orders"],
  });

  // Calculate stats when data is loaded
  useEffect(() => {
    if (equipmentQuery.data && equipmentQuery.data.length > 0) {
      const stats = {
        total: equipmentQuery.data.length,
        active: equipmentQuery.data.filter((e) => e.status === "פעיל").length,
        inactive: equipmentQuery.data.filter((e) => e.status === "לא פעיל").length,
        needsInspection: equipmentQuery.data.filter((e) => e.status === "דורש בדיקה").length,
      };
      setEquipmentStats(stats);

      // Process upcoming maintenance from equipment data
      const today = new Date();
      const upcoming = equipmentQuery.data
        .filter((e) => e.nextMaintenanceDate)
        .map((e) => {
          const maintenanceDate = new Date(e.nextMaintenanceDate as string);
          const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: e.id,
            equipmentId: e.equipmentId,
            equipmentName: e.name,
            location: e.location,
            scheduledDate: e.nextMaintenanceDate ? formatDate(e.nextMaintenanceDate) : "לא נקבע",
            maintenanceType: "תחזוקה שוטפת",
            daysUntil: daysUntil,
          };
        })
        .filter((e) => e.daysUntil >= 0 && e.daysUntil <= 30)
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5);
      
      setUpcomingMaintenance(upcoming);
    }

    if (workOrdersQuery.data && workOrdersQuery.data.length > 0) {
      // Calculate work orders by status
      const statusCounts = [
        { name: "פתוחה", value: workOrdersQuery.data.filter((wo) => wo.status === "פתוחה").length },
        { name: "בטיפול", value: workOrdersQuery.data.filter((wo) => wo.status === "בטיפול").length },
        { name: "ממתינה לחלקים", value: workOrdersQuery.data.filter((wo) => wo.status === "ממתינה לחלקים").length },
        { name: "הושלמה", value: workOrdersQuery.data.filter((wo) => wo.status === "הושלמה").length },
        { name: "בוטלה", value: workOrdersQuery.data.filter((wo) => wo.status === "בוטלה").length },
      ];
      setWorkOrdersByStatus(statusCounts);

      // Calculate work orders by priority
      const priorityCounts = [
        { name: "נמוכה", value: workOrdersQuery.data.filter((wo) => wo.priority === "נמוכה").length },
        { name: "בינונית", value: workOrdersQuery.data.filter((wo) => wo.priority === "בינונית").length },
        { name: "גבוהה", value: workOrdersQuery.data.filter((wo) => wo.priority === "גבוהה").length },
        { name: "דחופה", value: workOrdersQuery.data.filter((wo) => wo.priority === "דחופה").length },
      ];
      setWorkOrdersByPriority(priorityCounts);
    }
  }, [equipmentQuery.data, workOrdersQuery.data]);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return {
    equipmentStats,
    workOrdersByStatus,
    workOrdersByPriority,
    upcomingMaintenance,
    isLoading: equipmentQuery.isLoading || workOrdersQuery.isLoading,
  };
};
