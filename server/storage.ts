import { 
  type Equipment, 
  type InsertEquipment, 
  type WorkOrder, 
  type InsertWorkOrder,
  type Staff,
  type InsertStaff,
  type MaintenanceHistory,
  type InsertMaintenanceHistory
} from "@shared/schema";

export interface IStorage {
  // Equipment methods
  getEquipment(id: number): Promise<Equipment | undefined>;
  getEquipmentByEquipmentId(equipmentId: string): Promise<Equipment | undefined>;
  getAllEquipment(): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<Equipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;
  
  // Work order methods
  getWorkOrder(id: number): Promise<WorkOrder | undefined>;
  getAllWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrdersByEquipment(equipmentId: number): Promise<WorkOrder[]>;
  getWorkOrdersByAssignee(staffId: number): Promise<WorkOrder[]>;
  createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: number, workOrder: Partial<WorkOrder>): Promise<WorkOrder | undefined>;
  deleteWorkOrder(id: number): Promise<boolean>;
  
  // Staff methods
  getStaff(id: number): Promise<Staff | undefined>;
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<Staff>): Promise<Staff | undefined>;
  deleteStaff(id: number): Promise<boolean>;
  
  // Maintenance history methods
  getMaintenanceHistory(id: number): Promise<MaintenanceHistory | undefined>;
  getMaintenanceHistoryByEquipment(equipmentId: number): Promise<MaintenanceHistory[]>;
  createMaintenanceHistory(history: InsertMaintenanceHistory): Promise<MaintenanceHistory>;
}

export class MemStorage implements IStorage {
  private equipment: Map<number, Equipment>;
  private workOrders: Map<number, WorkOrder>;
  private staff: Map<number, Staff>;
  private maintenanceHistory: Map<number, MaintenanceHistory>;
  private equipmentIdCounter: number;
  private workOrderIdCounter: number;
  private staffIdCounter: number;
  private maintenanceHistoryIdCounter: number;

  constructor() {
    this.equipment = new Map();
    this.workOrders = new Map();
    this.staff = new Map();
    this.maintenanceHistory = new Map();
    this.equipmentIdCounter = 1;
    this.workOrderIdCounter = 1;
    this.staffIdCounter = 1;
    this.maintenanceHistoryIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample staff
    const staff1: Staff = {
      id: this.staffIdCounter++,
      name: "אבי כהן",
      position: "מנהל אחזקה",
      specialization: "מערכות חשמל",
      contactInfo: "050-1234567",
      isActive: true,
    };
    
    const staff2: Staff = {
      id: this.staffIdCounter++,
      name: "יוסי לוי",
      position: "טכנאי בכיר",
      specialization: "מערכות הידראוליות",
      contactInfo: "052-7654321",
      isActive: true,
    };
    
    const staff3: Staff = {
      id: this.staffIdCounter++,
      name: "דוד כהן",
      position: "טכנאי",
      specialization: "מערכות מכניות",
      contactInfo: "053-1122334",
      isActive: true,
    };
    
    const staff4: Staff = {
      id: this.staffIdCounter++,
      name: "עמית ישראל",
      position: "טכנאי",
      specialization: "אוטומציה ובקרה",
      contactInfo: "054-5566778",
      isActive: true,
    };
    
    this.staff.set(staff1.id, staff1);
    this.staff.set(staff2.id, staff2);
    this.staff.set(staff3.id, staff3);
    this.staff.set(staff4.id, staff4);
    
    // Sample equipment
    const equip1: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-1042",
      name: "משאבת סחרור ראשית",
      category: "ציוד הידראולי",
      location: "אולם ייצור - קו 2",
      status: "פעיל",
      manufacturer: "Flowtech Industries",
      model: "FT-3000-HP",
      installDate: "2020-06-15",
      specifications: {
        power: "75kW",
        voltage: "380V",
        flowRate: "500 m³/h",
        maxPressure: "12 bar",
      },
      notes: "יש להקפיד על טמפרטורת נוזל עבודה מקסימלית של 85°C",
      nextMaintenanceDate: "2023-07-25",
      lastMaintenanceDate: "2023-05-01",
      lastMaintenanceStatus: "הושלמה",
    };
    
    const equip2: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-2381",
      name: "מסוע אבקה #3",
      category: "ציוד שינוע",
      location: "מחלקת אריזה",
      status: "דורש בדיקה",
      manufacturer: "ConveyTech",
      model: "CT-500",
      installDate: "2019-08-10",
      specifications: {
        length: "45m",
        width: "0.8m",
        speed: "0.5m/s",
      },
      notes: "יש לבדוק את מתיחת הרצועה מדי חודש",
      nextMaintenanceDate: "2023-06-10",
      lastMaintenanceDate: "2023-03-15",
      lastMaintenanceStatus: "הושלמה",
    };
    
    const equip3: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-7532",
      name: "רובוט אריזה",
      category: "מכונות אוטומטיות",
      location: "קו אריזה אוטומטי",
      status: "לא פעיל",
      manufacturer: "RoboPackers",
      model: "RP-2000",
      installDate: "2021-01-05",
      specifications: {
        cycles: "60/min",
        payloadMax: "25kg",
        accuracy: "±0.1mm",
      },
      notes: "דורש כיול מדי 3 חודשים",
      nextMaintenanceDate: "2023-08-30",
      lastMaintenanceDate: "2023-06-05",
      lastMaintenanceStatus: "לא הושלמה",
    };
    
    const equip4: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-3120",
      name: "מיכל אחסון 2000 ליטר",
      category: "מיכלי אחסון",
      location: "אולם מיכלים - יחידה 4",
      status: "פעיל",
      manufacturer: "StorageSolutions",
      model: "ST-2000L",
      installDate: "2022-03-20",
      specifications: {
        volume: "2000L",
        material: "316L SS",
        pressure: "3 bar",
      },
      notes: "יש לבדוק אטימות מדי רבעון",
      nextMaintenanceDate: "2023-10-10",
      lastMaintenanceDate: "2023-04-12",
      lastMaintenanceStatus: "הושלמה",
    };
    
    const equip5: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-9273",
      name: "מעבד חום תעשייתי",
      category: "מערכות חימום",
      location: "יחידת עיבוד חום",
      status: "פעיל",
      manufacturer: "ThermalPro",
      model: "TP-500",
      installDate: "2021-09-15",
      specifications: {
        heatOutput: "500kW",
        maxTemp: "350°C",
        controlType: "PID",
      },
      notes: "יש לבדוק את חיישני טמפרטורה בכל תחזוקה",
      nextMaintenanceDate: "2023-08-18",
      lastMaintenanceDate: "2023-02-20",
      lastMaintenanceStatus: "הושלמה",
    };
    
    const equip6: Equipment = {
      id: this.equipmentIdCounter++,
      equipmentId: "EQP-4521",
      name: "גנרטור חירום 100kW",
      category: "ציוד חשמלי",
      location: "חדר גנרטורים",
      status: "דורש בדיקה",
      manufacturer: "PowerGen",
      model: "PG-100",
      installDate: "2020-10-05",
      specifications: {
        output: "100kW",
        voltage: "400V",
        phase: "3-phase",
        fuel: "diesel",
      },
      notes: "הפעלה אוטומטית בעת הפסקת חשמל, בדיקת עומס אחת לחודש",
      nextMaintenanceDate: "2023-07-02",
      lastMaintenanceDate: "2023-01-05",
      lastMaintenanceStatus: "הושלמה",
    };
    
    this.equipment.set(equip1.id, equip1);
    this.equipment.set(equip2.id, equip2);
    this.equipment.set(equip3.id, equip3);
    this.equipment.set(equip4.id, equip4);
    this.equipment.set(equip5.id, equip5);
    this.equipment.set(equip6.id, equip6);
    
    // Sample work orders
    const wo1: WorkOrder = {
      id: this.workOrderIdCounter++,
      title: "בדיקת דליפות",
      description: "דווח על דליפה קלה באזור מחבר הלחץ. יש לבדוק ולהחליף אטם במידת הצורך.",
      equipmentId: equip1.id,
      priority: "בינונית",
      status: "פתוחה",
      assignedTo: staff2.id,
      createdAt: "2023-06-10",
      scheduledFor: "2023-06-15",
      completedAt: null,
      notes: "",
    };
    
    const wo2: WorkOrder = {
      id: this.workOrderIdCounter++,
      title: "החלפת רצועת הנעה",
      description: "רצועת ההנעה של המסוע שחוקה. יש להחליפה בהתאם להוראות היצרן.",
      equipmentId: equip2.id,
      priority: "גבוהה",
      status: "בטיפול",
      assignedTo: staff3.id,
      createdAt: "2023-06-02",
      scheduledFor: "2023-06-05",
      completedAt: null,
      notes: "הוזמנו חלקי חילוף",
    };
    
    const wo3: WorkOrder = {
      id: this.workOrderIdCounter++,
      title: "תיקון תקלה ברובוט",
      description: "הרובוט מפסיק לעבוד באמצע מחזור העבודה. יש לבדוק את מערכת הבקרה.",
      equipmentId: equip3.id,
      priority: "דחופה",
      status: "ממתינה לחלקים",
      assignedTo: staff4.id,
      createdAt: "2023-05-28",
      scheduledFor: "2023-05-30",
      completedAt: null,
      notes: "הוזמן טכנאי מומחה מהיצרן",
    };
    
    const wo4: WorkOrder = {
      id: this.workOrderIdCounter++,
      title: "בדיקת מסננים",
      description: "יש לבדוק ולנקות את כל המסננים במערכת.",
      equipmentId: equip5.id,
      priority: "נמוכה",
      status: "פתוחה",
      assignedTo: staff2.id,
      createdAt: "2023-06-01",
      scheduledFor: "2023-06-20",
      completedAt: null,
      notes: "",
    };
    
    const wo5: WorkOrder = {
      id: this.workOrderIdCounter++,
      title: "בדיקת דלק וסוללות",
      description: "יש לבדוק את מפלס הדלק ולוודא תקינות הסוללות.",
      equipmentId: equip6.id,
      priority: "בינונית",
      status: "פתוחה",
      assignedTo: staff1.id,
      createdAt: "2023-06-08",
      scheduledFor: "2023-06-12",
      completedAt: null,
      notes: "",
    };
    
    this.workOrders.set(wo1.id, wo1);
    this.workOrders.set(wo2.id, wo2);
    this.workOrders.set(wo3.id, wo3);
    this.workOrders.set(wo4.id, wo4);
    this.workOrders.set(wo5.id, wo5);
    
    // Sample maintenance history
    const hist1: MaintenanceHistory = {
      id: this.maintenanceHistoryIdCounter++,
      equipmentId: equip1.id,
      workOrderId: null,
      performedBy: staff2.id,
      date: "2023-05-01",
      description: "החלפת אטמים ובדיקת משאבה",
      outcome: "בוצע ע\"י יוסי לוי. הוחלפו אטמים ונעשתה בדיקת לחץ. המשאבה פועלת כראוי.",
    };
    
    const hist2: MaintenanceHistory = {
      id: this.maintenanceHistoryIdCounter++,
      equipmentId: equip1.id,
      workOrderId: null,
      performedBy: staff3.id,
      date: "2023-02-10",
      description: "בדיקת שמן וסיכה",
      outcome: "בוצע ע\"י דוד כהן. בוצעה החלפת שמן וסיכת חלקים נעים. נמצאה שחיקה קלה ביחידת ההנעה.",
    };
    
    const hist3: MaintenanceHistory = {
      id: this.maintenanceHistoryIdCounter++,
      equipmentId: equip1.id,
      workOrderId: null,
      performedBy: staff4.id,
      date: "2022-11-05",
      description: "החלפת מיסבים",
      outcome: "בוצע ע\"י עמית ישראל. הוחלפו מיסבים עקב רעשים חריגים. בוצע איזון מחדש של המערכת.",
    };
    
    this.maintenanceHistory.set(hist1.id, hist1);
    this.maintenanceHistory.set(hist2.id, hist2);
    this.maintenanceHistory.set(hist3.id, hist3);
  }

  // Equipment methods
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async getEquipmentByEquipmentId(equipmentId: string): Promise<Equipment | undefined> {
    for (const equip of this.equipment.values()) {
      if (equip.equipmentId === equipmentId) {
        return equip;
      }
    }
    return undefined;
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async createEquipment(equipment: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentIdCounter++;
    const newEquipment = { ...equipment, id };
    this.equipment.set(id, newEquipment);
    return newEquipment;
  }

  async updateEquipment(id: number, equipment: Partial<Equipment>): Promise<Equipment | undefined> {
    const existingEquipment = this.equipment.get(id);
    if (!existingEquipment) return undefined;
    
    const updatedEquipment = { ...existingEquipment, ...equipment };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }

  // Work order methods
  async getWorkOrder(id: number): Promise<WorkOrder | undefined> {
    return this.workOrders.get(id);
  }

  async getAllWorkOrders(): Promise<WorkOrder[]> {
    return Array.from(this.workOrders.values());
  }

  async getWorkOrdersByEquipment(equipmentId: number): Promise<WorkOrder[]> {
    return Array.from(this.workOrders.values()).filter(
      (wo) => wo.equipmentId === equipmentId
    );
  }

  async getWorkOrdersByAssignee(staffId: number): Promise<WorkOrder[]> {
    return Array.from(this.workOrders.values()).filter(
      (wo) => wo.assignedTo === staffId
    );
  }

  async createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder> {
    const id = this.workOrderIdCounter++;
    const newWorkOrder = { ...workOrder, id };
    this.workOrders.set(id, newWorkOrder);
    return newWorkOrder;
  }

  async updateWorkOrder(id: number, workOrder: Partial<WorkOrder>): Promise<WorkOrder | undefined> {
    const existingWorkOrder = this.workOrders.get(id);
    if (!existingWorkOrder) return undefined;
    
    const updatedWorkOrder = { ...existingWorkOrder, ...workOrder };
    this.workOrders.set(id, updatedWorkOrder);
    return updatedWorkOrder;
  }

  async deleteWorkOrder(id: number): Promise<boolean> {
    return this.workOrders.delete(id);
  }

  // Staff methods
  async getStaff(id: number): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async createStaff(staff: InsertStaff): Promise<Staff> {
    const id = this.staffIdCounter++;
    const newStaff = { ...staff, id };
    this.staff.set(id, newStaff);
    return newStaff;
  }

  async updateStaff(id: number, staff: Partial<Staff>): Promise<Staff | undefined> {
    const existingStaff = this.staff.get(id);
    if (!existingStaff) return undefined;
    
    const updatedStaff = { ...existingStaff, ...staff };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<boolean> {
    return this.staff.delete(id);
  }

  // Maintenance history methods
  async getMaintenanceHistory(id: number): Promise<MaintenanceHistory | undefined> {
    return this.maintenanceHistory.get(id);
  }

  async getMaintenanceHistoryByEquipment(equipmentId: number): Promise<MaintenanceHistory[]> {
    return Array.from(this.maintenanceHistory.values()).filter(
      (hist) => hist.equipmentId === equipmentId
    );
  }

  async createMaintenanceHistory(history: InsertMaintenanceHistory): Promise<MaintenanceHistory> {
    const id = this.maintenanceHistoryIdCounter++;
    const newHistory = { ...history, id };
    this.maintenanceHistory.set(id, newHistory);
    return newHistory;
  }
}

export const storage = new MemStorage();
