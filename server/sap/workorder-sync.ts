import axios from 'axios';
import { sapClient } from './client';
import { SAP_ENDPOINTS, mapSapStatusToLocal, mapLocalStatusToSap } from './config';
import { WorkOrder, InsertWorkOrder } from '@shared/schema';
import { storage } from '../storage';

interface SapWorkOrderResponse {
  d: {
    results: SapWorkOrder[];
  };
}

interface SapWorkOrder {
  MaintenanceOrder: string;
  MaintenanceOrderDesc: string;
  MaintObjectType: string;
  MaintenanceObjectInternalID: string;
  FunctionalLocation: string;
  Equipment: string;
  MaintenancePlanningPlant: string;
  MaintenanceActivityType: string;
  MaintenancePriority: string;
  OrderType: string;
  StatusInternalID: string;
  StatusText: string;
  CreationDate: string;
  ScheduledStartDate: string;
  ScheduledEndDate: string;
  ActualStartDate: string;
  ActualEndDate: string;
  PersonResponsible: string;
  LastChangeDateTime: string;
  ShortText: string;
  LongText: string;
}

/**
 * ממיר נתונים של הזמנת עבודה מ-SAP לפורמט המערכת שלנו
 */
function mapSapWorkOrderToLocal(sapWorkOrder: SapWorkOrder): InsertWorkOrder {
  return {
    workOrderId: sapWorkOrder.MaintenanceOrder,
    title: sapWorkOrder.MaintenanceOrderDesc,
    description: sapWorkOrder.LongText || sapWorkOrder.ShortText || "",
    equipmentId: getEquipmentIdFromSap(sapWorkOrder.Equipment),
    status: mapSapStatusToLocal(sapWorkOrder.StatusInternalID),
    priority: mapSapPriorityToLocal(sapWorkOrder.MaintenancePriority),
    type: mapSapOrderTypeToLocal(sapWorkOrder.OrderType),
    assignedTo: sapWorkOrder.PersonResponsible ? parseInt(sapWorkOrder.PersonResponsible, 10) : null,
    dueDate: formatSapDate(sapWorkOrder.ScheduledEndDate),
    createdDate: formatSapDate(sapWorkOrder.CreationDate),
    completionDate: formatSapDate(sapWorkOrder.ActualEndDate),
    estimatedHours: null, // אין לנו אומדן שעות ישירות מ-SAP
    actualHours: null, // צריך להשיג ממידע על פעולות העבודה
    location: sapWorkOrder.FunctionalLocation || null,
    parts: [], // צריך לקבל מפעולות ההזמנה 
    notes: null,
  };
}

/**
 * המרת סטטוס עדיפות מ-SAP
 */
function mapSapPriorityToLocal(sapPriority: string): string {
  switch (sapPriority) {
    case '1': return 'גבוהה';
    case '2': return 'בינונית';
    case '3': return 'רגילה';
    case '4': return 'נמוכה';
    default: return 'רגילה';
  }
}

/**
 * המרת סוג הזמנת עבודה מ-SAP
 */
function mapSapOrderTypeToLocal(sapOrderType: string): string {
  switch (sapOrderType) {
    case 'PM01': return 'תחזוקה מתוכננת';
    case 'PM02': return 'תחזוקה מונעת';
    case 'PM03': return 'תיקון תקלה';
    case 'PM04': return 'שיפור';
    case 'PM05': return 'כיול';
    default: return 'אחר';
  }
}

/**
 * המרת תאריך SAP לפורמט תאריך סטנדרטי
 */
function formatSapDate(sapDate: string | null): string | null {
  if (!sapDate) return null;
  
  // תבנית תאריך SAP: YYYYMMDDTHHmmss או YYYYMMDD
  const match = sapDate.match(/^(\d{4})(\d{2})(\d{2})/);
  if (match) {
    const [_, year, month, day] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

/**
 * קבלת מזהה ציוד פנימי במערכת שלנו מהמזהה של SAP
 */
async function getEquipmentIdFromSap(sapEquipmentId: string): Promise<number | null> {
  if (!sapEquipmentId) return null;
  
  // מצא את הציוד לפי המזהה של SAP
  try {
    const equipment = await storage.getEquipmentByEquipmentId(sapEquipmentId);
    return equipment ? equipment.id : null;
  } catch (error) {
    console.error(`Error finding equipment by SAP ID ${sapEquipmentId}:`, error);
    return null;
  }
}

/**
 * מחזיר הזמנת עבודה מ-SAP לפי מזהה
 */
export async function getSapWorkOrderById(workOrderId: string): Promise<InsertWorkOrder | null> {
  try {
    const response = await sapClient.get<any>(
      `${SAP_ENDPOINTS.workOrders}('${workOrderId}')`
    );
    
    if (response && response.d) {
      const sapWorkOrder = response.d as SapWorkOrder;
      const localWorkOrder = await mapSapWorkOrderToLocal(sapWorkOrder);
      return localWorkOrder;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching work order ${workOrderId} from SAP:`, error);
    return null;
  }
}

/**
 * מחזיר את כל הזמנות העבודה מ-SAP
 */
export async function getAllSapWorkOrders(): Promise<InsertWorkOrder[]> {
  try {
    const response = await sapClient.get<SapWorkOrderResponse>(
      `${SAP_ENDPOINTS.workOrders}?$filter=MaintObjectType eq 'EQUI'`
    );
    
    if (response && response.d && response.d.results) {
      const workOrders: InsertWorkOrder[] = [];
      
      for (const sapWorkOrder of response.d.results) {
        try {
          const localWorkOrder = await mapSapWorkOrderToLocal(sapWorkOrder);
          workOrders.push(localWorkOrder);
        } catch (error) {
          console.error(`Error mapping work order ${sapWorkOrder.MaintenanceOrder}:`, error);
        }
      }
      
      return workOrders;
    }
    return [];
  } catch (error) {
    console.error('Error fetching work orders from SAP:', error);
    return [];
  }
}

/**
 * מחזיר את כל הזמנות העבודה לציוד מסוים מ-SAP
 */
export async function getSapWorkOrdersByEquipment(equipmentId: string): Promise<InsertWorkOrder[]> {
  try {
    const response = await sapClient.get<SapWorkOrderResponse>(
      `${SAP_ENDPOINTS.workOrders}?$filter=Equipment eq '${equipmentId}'`
    );
    
    if (response && response.d && response.d.results) {
      const workOrders: InsertWorkOrder[] = [];
      
      for (const sapWorkOrder of response.d.results) {
        try {
          const localWorkOrder = await mapSapWorkOrderToLocal(sapWorkOrder);
          workOrders.push(localWorkOrder);
        } catch (error) {
          console.error(`Error mapping work order ${sapWorkOrder.MaintenanceOrder}:`, error);
        }
      }
      
      return workOrders;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching work orders for equipment ${equipmentId} from SAP:`, error);
    return [];
  }
}

/**
 * מסנכרן את כל הזמנות העבודה מ-SAP
 */
export async function syncAllWorkOrders(): Promise<{
  added: number;
  updated: number;
  errors: number;
}> {
  const result = {
    added: 0,
    updated: 0,
    errors: 0
  };

  try {
    const sapWorkOrdersList = await getAllSapWorkOrders();
    
    for (const sapWorkOrder of sapWorkOrdersList) {
      try {
        // בדוק אם הזמנת העבודה כבר קיימת במערכת
        const existingWorkOrder = await getWorkOrderByWorkOrderId(sapWorkOrder.workOrderId);
        
        if (existingWorkOrder) {
          // עדכן את הזמנת העבודה הקיימת
          await storage.updateWorkOrder(existingWorkOrder.id, sapWorkOrder);
          result.updated++;
        } else {
          // צור הזמנת עבודה חדשה
          await storage.createWorkOrder(sapWorkOrder);
          result.added++;
        }
      } catch (error) {
        console.error(`Error syncing work order ${sapWorkOrder.workOrderId}:`, error);
        result.errors++;
      }
    }
    
    console.log(`Work orders sync completed: Added ${result.added}, Updated ${result.updated}, Errors ${result.errors}`);
    return result;
  } catch (error) {
    console.error('Error in work orders sync process:', error);
    throw error;
  }
}

/**
 * מוצא הזמנת עבודה לפי מזהה SAP
 */
async function getWorkOrderByWorkOrderId(workOrderId: string): Promise<WorkOrder | undefined> {
  const allWorkOrders = await storage.getAllWorkOrders();
  return allWorkOrders.find(wo => wo.workOrderId === workOrderId);
}

/**
 * שולח הזמנת עבודה חדשה או מעודכנת ל-SAP
 */
export async function sendWorkOrderToSap(workOrder: WorkOrder): Promise<boolean> {
  try {
    // המרת נתוני הזמנת העבודה שלנו לפורמט של SAP
    const sapWorkOrder = {
      MaintenanceOrder: workOrder.workOrderId || "",
      MaintenanceOrderDesc: workOrder.title,
      ShortText: workOrder.title,
      LongText: workOrder.description || "",
      Equipment: await getEquipmentSapIdByLocalId(workOrder.equipmentId),
      StatusInternalID: mapLocalStatusToSap(workOrder.status),
      MaintenancePriority: mapLocalPriorityToSap(workOrder.priority),
      OrderType: mapLocalOrderTypeToSap(workOrder.type),
      ScheduledEndDate: formatLocalDateToSap(workOrder.dueDate),
      PersonResponsible: workOrder.assignedTo ? workOrder.assignedTo.toString() : "",
    };

    const workOrderExists = await checkIfWorkOrderExistsInSap(workOrder.workOrderId || "");
    
    if (workOrderExists) {
      // עדכון הזמנת עבודה קיימת
      await sapClient.put(
        `${SAP_ENDPOINTS.workOrders}('${workOrder.workOrderId}')`,
        sapWorkOrder
      );
    } else {
      // יצירת הזמנת עבודה חדשה
      await sapClient.post(
        SAP_ENDPOINTS.workOrders,
        sapWorkOrder
      );
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending work order ${workOrder.id} to SAP:`, error);
    return false;
  }
}

/**
 * בדיקה האם הזמנת עבודה קיימת ב-SAP
 */
async function checkIfWorkOrderExistsInSap(workOrderId: string): Promise<boolean> {
  if (!workOrderId) return false;
  
  try {
    const response = await sapClient.get<any>(
      `${SAP_ENDPOINTS.workOrders}('${workOrderId}')`
    );
    return !!response;
  } catch (error) {
    // אם קיבלנו 404, הזמנת העבודה לא קיימת
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    // בכל שגיאה אחרת, נזרוק את השגיאה
    throw error;
  }
}

/**
 * המרה של מזהה ציוד מקומי למזהה SAP
 */
async function getEquipmentSapIdByLocalId(equipmentId: number | null): Promise<string> {
  if (!equipmentId) return "";
  
  try {
    const equipment = await storage.getEquipment(equipmentId);
    return equipment ? equipment.equipmentId : "";
  } catch (error) {
    console.error(`Error finding SAP equipment ID for local ID ${equipmentId}:`, error);
    return "";
  }
}

/**
 * המרת עדיפות מקומית לקוד SAP
 */
function mapLocalPriorityToSap(priority: string): string {
  switch (priority) {
    case 'גבוהה': return '1';
    case 'בינונית': return '2';
    case 'רגילה': return '3';
    case 'נמוכה': return '4';
    default: return '3';
  }
}

/**
 * המרת סוג הזמנת עבודה מקומית לקוד SAP
 */
function mapLocalOrderTypeToSap(type: string): string {
  switch (type) {
    case 'תחזוקה מתוכננת': return 'PM01';
    case 'תחזוקה מונעת': return 'PM02';
    case 'תיקון תקלה': return 'PM03';
    case 'שיפור': return 'PM04';
    case 'כיול': return 'PM05';
    default: return 'PM03';
  }
}

/**
 * המרת תאריך מקומי לפורמט תאריך SAP
 */
function formatLocalDateToSap(localDate: string | null): string | null {
  if (!localDate) return null;
  
  // הסר מקפים ופורמט כ-YYYYMMDD
  return localDate.replace(/-/g, '');
}