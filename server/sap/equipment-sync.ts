import { sapClient } from './client';
import { SAP_ENDPOINTS } from './config';
import { Equipment, InsertEquipment } from '@shared/schema';
import { storage } from '../storage';

interface SapEquipmentResponse {
  d: {
    results: SapEquipment[];
  };
}

interface SapEquipment {
  EquipId: string;
  Equipment: string;
  EquipmentName: string;
  EquipmentCategory: string;
  FunctionalLocation: string;
  EquipmentStatus: string;
  Manufacturer: string;
  ManufacturerPartNumber: string;
  AcquisitionDate: string;
  MaintenancePlant: string;
  TechnicalIdentification: string;
  SerialNumber: string;
  TechObjStatusDesc: string;
  TechnicalInformation: string;
  LastMaintenanceDate: string;
}

/**
 * ממיר נתונים של SAP לפורמט המערכת שלנו
 */
function mapSapEquipmentToLocal(sapEquipment: SapEquipment): InsertEquipment {
  return {
    equipmentId: sapEquipment.Equipment,
    name: sapEquipment.EquipmentName,
    category: mapEquipmentCategory(sapEquipment.EquipmentCategory),
    location: sapEquipment.FunctionalLocation,
    status: mapEquipmentStatus(sapEquipment.EquipmentStatus),
    manufacturer: sapEquipment.Manufacturer || null,
    model: sapEquipment.ManufacturerPartNumber || null,
    installDate: formatSapDate(sapEquipment.AcquisitionDate),
    specifications: {
      serialNumber: sapEquipment.SerialNumber,
      technicalId: sapEquipment.TechnicalIdentification,
      maintenancePlant: sapEquipment.MaintenancePlant,
    },
    notes: sapEquipment.TechnicalInformation || null,
    lastMaintenanceDate: formatSapDate(sapEquipment.LastMaintenanceDate),
    lastMaintenanceStatus: sapEquipment.TechObjStatusDesc || null,
    nextMaintenanceDate: null, // צריך לחשב בהתבסס על תאריך התחזוקה האחרון וכללי תחזוקה
  };
}

/**
 * ממיר קטגוריית ציוד מ-SAP לפורמט המערכת שלנו
 */
function mapEquipmentCategory(sapCategory: string): string {
  // המרה של הקודים של SAP לקטגוריות שלנו
  switch (sapCategory) {
    case 'M': return 'ציוד מכני';
    case 'E': return 'ציוד חשמלי';
    case 'H': return 'ציוד הידראולי';
    case 'P': return 'ציוד שינוע';
    case 'A': return 'מכונות אוטומטיות';
    case 'T': return 'מערכות חימום';
    case 'S': return 'מיכלי אחסון';
    default: return 'אחר';
  }
}

/**
 * ממיר סטטוס ציוד מ-SAP לפורמט המערכת שלנו
 */
function mapEquipmentStatus(sapStatus: string): string {
  // המרה של הקודים של SAP לסטטוסים שלנו
  switch (sapStatus) {
    case 'ACTV': return 'פעיל';
    case 'INAC': return 'לא פעיל';
    case 'INST': return 'בהתקנה';
    case 'MREQ': return 'דורש בדיקה';
    case 'MACT': return 'בתחזוקה';
    case 'DISC': return 'מושבת';
    default: return 'לא ידוע';
  }
}

/**
 * ממיר תאריך SAP לפורמט תאריך סטנדרטי
 */
function formatSapDate(sapDate: string | null): string | null {
  if (!sapDate) return null;
  
  // תבנית תאריך SAP: YYYYMMDDTHHmmss
  const match = sapDate.match(/^(\d{4})(\d{2})(\d{2})/);
  if (match) {
    const [_, year, month, day] = match;
    return `${year}-${month}-${day}`;
  }
  return null;
}

/**
 * מחזיר ציוד מ-SAP לפי מזהה
 */
export async function getSapEquipmentById(equipmentId: string): Promise<InsertEquipment | null> {
  try {
    const response = await sapClient.get<any>(
      `${SAP_ENDPOINTS.equipment}('${equipmentId}')`
    );
    
    if (response && response.d) {
      return mapSapEquipmentToLocal(response.d);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching equipment ${equipmentId} from SAP:`, error);
    return null;
  }
}

/**
 * מחזיר את כל הציוד מ-SAP
 */
export async function getAllSapEquipment(): Promise<InsertEquipment[]> {
  try {
    const response = await sapClient.get<SapEquipmentResponse>(
      `${SAP_ENDPOINTS.equipment}?$filter=EquipmentCategory ne '' and EquipmentStatus ne ''`
    );
    
    if (response && response.d && response.d.results) {
      return response.d.results.map(mapSapEquipmentToLocal);
    }
    return [];
  } catch (error) {
    console.error('Error fetching equipment from SAP:', error);
    return [];
  }
}

/**
 * מסנכרן את כל הציוד מ-SAP
 */
export async function syncAllEquipment(): Promise<{
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
    const sapEquipmentList = await getAllSapEquipment();
    
    for (const sapEquipment of sapEquipmentList) {
      try {
        // בדוק אם הציוד כבר קיים במערכת
        const existingEquipment = await storage.getEquipmentByEquipmentId(sapEquipment.equipmentId);
        
        if (existingEquipment) {
          // עדכן את הציוד הקיים
          await storage.updateEquipment(existingEquipment.id, sapEquipment);
          result.updated++;
        } else {
          // צור ציוד חדש
          await storage.createEquipment(sapEquipment);
          result.added++;
        }
      } catch (error) {
        console.error(`Error syncing equipment ${sapEquipment.equipmentId}:`, error);
        result.errors++;
      }
    }
    
    console.log(`Equipment sync completed: Added ${result.added}, Updated ${result.updated}, Errors ${result.errors}`);
    return result;
  } catch (error) {
    console.error('Error in equipment sync process:', error);
    throw error;
  }
}

/**
 * שולח ציוד חדש או מעודכן ל-SAP
 */
export async function sendEquipmentToSap(equipment: Equipment): Promise<boolean> {
  try {
    // המר את הציוד שלנו לפורמט של SAP
    const sapEquipment = {
      Equipment: equipment.equipmentId,
      EquipmentName: equipment.name,
      EquipmentCategory: reverseMappingCategory(equipment.category),
      EquipmentStatus: reverseMappingStatus(equipment.status),
      Manufacturer: equipment.manufacturer || "",
      ManufacturerPartNumber: equipment.model || "",
      TechnicalInformation: equipment.notes || "",
      // ... המרת שדות נוספים
    };

    const equipmentExists = await checkIfEquipmentExistsInSap(equipment.equipmentId);
    
    if (equipmentExists) {
      // עדכון ציוד קיים
      await sapClient.put(
        `${SAP_ENDPOINTS.equipment}('${equipment.equipmentId}')`,
        sapEquipment
      );
    } else {
      // יצירת ציוד חדש
      await sapClient.post(
        SAP_ENDPOINTS.equipment,
        sapEquipment
      );
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending equipment ${equipment.id} to SAP:`, error);
    return false;
  }
}

/**
 * בדיקה האם ציוד קיים ב-SAP
 */
async function checkIfEquipmentExistsInSap(equipmentId: string): Promise<boolean> {
  try {
    const response = await sapClient.get<any>(
      `${SAP_ENDPOINTS.equipment}('${equipmentId}')`
    );
    return !!response;
  } catch (error) {
    // אם קיבלנו 404, הציוד לא קיים
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    // בכל שגיאה אחרת, נזרוק את השגיאה
    throw error;
  }
}

/**
 * המרה הפוכה של קטגוריות ציוד מהמערכת שלנו לקודים של SAP
 */
function reverseMappingCategory(category: string): string {
  switch (category) {
    case 'ציוד מכני': return 'M';
    case 'ציוד חשמלי': return 'E';
    case 'ציוד הידראולי': return 'H';
    case 'ציוד שינוע': return 'P';
    case 'מכונות אוטומטיות': return 'A';
    case 'מערכות חימום': return 'T';
    case 'מיכלי אחסון': return 'S';
    default: return 'O'; // אחר
  }
}

/**
 * המרה הפוכה של סטטוס ציוד מהמערכת שלנו לקודים של SAP
 */
function reverseMappingStatus(status: string): string {
  switch (status) {
    case 'פעיל': return 'ACTV';
    case 'לא פעיל': return 'INAC';
    case 'בהתקנה': return 'INST';
    case 'דורש בדיקה': return 'MREQ';
    case 'בתחזוקה': return 'MACT';
    case 'מושבת': return 'DISC';
    default: return 'UNKN'; // לא ידוע
  }
}

// חסר כאן import של axios
import axios from 'axios';