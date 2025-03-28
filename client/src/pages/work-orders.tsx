import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkOrders } from '@/hooks/use-work-orders';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/dates';
import WorkOrderForm from '@/components/dialogs/workorder-form';
import WorkOrderCard from '@/components/work-orders/work-order-card';
import {
  Plus,
  Search,
  Filter,
  FilterX,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const WorkOrdersPage = () => {
  const { workOrders, isLoading, error } = useWorkOrders();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredWorkOrders = workOrders.filter(order => {
    // Search filter
    if (searchTerm && !order.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter && order.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // Group work orders by status
  const openOrders = filteredWorkOrders.filter(order => order.status === "פתוחה");
  const inProgressOrders = filteredWorkOrders.filter(order => order.status === "בטיפול");
  const waitingForPartsOrders = filteredWorkOrders.filter(order => order.status === "ממתינה לחלקים");
  const completedOrders = filteredWorkOrders.filter(order => order.status === "הושלמה");
  const canceledOrders = filteredWorkOrders.filter(order => order.status === "בוטלה");

  // Work orders by priority
  const allActiveOrders = filteredWorkOrders.filter(order => 
    order.status !== "הושלמה" && order.status !== "בוטלה"
  );
  
  const urgentOrders = allActiveOrders.filter(order => order.priority === "דחופה");
  const highPriorityOrders = allActiveOrders.filter(order => order.priority === "גבוהה");
  const mediumPriorityOrders = allActiveOrders.filter(order => order.priority === "בינונית");
  const lowPriorityOrders = allActiveOrders.filter(order => order.priority === "נמוכה");

  const handleFilterClear = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setPriorityFilter(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="text-danger h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">שגיאה בטעינת נתונים</h3>
              <p className="text-neutral-dark mb-4">לא ניתן לטעון את רשימת הזמנות העבודה</p>
              <Button onClick={() => window.location.reload()}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
        <h1 className="text-2xl font-semibold text-neutral-dark">הזמנות עבודה</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            {showFilters ? <FilterX size={16} className="ml-1" /> : <Filter size={16} className="ml-1" />}
            {showFilters ? "הסתר סינון" : "סינון"}
            {(statusFilter || priorityFilter) && !showFilters && (
              <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
                {((statusFilter ? 1 : 0) + (priorityFilter ? 1 : 0))}
              </Badge>
            )}
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="חיפוש הזמנות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-36 lg:w-64 h-10"
            />
            <Search className="absolute left-3 top-2.5 text-neutral-dark text-opacity-70" size={16} />
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="ml-1" />
            הזמנת עבודה חדשה
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <div>
                <p className="text-sm mb-1 font-medium">סטטוס:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant={statusFilter === "פתוחה" ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === "פתוחה" ? null : "פתוחה")}
                  >
                    פתוחה
                  </Badge>
                  <Badge 
                    variant={statusFilter === "בטיפול" ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === "בטיפול" ? null : "בטיפול")}
                  >
                    בטיפול
                  </Badge>
                  <Badge 
                    variant={statusFilter === "ממתינה לחלקים" ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === "ממתינה לחלקים" ? null : "ממתינה לחלקים")}
                  >
                    ממתינה לחלקים
                  </Badge>
                  <Badge 
                    variant={statusFilter === "הושלמה" ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === "הושלמה" ? null : "הושלמה")}
                  >
                    הושלמה
                  </Badge>
                  <Badge 
                    variant={statusFilter === "בוטלה" ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === "בוטלה" ? null : "בוטלה")}
                  >
                    בוטלה
                  </Badge>
                </div>
              </div>
              <div className="mr-6">
                <p className="text-sm mb-1 font-medium">דחיפות:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant={priorityFilter === "דחופה" ? "default" : "outline"} 
                    className={`cursor-pointer ${priorityFilter === "דחופה" ? "bg-danger text-white" : "hover:border-danger hover:text-danger"}`}
                    onClick={() => setPriorityFilter(priorityFilter === "דחופה" ? null : "דחופה")}
                  >
                    דחופה
                  </Badge>
                  <Badge 
                    variant={priorityFilter === "גבוהה" ? "default" : "outline"} 
                    className={`cursor-pointer ${priorityFilter === "גבוהה" ? "bg-warning text-white" : "hover:border-warning hover:text-warning"}`}
                    onClick={() => setPriorityFilter(priorityFilter === "גבוהה" ? null : "גבוהה")}
                  >
                    גבוהה
                  </Badge>
                  <Badge 
                    variant={priorityFilter === "בינונית" ? "default" : "outline"} 
                    className={`cursor-pointer ${priorityFilter === "בינונית" ? "bg-secondary text-white" : "hover:border-secondary hover:text-secondary"}`}
                    onClick={() => setPriorityFilter(priorityFilter === "בינונית" ? null : "בינונית")}
                  >
                    בינונית
                  </Badge>
                  <Badge 
                    variant={priorityFilter === "נמוכה" ? "default" : "outline"} 
                    className={`cursor-pointer ${priorityFilter === "נמוכה" ? "bg-primary text-white" : "hover:border-primary hover:text-primary"}`}
                    onClick={() => setPriorityFilter(priorityFilter === "נמוכה" ? null : "נמוכה")}
                  >
                    נמוכה
                  </Badge>
                </div>
              </div>
              <div className="mr-auto flex items-end">
                <Button variant="ghost" onClick={handleFilterClear} size="sm">
                  נקה סינון
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Orders Views */}
      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">לפי סטטוס</TabsTrigger>
          <TabsTrigger value="priority">לפי דחיפות</TabsTrigger>
        </TabsList>

        {/* View by Status */}
        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Open */}
            <div>
              <div className="flex items-center mb-3">
                <AlertCircle size={18} className="text-primary ml-1" />
                <h2 className="text-lg font-medium">פתוחות ({openOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {openOrders.length > 0 ? (
                  openOrders.map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה פתוחות</p>
                  </div>
                )}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex items-center mb-3">
                <Loader2 size={18} className="text-warning ml-1" />
                <h2 className="text-lg font-medium">בטיפול ({inProgressOrders.length + waitingForPartsOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {inProgressOrders.length > 0 || waitingForPartsOrders.length > 0 ? (
                  <>
                    {inProgressOrders.map(order => (
                      <WorkOrderCard key={order.id} workOrder={order} />
                    ))}
                    {waitingForPartsOrders.map(order => (
                      <WorkOrderCard key={order.id} workOrder={order} />
                    ))}
                  </>
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה בטיפול</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex items-center mb-3">
                <CheckCircle size={18} className="text-success ml-1" />
                <h2 className="text-lg font-medium">הושלמו ({completedOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {completedOrders.length > 0 ? (
                  completedOrders.slice(0, 5).map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה שהושלמו</p>
                  </div>
                )}
                {completedOrders.length > 5 && (
                  <div className="text-center">
                    <Button variant="link">צפייה בכל ההזמנות שהושלמו</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* View by Priority */}
        <TabsContent value="priority">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent */}
            <div>
              <div className="flex items-center mb-3">
                <AlertTriangle size={18} className="text-danger ml-1" />
                <h2 className="text-lg font-medium">דחופות ({urgentOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {urgentOrders.length > 0 ? (
                  urgentOrders.map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה דחופות</p>
                  </div>
                )}
              </div>
            </div>

            {/* High Priority */}
            <div>
              <div className="flex items-center mb-3">
                <Clock size={18} className="text-warning ml-1" />
                <h2 className="text-lg font-medium">גבוהות ({highPriorityOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {highPriorityOrders.length > 0 ? (
                  highPriorityOrders.map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה בדחיפות גבוהה</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center mb-3">
                <Clock size={18} className="text-secondary ml-1" />
                <h2 className="text-lg font-medium">בינוניות ({mediumPriorityOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {mediumPriorityOrders.length > 0 ? (
                  mediumPriorityOrders.map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה בדחיפות בינונית</p>
                  </div>
                )}
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center mb-3">
                <Clock size={18} className="text-primary ml-1" />
                <h2 className="text-lg font-medium">נמוכות ({lowPriorityOrders.length})</h2>
              </div>
              <div className="space-y-3">
                {lowPriorityOrders.length > 0 ? (
                  lowPriorityOrders.map(order => (
                    <WorkOrderCard key={order.id} workOrder={order} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-neutral-medium text-center">
                    <p className="text-sm text-neutral-dark">אין הזמנות עבודה בדחיפות נמוכה</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Work Order Dialog */}
      <WorkOrderForm 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={() => setShowAddDialog(false)}
      />
    </div>
  );
};

export default WorkOrdersPage;
