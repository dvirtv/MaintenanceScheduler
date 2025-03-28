import React from "react";
import { EQUIPMENT_CATEGORIES, EQUIPMENT_STATUSES } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface EquipmentFiltersProps {
  filters: {
    status: string;
    category: string;
    location: string;
    search: string;
  };
  onFilterChange: (filters: Partial<EquipmentFiltersProps["filters"]>) => void;
  onSearch: (search: string) => void;
}

const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch
}) => {
  // Get unique locations from the equipment data (would be from the API in a full implementation)
  const locations = [
    "אולם ייצור",
    "מחלקת אריזה",
    "קו אריזה אוטומטי",
    "אולם מיכלים",
    "יחידת עיבוד חום",
    "חדר גנרטורים"
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">סטטוס</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onFilterChange({ status: value })}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">כל הסטטוסים</SelectItem>
                {EQUIPMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category-filter">קטגוריה</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => onFilterChange({ category: value })}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">כל הקטגוריות</SelectItem>
                {EQUIPMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location-filter">מיקום</Label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => onFilterChange({ location: value })}
            >
              <SelectTrigger id="location-filter">
                <SelectValue placeholder="כל המיקומים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">כל המיקומים</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search-filter">חיפוש</Label>
            <div className="relative">
              <Input
                id="search-filter"
                type="text"
                placeholder="חיפוש לפי שם, מזהה, מיקום..."
                value={filters.search}
                onChange={(e) => onSearch(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentFilters;
