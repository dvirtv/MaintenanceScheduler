import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Wrench,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils/dates';
import { getStatusBadgeClass, getPriorityBadgeClass } from '@/lib/utils/priorities';

interface WorkOrderCardProps {
  workOrder: {
    id: number;
    title: string;
    description: string;
    equipmentId: number;
    equipmentName?: string;
    equipmentLocation?: string;
    priority: string;
    status: string;
    assignedTo?: number;
    assignedToName?: string;
    createdAt: string;
    scheduledFor?: string;
    completedAt?: string;
    notes?: string;
  };
  compact?: boolean;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ 
  workOrder,
  compact = false 
}) => {
  const isCompleted = workOrder.status === "הושלמה" || workOrder.status === "בוטלה";
  const today = new Date();
  const scheduledDate = workOrder.scheduledFor ? new Date(workOrder.scheduledFor) : null;
  const isOverdue = scheduledDate && !isCompleted && scheduledDate < today;

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${isOverdue ? 'border-danger' : ''}`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>{workOrder.title}</h3>
            {workOrder.equipmentName && (
              <div className="flex items-center text-sm text-neutral-dark mt-1">
                <Wrench className="ml-1" size={14} />
                <span>{workOrder.equipmentName}</span>
              </div>
            )}
            {workOrder.equipmentLocation && !compact && (
              <div className="flex items-center text-xs text-neutral-dark mt-1">
                <MapPin className="ml-1" size={14} />
                <span>{workOrder.equipmentLocation}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <Badge className={getStatusBadgeClass(workOrder.status)}>
              {workOrder.status}
            </Badge>
            
            <Badge variant="outline" className={`mt-1 ${getPriorityBadgeClass(workOrder.priority)}`}>
              {workOrder.priority}
            </Badge>
          </div>
        </div>
        
        {!compact && (
          <p className="text-sm mt-2 line-clamp-2">{workOrder.description}</p>
        )}
        
        <div className={`flex ${compact ? 'justify-between mt-2' : 'justify-between mt-3'} text-xs text-neutral-dark`}>
          <div className="flex items-center">
            <Clock size={14} className="ml-1" />
            <span>נפתח: {formatDate(workOrder.createdAt)}</span>
          </div>
          
          {workOrder.scheduledFor && (
            <div className={`flex items-center ${isOverdue ? 'text-danger font-medium' : ''}`}>
              {isOverdue && <AlertCircle size={14} className="ml-1" />}
              {!isOverdue && <Calendar size={14} className="ml-1" />}
              <span>מתוזמן: {formatDate(workOrder.scheduledFor)}</span>
            </div>
          )}
        </div>
        
        {!compact && (
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs">
              {workOrder.assignedToName ? (
                <div className="flex items-center">
                  <User size={14} className="ml-1" />
                  <span>הוקצה ל: {workOrder.assignedToName}</span>
                </div>
              ) : (
                <span className="text-neutral-dark">לא הוקצה</span>
              )}
            </div>
            
            <Link href={`/work-orders/${workOrder.id}`}>
              <Button variant="link" className="p-0 h-auto text-xs">פרטים נוספים</Button>
            </Link>
          </div>
        )}
        
        {compact && (
          <div className="flex justify-end mt-1">
            <Link href={`/work-orders/${workOrder.id}`}>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                פרטים
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;
