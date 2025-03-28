import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Equipment categories
export const EQUIPMENT_CATEGORIES = [
  "ציוד הידראולי",
  "ציוד שינוע",
  "מכונות אוטומטיות",
  "מיכלי אחסון",
  "מערכות חימום",
  "ציוד חשמלי",
  "ציוד מכני",
  "אחר"
] as const;

// Equipment status options
export const EQUIPMENT_STATUSES = [
  "פעיל",
  "לא פעיל",
  "דורש בדיקה",
  "בתחזוקה",
  "מושבת"
] as const;

// Work order priority levels
export const PRIORITY_LEVELS = [
  "נמוכה",
  "בינונית",
  "גבוהה",
  "דחופה"
] as const;

// Work order status options
export const WORK_ORDER_STATUSES = [
  "פתוחה",
  "בטיפול",
  "ממתינה לחלקים",
  "הושלמה",
  "בוטלה"
] as const;

// Equipment/Assets table
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  equipmentId: text("equipment_id").notNull().unique(), // e.g. EQP-1042
  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  manufacturer: text("manufacturer"),
  model: text("model"),
  installDate: text("install_date"),
  specifications: jsonb("specifications"), // Technical specs
  notes: text("notes"),
  nextMaintenanceDate: text("next_maintenance_date"),
  lastMaintenanceDate: text("last_maintenance_date"),
  lastMaintenanceStatus: text("last_maintenance_status"),
  sapLastSyncDate: text("sap_last_sync_date"),
  sapSyncStatus: text("sap_sync_status"),
});

// Work orders table
export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  workOrderId: text("work_order_id"), // SAP work order ID
  title: text("title").notNull(),
  description: text("description").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  type: text("type"), // Type of work order (maintenance, repair, etc.)
  assignedTo: integer("assigned_to"),
  createdDate: text("created_date").notNull(),
  dueDate: text("due_date"), // When the work should be completed by
  completionDate: text("completion_date"),
  notes: text("notes"),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  location: text("location"),
  parts: jsonb("parts").default('[]'),
  sapLastSyncDate: text("sap_last_sync_date"),
  sapSyncStatus: text("sap_sync_status"),
});

// Maintenance staff table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  specialization: text("specialization"),
  contactInfo: text("contact_info"),
  isActive: boolean("is_active").notNull().default(true),
});

// Maintenance history table
export const maintenanceHistory = pgTable("maintenance_history", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  workOrderId: integer("work_order_id"),
  performedBy: integer("performed_by").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  outcome: text("outcome"),
});

// Create insert schemas
export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
});

export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  id: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
});

export const insertMaintenanceHistorySchema = createInsertSchema(maintenanceHistory).omit({
  id: true,
});

// Export types
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;

export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;

export type MaintenanceHistory = typeof maintenanceHistory.$inferSelect;
export type InsertMaintenanceHistory = z.infer<typeof insertMaintenanceHistorySchema>;
