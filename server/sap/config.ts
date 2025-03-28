import dotenv from 'dotenv';

// טען את משתני הסביבה
dotenv.config();

// קונפיגורציית SAP
export const SAP_CONFIG = {
  baseUrl: process.env.SAP_API_URL || 'https://api.example.sap.com',
  username: process.env.SAP_API_USERNAME,
  password: process.env.SAP_API_PASSWORD,
  clientId: process.env.SAP_CLIENT_ID,
  gateway: process.env.SAP_GATEWAY || '/sap/opu/odata/sap',
  systemId: process.env.SAP_SYSTEM_ID || 'DEV',
  timeout: 30000, // timeout בmilliseconds
};

// אנדפוינטים של SAP
export const SAP_ENDPOINTS = {
  equipment: '/API_EQUIPMENT/Equipment',
  workOrders: '/API_MAINTENANCEORDER/MaintenanceOrder',
  workOrderOperations: '/API_MAINTENANCEORDER/Operation',
  materials: '/API_MATERIAL/Material',
  functionalLocations: '/API_FUNCTIONALLOCATION/FunctionalLocation',
};

// טיפוסי נתונים ב-SAP
export enum SAP_ENTITY_TYPES {
  EQUIPMENT = 'EQUI',
  MAINTENANCE_ORDER = 'ORDR',
  NOTIFICATION = 'NOTF',
  FUNCTIONAL_LOCATION = 'FUNC',
}

// סטטוסים של SAP
export enum SAP_STATUS_CODES {
  OPEN = 'I0001',
  IN_PROGRESS = 'I0002',
  COMPLETED = 'I0009',
  CLOSED = 'I0045',
  WAITING_FOR_PARTS = 'I0068',
}

// ממפה סטטוסים של SAP לסטטוסים שלנו
export const mapSapStatusToLocal = (sapStatus: string): string => {
  switch (sapStatus) {
    case SAP_STATUS_CODES.OPEN:
      return 'פתוחה';
    case SAP_STATUS_CODES.IN_PROGRESS:
      return 'בטיפול';
    case SAP_STATUS_CODES.COMPLETED:
      return 'הושלמה';
    case SAP_STATUS_CODES.CLOSED:
      return 'סגורה';
    case SAP_STATUS_CODES.WAITING_FOR_PARTS:
      return 'ממתינה לחלקים';
    default:
      return 'לא ידוע';
  }
};

// ממפה סטטוסים שלנו לסטטוסים של SAP
export const mapLocalStatusToSap = (localStatus: string): string => {
  switch (localStatus) {
    case 'פתוחה':
      return SAP_STATUS_CODES.OPEN;
    case 'בטיפול':
      return SAP_STATUS_CODES.IN_PROGRESS;
    case 'הושלמה':
      return SAP_STATUS_CODES.COMPLETED;
    case 'סגורה':
      return SAP_STATUS_CODES.CLOSED;
    case 'ממתינה לחלקים':
      return SAP_STATUS_CODES.WAITING_FOR_PARTS;
    default:
      return SAP_STATUS_CODES.OPEN;
  }
};