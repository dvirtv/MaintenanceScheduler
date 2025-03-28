import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEquipmentSchema, 
  insertWorkOrderSchema, 
  insertStaffSchema, 
  insertMaintenanceHistorySchema 
} from "@shared/schema";
import { z } from "zod";
import * as sapService from "./sap";

export async function registerRoutes(app: Express): Promise<Server> {
  // Equipment routes
  app.get("/api/equipment", async (_req: Request, res: Response) => {
    try {
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment", error });
    }
  });

  app.get("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const equipment = await storage.getEquipment(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment", error });
    }
  });

  app.post("/api/equipment", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEquipmentSchema.parse(req.body);
      const newEquipment = await storage.createEquipment(validatedData);
      res.status(201).json(newEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating equipment", error });
    }
  });

  app.put("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const updatedEquipment = await storage.updateEquipment(id, req.body);
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      res.status(500).json({ message: "Error updating equipment", error });
    }
  });

  app.delete("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const success = await storage.deleteEquipment(id);
      if (!success) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting equipment", error });
    }
  });

  // Work orders routes
  app.get("/api/work-orders", async (_req: Request, res: Response) => {
    try {
      const workOrders = await storage.getAllWorkOrders();
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work orders", error });
    }
  });

  app.get("/api/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid work order ID" });
      }
      
      const workOrder = await storage.getWorkOrder(id);
      if (!workOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      res.json(workOrder);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work order", error });
    }
  });

  app.get("/api/equipment/:id/work-orders", async (req: Request, res: Response) => {
    try {
      const equipmentId = parseInt(req.params.id);
      if (isNaN(equipmentId)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const workOrders = await storage.getWorkOrdersByEquipment(equipmentId);
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work orders for equipment", error });
    }
  });

  app.post("/api/work-orders", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkOrderSchema.parse(req.body);
      const newWorkOrder = await storage.createWorkOrder(validatedData);
      res.status(201).json(newWorkOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid work order data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating work order", error });
    }
  });

  app.put("/api/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid work order ID" });
      }
      
      const updatedWorkOrder = await storage.updateWorkOrder(id, req.body);
      if (!updatedWorkOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      res.json(updatedWorkOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating work order", error });
    }
  });

  app.delete("/api/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid work order ID" });
      }
      
      const success = await storage.deleteWorkOrder(id);
      if (!success) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting work order", error });
    }
  });

  // Staff routes
  app.get("/api/staff", async (_req: Request, res: Response) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff", error });
    }
  });

  app.get("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid staff ID" });
      }
      
      const staffMember = await storage.getStaff(id);
      if (!staffMember) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(staffMember);
    } catch (error) {
      res.status(500).json({ message: "Error fetching staff member", error });
    }
  });

  app.get("/api/staff/:id/work-orders", async (req: Request, res: Response) => {
    try {
      const staffId = parseInt(req.params.id);
      if (isNaN(staffId)) {
        return res.status(400).json({ message: "Invalid staff ID" });
      }
      
      const workOrders = await storage.getWorkOrdersByAssignee(staffId);
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work orders for staff", error });
    }
  });

  app.post("/api/staff", async (req: Request, res: Response) => {
    try {
      const validatedData = insertStaffSchema.parse(req.body);
      const newStaff = await storage.createStaff(validatedData);
      res.status(201).json(newStaff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating staff", error });
    }
  });

  app.put("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid staff ID" });
      }
      
      const updatedStaff = await storage.updateStaff(id, req.body);
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.json(updatedStaff);
    } catch (error) {
      res.status(500).json({ message: "Error updating staff", error });
    }
  });

  app.delete("/api/staff/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid staff ID" });
      }
      
      const success = await storage.deleteStaff(id);
      if (!success) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting staff", error });
    }
  });

  // Maintenance history routes
  app.get("/api/equipment/:id/maintenance-history", async (req: Request, res: Response) => {
    try {
      const equipmentId = parseInt(req.params.id);
      if (isNaN(equipmentId)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const history = await storage.getMaintenanceHistoryByEquipment(equipmentId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Error fetching maintenance history", error });
    }
  });

  app.post("/api/maintenance-history", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMaintenanceHistorySchema.parse(req.body);
      const newHistory = await storage.createMaintenanceHistory(validatedData);
      res.status(201).json(newHistory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance history data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating maintenance history", error });
    }
  });

  // SAP Integration routes
  app.get("/api/sap/equipment", async (_req: Request, res: Response) => {
    try {
      const sapEquipment = await sapService.getAllSapEquipment();
      res.json(sapEquipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment from SAP", error });
    }
  });

  app.get("/api/sap/equipment/:id", async (req: Request, res: Response) => {
    try {
      const equipment = await sapService.getSapEquipmentById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found in SAP" });
      }
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching equipment from SAP", error });
    }
  });

  app.get("/api/sap/work-orders", async (_req: Request, res: Response) => {
    try {
      const workOrders = await sapService.getAllSapWorkOrders();
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work orders from SAP", error });
    }
  });

  app.get("/api/sap/equipment/:id/work-orders", async (req: Request, res: Response) => {
    try {
      const workOrders = await sapService.getSapWorkOrdersByEquipment(req.params.id);
      res.json(workOrders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work orders from SAP", error });
    }
  });

  app.post("/api/sap/sync/equipment", async (_req: Request, res: Response) => {
    try {
      const result = await sapService.syncAllEquipment();
      res.json({
        message: "Equipment synchronization completed",
        result
      });
    } catch (error) {
      res.status(500).json({ message: "Error synchronizing equipment from SAP", error });
    }
  });

  app.post("/api/sap/sync/work-orders", async (_req: Request, res: Response) => {
    try {
      const result = await sapService.syncAllWorkOrders();
      res.json({
        message: "Work orders synchronization completed",
        result
      });
    } catch (error) {
      res.status(500).json({ message: "Error synchronizing work orders from SAP", error });
    }
  });

  app.post("/api/sap/sync/all", async (_req: Request, res: Response) => {
    try {
      const result = await sapService.syncAllData();
      res.json({
        message: "Full SAP synchronization completed",
        result
      });
    } catch (error) {
      res.status(500).json({ message: "Error during full SAP synchronization", error });
    }
  });

  app.post("/api/sap/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }
      
      const equipment = await storage.getEquipment(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      const success = await sapService.sendEquipmentToSap(equipment);
      if (!success) {
        return res.status(500).json({ message: "Failed to send equipment to SAP" });
      }
      
      res.json({ success: true, message: "Equipment sent to SAP successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error sending equipment to SAP", error });
    }
  });

  app.post("/api/sap/work-orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid work order ID" });
      }
      
      const workOrder = await storage.getWorkOrder(id);
      if (!workOrder) {
        return res.status(404).json({ message: "Work order not found" });
      }
      
      const success = await sapService.sendWorkOrderToSap(workOrder);
      if (!success) {
        return res.status(500).json({ message: "Failed to send work order to SAP" });
      }
      
      res.json({ success: true, message: "Work order sent to SAP successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error sending work order to SAP", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
