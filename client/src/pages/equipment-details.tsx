import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEquipmentById, useEquipmentWorkOrders, useEquipmentMaintenanceHistory } from "@/hooks/use-equipment";
import { formatDate } from "@/lib/utils/dates";
import WorkOrderForm from "@/components/dialogs/workorder-form";
import EquipmentForm from "@/components/dialogs/equipment-form";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  ClipboardList,
  FileCog,
  QrCode,
  BarChart,
  FileText,
  X,
  Edit,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const EquipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const equipmentId = parseInt(id);
  const { data: equipment, isLoading: isLoadingEquipment } = useEquipmentById(equipmentId);
  const { data: workOrders, isLoading: isLoadingWorkOrders } = useEquipmentWorkOrders(equipmentId);
  const { data: maintenanceHistory, isLoading: isLoadingHistory } = useEquipmentMaintenanceHistory(equipmentId);
  const { toast } = useToast();
  
  const [showAddWorkOrderDialog, setShowAddWorkOrderDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleAddWorkOrder = () => {
    setShowAddWorkOrderDialog(false);
    toast({
      title: "הזמנת עבודה נוצרה בהצלחה",
      description: "הזמנת העבודה נוספה למערכת",
      variant: "success",
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "פעיל":
        return "bg-success text-white";
      case "לא פעיל":
        return "bg-danger text-white";
      case "דורש בדיקה":
        return "bg-warning text-white";
      case "בתחזוקה":
        return "bg-primary-light text-white";
      case "מושבת":
        return "bg-neutral-dark text-white";
      default:
        return "bg-neutral-medium text-neutral-dark";
    }
  };

  if (isLoadingEquipment) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="text-danger h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">הציוד המבוקש לא נמצא</h3>
              <p className="text-neutral-dark mb-4">לא נמצא פריט ציוד עם המזהה שצוין</p>
              <Link href="/equipment">
                <Button>חזרה לרשימת הציוד</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-dark">
            {equipment.name}
          </h1>
          <div className="flex items-center space-x-2 mt-1 text-sm text-neutral-dark">
            <QrCode className="ml-1" size={16} />
            <span className="font-mono">{equipment.equipmentId}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(equipment.status)}>
            {equipment.status}
          </Badge>
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="ml-1" size={16} />
            עריכה
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">פרטי ציוד</TabsTrigger>
          <TabsTrigger value="maintenance">תחזוקה</TabsTrigger>
          <TabsTrigger value="work-orders">הזמנות עבודה</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment Basic Info */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">מידע בסיסי</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-dark font-medium">מזהה ציוד:</p>
                      <p className="font-mono">{equipment.equipmentId}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">שם:</p>
                      <p>{equipment.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">קטגוריה:</p>
                      <p>{equipment.category}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">מיקום:</p>
                      <p>{equipment.location}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">יצרן:</p>
                      <p>{equipment.manufacturer || "-"}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">מודל:</p>
                      <p>{equipment.model || "-"}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">תאריך התקנה:</p>
                      <p>{equipment.installDate ? formatDate(equipment.installDate) : "-"}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-dark font-medium">סטטוס:</p>
                      <p className={`font-medium ${
                        equipment.status === "פעיל" ? "text-success" : 
                        equipment.status === "לא פעיל" ? "text-danger" : 
                        equipment.status === "דורש בדיקה" ? "text-warning" : 
                        "text-neutral-dark"
                      }`}>{equipment.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Technical Specifications */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">מפרט טכני</CardTitle>
                </CardHeader>
                <CardContent>
                  {equipment.specifications ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(equipment.specifications).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-neutral-dark font-medium">{key}:</p>
                            <p>{value}</p>
                          </div>
                        ))}
                      </div>
                      
                      {equipment.notes && (
                        <div className="mt-3">
                          <p className="text-neutral-dark font-medium">הערות:</p>
                          <p className="text-sm">{equipment.notes}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-neutral-dark">אין מפרט טכני זמין</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Maintenance History */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-primary">היסטוריית תחזוקה</CardTitle>
                  <Link href={`/equipment/${equipment.id}/history`}>
                    <Button variant="link" className="text-sm">צפייה בכל ההיסטוריה</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : !maintenanceHistory || maintenanceHistory.length === 0 ? (
                    <p className="text-sm text-neutral-dark text-center py-2">אין היסטוריית תחזוקה זמינה</p>
                  ) : (
                    <div className="space-y-3">
                      {maintenanceHistory.slice(0, 3).map((history, index) => (
                        <div key={history.id} className={`${index < maintenanceHistory.length - 1 ? "border-b border-neutral-medium pb-2" : ""}`}>
                          <div className="flex justify-between text-sm">
                            <p className="font-medium">{history.description}</p>
                            <p className="text-neutral-dark">{formatDate(history.date)}</p>
                          </div>
                          <p className="text-xs text-neutral-dark mt-1">בוצע ע"י: {history.performedByName}</p>
                          <p className="text-xs mt-1">{history.outcome}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Maintenance Plan & Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">תוכנית תחזוקה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className={`ml-2 ${
                          !equipment.nextMaintenanceDate ? "text-neutral-dark" :
                          new Date(equipment.nextMaintenanceDate) <= new Date() ? "text-danger" :
                          new Date(equipment.nextMaintenanceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? "text-warning" :
                          "text-primary"
                        }`} size={16} />
                        <div>
                          <p className="font-medium">תחזוקה הבאה</p>
                          <p>{equipment.nextMaintenanceDate ? formatDate(equipment.nextMaintenanceDate) : "לא נקבע"}</p>
                        </div>
                      </div>
                      {equipment.nextMaintenanceDate && new Date(equipment.nextMaintenanceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                        <Badge className={new Date(equipment.nextMaintenanceDate) <= new Date() ? "bg-danger text-white" : "bg-warning text-white"}>
                          {new Date(equipment.nextMaintenanceDate) <= new Date() ? "עבר" : "בקרוב"}
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">סוג תחזוקה:</p>
                      <p>תחזוקה שוטפת רבעונית</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">פעולות תחזוקה נדרשות:</p>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                        <li>בדיקת לחצים ופליטת חום</li>
                        <li>ניקוי מסננים</li>
                        <li>החלפת אטמים במידת הצורך</li>
                        <li>בדיקת רעידות ורעשים</li>
                        <li>סיכת חלקים נעים</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href={`/equipment/${equipment.id}/schedule`}>
                      <Button className="w-full">
                        <Calendar className="ml-1" size={16} />
                        עדכון לוח זמנים
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">עבודות פתוחות</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingWorkOrders ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : !workOrders || workOrders.filter(wo => wo.status !== "הושלמה" && wo.status !== "בוטלה").length === 0 ? (
                    <p className="text-sm text-neutral-dark text-center py-2">אין עבודות פתוחות</p>
                  ) : (
                    <div className="space-y-3">
                      {workOrders.filter(wo => wo.status !== "הושלמה" && wo.status !== "בוטלה").slice(0, 2).map(workOrder => (
                        <div key={workOrder.id} className="bg-white p-3 rounded border border-neutral-medium">
                          <div className="flex justify-between text-sm">
                            <p className="font-medium">{workOrder.title}</p>
                            <Badge variant="outline" className={
                              workOrder.priority === "דחופה" ? "bg-danger-light text-danger" :
                              workOrder.priority === "גבוהה" ? "bg-warning-light text-warning" :
                              workOrder.priority === "בינונית" ? "bg-secondary-light text-secondary-dark" :
                              "bg-neutral-light text-neutral-dark"
                            }>
                              {workOrder.priority}
                            </Badge>
                          </div>
                          <p className="text-xs mt-1">{workOrder.description}</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-xs text-neutral-dark">נפתח: {formatDate(workOrder.createdAt)}</p>
                            <Link href={`/work-orders/${workOrder.id}`}>
                              <Button variant="link" className="text-xs h-auto p-0">צפייה בפרטים</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary-dark text-white"
                      onClick={() => setShowAddWorkOrderDialog(true)}
                    >
                      <ClipboardList className="ml-1" size={16} />
                      הוספת הזמנת עבודה
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">פעולות נוספות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-center">
                      <FileText className="ml-1" size={16} />
                      מסמכים טכניים
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-center">
                      <BarChart className="ml-1" size={16} />
                      ניתוח ביצועים
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-center">
                      <QrCode className="ml-1" size={16} />
                      הדפסת מדבקת QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>היסטוריית תחזוקה</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : !maintenanceHistory || maintenanceHistory.length === 0 ? (
                <div className="text-center py-6">
                  <FileCog className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">אין היסטוריית תחזוקה</h3>
                  <p className="text-sm text-neutral-dark mt-1">לציוד זה אין רישומי תחזוקה קודמים</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenanceHistory.map(history => (
                    <div key={history.id} className="border-b border-neutral-medium pb-4 last:border-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{history.description}</h3>
                        <Badge variant={history.workOrderId ? "outline" : "default"} className="text-xs">
                          {history.workOrderId ? "הזמנת עבודה" : "תחזוקה יזומה"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <p>בוצע ע"י: {history.performedByName}</p>
                        <p className="text-neutral-dark">{formatDate(history.date)}</p>
                      </div>
                      <p className="text-sm mt-2">{history.outcome}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button>
                <ClipboardList className="ml-1" size={16} />
                הוספת רשומת תחזוקה
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader>
              <CardTitle>הזמנות עבודה</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingWorkOrders ? (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : !workOrders || workOrders.length === 0 ? (
                <div className="text-center py-6">
                  <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">אין הזמנות עבודה</h3>
                  <p className="text-sm text-neutral-dark mt-1">לציוד זה אין הזמנות עבודה</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workOrders.map(workOrder => (
                    <div key={workOrder.id} className="bg-neutral-light p-4 rounded-lg border border-neutral-medium">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{workOrder.title}</h3>
                        <div className="flex space-x-2">
                          <Badge className={
                            workOrder.status === "פתוחה" ? "bg-primary" :
                            workOrder.status === "בטיפול" ? "bg-warning" :
                            workOrder.status === "ממתינה לחלקים" ? "bg-secondary" :
                            workOrder.status === "הושלמה" ? "bg-success" :
                            "bg-neutral-dark"
                          }>
                            {workOrder.status}
                          </Badge>
                          <Badge variant="outline" className={
                            workOrder.priority === "דחופה" ? "border-danger text-danger" :
                            workOrder.priority === "גבוהה" ? "border-warning text-warning" :
                            workOrder.priority === "בינונית" ? "border-secondary text-secondary-dark" :
                            "border-neutral-dark text-neutral-dark"
                          }>
                            {workOrder.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{workOrder.description}</p>
                      <div className="flex justify-between text-sm mt-3">
                        <div>
                          <p className="text-neutral-dark">נפתח: {formatDate(workOrder.createdAt)}</p>
                          {workOrder.completedAt && (
                            <p className="text-neutral-dark">הושלם: {formatDate(workOrder.completedAt)}</p>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-neutral-dark">מתוזמן ל: {workOrder.scheduledFor ? formatDate(workOrder.scheduledFor) : "לא נקבע"}</p>
                          <p>הוקצה ל: {workOrder.assignedToName || "לא הוקצה"}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Link href={`/work-orders/${workOrder.id}`}>
                          <Button variant="link" className="h-auto p-0">צפייה בפרטים</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button 
                className="bg-secondary hover:bg-secondary-dark text-white"
                onClick={() => setShowAddWorkOrderDialog(true)}
              >
                <ClipboardList className="ml-1" size={16} />
                הוספת הזמנת עבודה
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Work Order Dialog */}
      <WorkOrderForm 
        open={showAddWorkOrderDialog}
        onOpenChange={setShowAddWorkOrderDialog}
        equipment={equipment}
        onSave={handleAddWorkOrder}
      />

      {/* Edit Equipment Dialog */}
      <EquipmentForm 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        equipment={equipment}
      />
    </div>
  );
};

export default EquipmentDetails;
