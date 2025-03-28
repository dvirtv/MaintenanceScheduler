/**
 * מודול SAP - נקודת כניסה ראשית
 * מייצא את כל הפונקציות והמחלקות הקשורות ל-SAP
 */

// ייצוא הקונפיגורציה
export * from './config';

// ייצוא הקליינט
export { sapClient } from './client';

// ייצוא פונקציות סנכרון של ציוד
export {
  getSapEquipmentById,
  getAllSapEquipment,
  syncAllEquipment,
  sendEquipmentToSap,
} from './equipment-sync';

// ייצוא פונקציות סנכרון של הזמנות עבודה
export {
  getSapWorkOrderById,
  getAllSapWorkOrders,
  getSapWorkOrdersByEquipment,
  syncAllWorkOrders,
  sendWorkOrderToSap,
} from './workorder-sync';

/**
 * פונקציה להפעלת סנכרון מלא עם SAP
 */
export async function syncAllData() {
  const equipmentPromise = import('./equipment-sync').then(module => module.syncAllEquipment());
  const workOrdersPromise = import('./workorder-sync').then(module => module.syncAllWorkOrders());
  
  try {
    const [equipmentResult, workOrdersResult] = await Promise.all([
      equipmentPromise,
      workOrdersPromise
    ]);
    
    console.log('SAP synchronization completed successfully:');
    console.log('Equipment:', equipmentResult);
    console.log('Work Orders:', workOrdersResult);
    
    return {
      equipment: equipmentResult,
      workOrders: workOrdersResult,
      success: true
    };
  } catch (error) {
    console.error('Error during SAP synchronization:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error during synchronization',
      success: false
    };
  }
}