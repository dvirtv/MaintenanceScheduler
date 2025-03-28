import React from "react";
import { Link } from "wouter";
import { 
  QrCode, 
  MapPin, 
  Tag, 
  Calendar, 
  History, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Equipment } from "@shared/schema";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EquipmentCardProps {
  equipment: Equipment;
  onDelete?: (id: number) => void;
}

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

const getMaintenanceDateColor = (dateStr: string | null) => {
  if (!dateStr) return "text-neutral-dark";
  
  const today = new Date();
  const maintenanceDate = new Date(dateStr);
  const diffTime = maintenanceDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "text-danger";
  if (diffDays <= 7) return "text-warning";
  if (diffDays <= 30) return "text-primary";
  return "text-success";
};

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-neutral-medium border-opacity-50">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-neutral-dark">{equipment.name}</h3>
          <Badge className={getStatusColor(equipment.status)}>
            {equipment.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-neutral-dark">
            <QrCode className="ml-2 text-neutral-dark" size={16} />
            <span className="font-mono">{equipment.equipmentId}</span>
          </div>
          
          <div className="flex items-center text-neutral-dark">
            <MapPin className="ml-2 text-neutral-dark" size={16} />
            <span>{equipment.location}</span>
          </div>
          
          <div className="flex items-center text-neutral-dark">
            <Tag className="ml-2 text-neutral-dark" size={16} />
            <span>{equipment.category}</span>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-sm">
              <Calendar 
                className={`ml-1 ${getMaintenanceDateColor(equipment.nextMaintenanceDate)}`} 
                size={16} 
              />
              <span>תחזוקה הבאה: {equipment.nextMaintenanceDate ? formatDate(equipment.nextMaintenanceDate) : "לא נקבע"}</span>
            </div>
            
            {equipment.lastMaintenanceDate && (
              <div>
                <Badge variant="outline" className="bg-neutral-light text-neutral-dark text-xs">
                  הושלמה: {formatDate(equipment.lastMaintenanceDate)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-medium border-opacity-50 p-3 flex justify-between items-center bg-neutral-light bg-opacity-50">
        <div className="text-sm text-neutral-dark">
          <span>עבודות פתוחות: {equipment.openWorkOrders || 0}</span>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/equipment/${equipment.id}/history`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="צפייה בהיסטוריה">
              <History className="text-neutral-dark" size={16} />
            </Button>
          </Link>
          
          <Link href={`/equipment/${equipment.id}/schedule`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="תזמון תחזוקה">
              <Calendar className="text-neutral-dark" size={16} />
            </Button>
          </Link>
          
          <Link href={`/equipment/${equipment.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="עריכה">
              <Edit className="text-neutral-dark" size={16} />
            </Button>
          </Link>
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              title="מחיקה"
              onClick={(e) => {
                e.preventDefault();
                onDelete(equipment.id);
              }}
            >
              <Trash2 className="text-danger" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
