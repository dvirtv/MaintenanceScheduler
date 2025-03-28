import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  DownloadCloud, 
  Printer, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useEquipment } from '@/hooks/use-equipment';
import { useWorkOrders } from '@/hooks/use-work-orders';

const ReportsPage = () => {
  const { equipment } = useEquipment();
  const { workOrders } = useWorkOrders();

  // Sample data for charts
  const equipmentByStatusData = [
    { name: 'פעיל', value: equipment.filter(e => e.status === 'פעיל').length, color: '#27AE60' },
    { name: 'לא פעיל', value: equipment.filter(e => e.status === 'לא פעיל').length, color: '#EB5757' },
    { name: 'דורש בדיקה', value: equipment.filter(e => e.status === 'דורש בדיקה').length, color: '#F2994A' },
    { name: 'בתחזוקה', value: equipment.filter(e => e.status === 'בתחזוקה').length, color: '#3A6EA5' },
    { name: 'מושבת', value: equipment.filter(e => e.status === 'מושבת').length, color: '#3C4858' },
  ];

  const equipmentByCategoryData = [
    { name: 'ציוד הידראולי', value: equipment.filter(e => e.category === 'ציוד הידראולי').length },
    { name: 'ציוד שינוע', value: equipment.filter(e => e.category === 'ציוד שינוע').length },
    { name: 'מכונות אוטומטיות', value: equipment.filter(e => e.category === 'מכונות אוטומטיות').length },
    { name: 'מיכלי אחסון', value: equipment.filter(e => e.category === 'מיכלי אחסון').length },
    { name: 'מערכות חימום', value: equipment.filter(e => e.category === 'מערכות חימום').length },
    { name: 'ציוד חשמלי', value: equipment.filter(e => e.category === 'ציוד חשמלי').length },
    { name: 'ציוד מכני', value: equipment.filter(e => e.category === 'ציוד מכני').length },
    { name: 'אחר', value: equipment.filter(e => e.category === 'אחר').length },
  ];

  const workOrdersByStatusData = [
    { name: 'פתוחה', value: workOrders.filter(w => w.status === 'פתוחה').length, color: '#0F4C81' },
    { name: 'בטיפול', value: workOrders.filter(w => w.status === 'בטיפול').length, color: '#F2994A' },
    { name: 'ממתינה לחלקים', value: workOrders.filter(w => w.status === 'ממתינה לחלקים').length, color: '#F2C94C' },
    { name: 'הושלמה', value: workOrders.filter(w => w.status === 'הושלמה').length, color: '#27AE60' },
    { name: 'בוטלה', value: workOrders.filter(w => w.status === 'בוטלה').length, color: '#EB5757' },
  ];

  const workOrdersByPriorityData = [
    { name: 'נמוכה', value: workOrders.filter(w => w.priority === 'נמוכה').length, color: '#0F4C81' },
    { name: 'בינונית', value: workOrders.filter(w => w.priority === 'בינונית').length, color: '#F2994A' },
    { name: 'גבוהה', value: workOrders.filter(w => w.priority === 'גבוהה').length, color: '#F2C94C' },
    { name: 'דחופה', value: workOrders.filter(w => w.priority === 'דחופה').length, color: '#EB5757' },
  ];

  // Sample monthly maintenance data
  const maintenanceByMonthData = [
    { name: 'ינואר', count: 12 },
    { name: 'פברואר', count: 15 },
    { name: 'מרץ', count: 10 },
    { name: 'אפריל', count: 18 },
    { name: 'מאי', count: 14 },
    { name: 'יוני', count: 20 },
    { name: 'יולי', count: 22 },
    { name: 'אוגוסט', count: 16 },
    { name: 'ספטמבר', count: 19 },
    { name: 'אוקטובר', count: 17 },
    { name: 'נובמבר', count: 21 },
    { name: 'דצמבר', count: 13 },
  ];

  // Top equipment requiring maintenance
  const topMaintenanceEquipment = equipment
    .slice()
    .sort((a, b) => {
      const aCount = workOrders.filter(w => w.equipmentId === a.id).length;
      const bCount = workOrders.filter(w => w.equipmentId === b.id).length;
      return bCount - aCount;
    })
    .slice(0, 5)
    .map(e => ({
      id: e.id,
      name: e.name,
      count: workOrders.filter(w => w.equipmentId === e.id).length,
      location: e.location,
      category: e.category
    }));

  // Time to resolve by priority
  const timeToResolveData = [
    { name: 'דחופה', avgDays: 1.2 },
    { name: 'גבוהה', avgDays: 3.5 },
    { name: 'בינונית', avgDays: 7.2 },
    { name: 'נמוכה', avgDays: 12.8 },
  ];

  // COLORS
  const COLORS = ['#0F4C81', '#F2994A', '#EB5757', '#27AE60', '#6FCF97', '#3C4858'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
        <h1 className="text-2xl font-semibold text-neutral-dark">דוחות וניתוח נתונים</h1>
        <div className="flex space-x-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-48">
              <Calendar className="ml-1" size={16} />
              <SelectValue placeholder="תקופת דיווח" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">החודש הנוכחי</SelectItem>
              <SelectItem value="quarter">רבעון נוכחי</SelectItem>
              <SelectItem value="year">שנה נוכחית</SelectItem>
              <SelectItem value="custom">הגדרה מותאמת</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="ml-1" size={16} />
              הדפסה
            </Button>
            <Button variant="outline">
              <DownloadCloud className="ml-1" size={16} />
              ייצוא
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="equipment">
        <TabsList className="mb-4">
          <TabsTrigger value="equipment">
            <BarChart2 className="ml-1" size={16} />
            דוח ציוד
          </TabsTrigger>
          <TabsTrigger value="workorders">
            <BarChart3 className="ml-1" size={16} />
            דוח הזמנות עבודה
          </TabsTrigger>
          <TabsTrigger value="performance">
            <PieChartIcon className="ml-1" size={16} />
            מדדי ביצוע
          </TabsTrigger>
        </TabsList>

        {/* Equipment Report */}
        <TabsContent value="equipment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ציוד לפי סטטוס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={equipmentByStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {equipmentByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} יחידות`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ציוד לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={equipmentByCategoryData}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip formatter={(value) => [`${value} יחידות`, '']} />
                      <Bar dataKey="value" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>ציוד עם הכי הרבה תחזוקה</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם הציוד</TableHead>
                      <TableHead>קטגוריה</TableHead>
                      <TableHead>מיקום</TableHead>
                      <TableHead className="text-left">סה"כ פעולות תחזוקה</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topMaintenanceEquipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-left">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Work Orders Report */}
        <TabsContent value="workorders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>הזמנות עבודה לפי סטטוס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workOrdersByStatusData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} הזמנות`, '']} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {workOrdersByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>הזמנות עבודה לפי דחיפות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workOrdersByPriorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {workOrdersByPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} הזמנות`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>פעולות תחזוקה לפי חודש</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={maintenanceByMonthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} פעולות`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#0F4C81" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>זמן ממוצע לטיפול לפי דחיפות (ימים)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeToResolveData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} ימים בממוצע`, '']} />
                      <Bar dataKey="avgDays" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ביצועי צוות תחזוקה</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם העובד</TableHead>
                      <TableHead>עבודות שהושלמו</TableHead>
                      <TableHead>עבודות בתהליך</TableHead>
                      <TableHead className="text-left">ציון יעילות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">אבי כהן</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell className="text-left">94%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">יוסי לוי</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-left">91%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">דוד כהן</TableCell>
                      <TableCell>9</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-left">85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">עמית ישראל</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-left">88%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>דו"ח השבתות ציוד</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם הציוד</TableHead>
                      <TableHead>תאריך השבתה</TableHead>
                      <TableHead>תאריך חזרה לפעילות</TableHead>
                      <TableHead>סיבת השבתה</TableHead>
                      <TableHead className="text-left">זמן השבתה (ימים)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">רובוט אריזה</TableCell>
                      <TableCell>05/06/2023</TableCell>
                      <TableCell>12/06/2023</TableCell>
                      <TableCell>תקלה במערכת בקרה</TableCell>
                      <TableCell className="text-left">7</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">מסוע אבקה #3</TableCell>
                      <TableCell>10/05/2023</TableCell>
                      <TableCell>15/05/2023</TableCell>
                      <TableCell>רצועת הנעה שבורה</TableCell>
                      <TableCell className="text-left">5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">משאבת סחרור ראשית</TableCell>
                      <TableCell>20/04/2023</TableCell>
                      <TableCell>22/04/2023</TableCell>
                      <TableCell>נזילה</TableCell>
                      <TableCell className="text-left">2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
