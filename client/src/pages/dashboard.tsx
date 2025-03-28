import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useDashboard } from "@/hooks/use-dashboard";
import { Link } from "wouter";
import { Clock, AlertCircle, CheckCircle2, ArrowRight, Wrench } from "lucide-react";

const Dashboard: React.FC = () => {
  const { 
    equipmentStats, 
    workOrdersByStatus, 
    workOrdersByPriority, 
    upcomingMaintenance,
    isLoading
  } = useDashboard();

  const COLORS = ['#0F4C81', '#F2994A', '#EB5757', '#27AE60', '#6FCF97'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">{equipmentStats.total}</span>
              <span className="text-sm text-neutral-dark">סך כל הציוד</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-success">{equipmentStats.active}</span>
              <span className="text-sm text-neutral-dark">ציוד פעיל</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-warning">{equipmentStats.needsInspection}</span>
              <span className="text-sm text-neutral-dark">דורש בדיקה</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-danger">{equipmentStats.inactive}</span>
              <span className="text-sm text-neutral-dark">לא פעיל</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Orders by Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">סטטוס הזמנות עבודה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workOrdersByStatus}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip 
                    formatter={(value) => [`${value} הזמנות`, '']}
                    labelFormatter={(label) => `סטטוס: ${label}`}
                  />
                  <Bar dataKey="value" fill="#0F4C81" barSize={20} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Work Orders by Priority */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">הזמנות עבודה לפי דחיפות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workOrdersByPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          className="text-xs"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {workOrdersByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                  <Tooltip formatter={(value) => [`${value} הזמנות`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">תחזוקה קרובה</CardTitle>
          <Link href="/schedule">
            <div className="text-sm text-primary hover:underline flex items-center">
              צפייה בכל לוח הזמנים
              <ArrowRight className="mr-1" size={16} />
            </div>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMaintenance.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">אין משימות תחזוקה מתוכננות בקרוב</p>
            ) : (
              upcomingMaintenance.map((maintenance) => (
                <div 
                  key={maintenance.id} 
                  className="bg-neutral-light p-3 rounded-lg border border-neutral-medium border-opacity-50 flex justify-between items-center"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${maintenance.daysUntil <= 3 ? 'bg-danger text-white' : maintenance.daysUntil <= 7 ? 'bg-warning text-white' : 'bg-primary text-white'}`}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{maintenance.equipmentName}</div>
                      <div className="text-sm text-neutral-dark">{maintenance.location}</div>
                      <div className="text-sm mt-1">
                        {maintenance.maintenanceType || "תחזוקה שוטפת"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`text-sm font-medium ${maintenance.daysUntil <= 3 ? 'text-danger' : maintenance.daysUntil <= 7 ? 'text-warning' : 'text-primary'}`}>
                      {maintenance.scheduledDate}
                    </div>
                    <div className="text-xs text-neutral-dark mt-1">
                      {maintenance.daysUntil === 0 
                        ? 'היום'
                        : maintenance.daysUntil === 1
                        ? 'מחר'
                        : `בעוד ${maintenance.daysUntil} ימים`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/work-orders/new">
          <Card className="hover:bg-neutral-light cursor-pointer transition-colors duration-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-primary rounded-full p-3 text-white mb-2">
                <AlertCircle size={24} />
              </div>
              <div className="text-lg font-medium">דיווח על תקלה</div>
              <div className="text-sm text-neutral-dark">פתיחת הזמנת עבודה חדשה</div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/equipment/new">
          <Card className="hover:bg-neutral-light cursor-pointer transition-colors duration-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-secondary rounded-full p-3 text-white mb-2">
                <Wrench size={24} />
              </div>
              <div className="text-lg font-medium">הוספת ציוד חדש</div>
              <div className="text-sm text-neutral-dark">הוספת נכס למערכת</div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/schedule">
          <Card className="hover:bg-neutral-light cursor-pointer transition-colors duration-200">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-success rounded-full p-3 text-white mb-2">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-lg font-medium">תזמון תחזוקה</div>
              <div className="text-sm text-neutral-dark">תכנון משימות אחזקה</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
