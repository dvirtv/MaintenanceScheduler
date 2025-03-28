import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { User, Phone, Wrench, FileText, Edit } from 'lucide-react';

interface StaffCardProps {
  staff: {
    id: number;
    name: string;
    position: string;
    specialization?: string;
    contactInfo?: string;
    isActive: boolean;
  };
  workOrdersCount: number;
  onEdit?: () => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, workOrdersCount, onEdit }) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    return names[0].charAt(0) + names[names.length - 1].charAt(0);
  };

  // Get avatar background color based on specialization
  const getAvatarColor = (specialization?: string) => {
    if (!specialization) return "bg-primary";
    
    switch (specialization) {
      case "מערכות חשמל":
        return "bg-blue-500";
      case "מערכות הידראוליות":
        return "bg-cyan-600";
      case "מערכות מכניות":
        return "bg-green-600";
      case "אוטומציה ובקרה":
        return "bg-purple-600";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${!staff.isActive ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(staff.specialization)}`}>
            {getInitials(staff.name)}
          </div>
          
          <div className="flex-1 mr-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-base">{staff.name}</h3>
                <p className="text-sm text-neutral-dark">{staff.position}</p>
              </div>
              
              {staff.isActive ? (
                <Badge className="bg-success text-white">פעיל</Badge>
              ) : (
                <Badge variant="outline" className="border-neutral-dark text-neutral-dark">לא פעיל</Badge>
              )}
            </div>
            
            {staff.specialization && (
              <div className="flex items-center text-xs mt-2">
                <Wrench className="ml-1" size={14} />
                <span>{staff.specialization}</span>
              </div>
            )}
            
            {staff.contactInfo && (
              <div className="flex items-center text-xs mt-1 text-neutral-dark">
                <Phone className="ml-1" size={14} />
                <span dir="ltr">{staff.contactInfo}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            {staff.isActive ? (
              <div className="flex items-center">
                <FileText className="ml-1" size={16} />
                <span>עבודות פעילות: <span className="font-medium">{workOrdersCount}</span></span>
              </div>
            ) : (
              <span className="text-neutral-dark">לא פעיל במערכת</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {staff.isActive && (
              <Link href={`/staff/${staff.id}/work-orders`}>
                <Button variant="outline" size="sm" className="h-8">
                  <FileText size={16} className="ml-1" />
                  עבודות
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={onEdit}
            >
              <Edit size={16} className="ml-1" />
              עריכה
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
