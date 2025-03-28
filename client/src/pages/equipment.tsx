import { useState } from "react";
import { 
  Plus, 
  FilterX, 
  Filter, 
  ChevronRight, 
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEquipment } from "@/hooks/use-equipment";
import EquipmentCard from "@/components/equipment/equipment-card";
import EquipmentFilters from "@/components/equipment/equipment-filters";
import EquipmentForm from "@/components/dialogs/equipment-form";
import { Equipment } from "@shared/schema";

const EquipmentPage = () => {
  const { equipment, isLoading, error } = useEquipment();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    location: "",
    search: ""
  });

  // Apply filters to equipment list
  const filteredEquipment = equipment.filter((item) => {
    // Filter by status if selected
    if (filters.status && item.status !== filters.status) {
      return false;
    }

    // Filter by category if selected
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    // Filter by location if selected
    if (filters.location && !item.location.includes(filters.location)) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.equipmentId.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm))
      );
    }

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipment = filteredEquipment.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      category: "",
      location: "",
      search: ""
    });
    setCurrentPage(1);
  };

  const handleAddEquipment = (newEquipment: Equipment) => {
    setShowAddDialog(false);
    // The equipment list will be refreshed by the react-query cache invalidation
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
        <div className="text-center p-8 max-w-md">
          <div className="text-danger text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">שגיאה בטעינת נתונים</h3>
          <p className="text-neutral-dark">לא ניתן לטעון את רשימת הציוד. אנא נסה שוב מאוחר יותר.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-primary text-white shadow-sm flex items-center"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="ml-1" size={18} />
            הוספת ציוד חדש
          </Button>
          
          <Button 
            variant="outline"
            className="bg-neutral-medium text-neutral-dark shadow-sm flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FilterX className="ml-1" size={18} /> : <Filter className="ml-1" size={18} />}
            {showFilters ? "הסתר סינון" : "סינון"}
          </Button>
          
          {Object.values(filters).some(v => v !== "") && (
            <Button 
              variant="ghost"
              className="text-neutral-dark"
              onClick={handleClearFilters}
            >
              נקה סינון
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-neutral-dark">
          הצגת 
          <select 
            className="bg-neutral-light border border-neutral-medium rounded px-2 py-1 mx-1"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
          מתוך {filteredEquipment.length} פריטים
        </div>
      </div>
      
      {/* Filters Section (collapsible) */}
      {showFilters && (
        <EquipmentFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearchChange}
        />
      )}
      
      {/* Equipment Grid */}
      {paginatedEquipment.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">לא נמצא ציוד</h3>
          <p className="text-neutral-dark mb-4">לא נמצאו פריטים התואמים את הסינון שהוגדר</p>
          <Button onClick={handleClearFilters}>הצג את כל הציוד</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {paginatedEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-1">
            <Button 
              variant={currentPage === 1 ? "outline" : "secondary"}
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="ml-1" size={16} />
              הקודם
            </Button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Display current page, first page, last page, and one page before and after current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={pageNumber === currentPage ? "bg-primary text-white" : "text-neutral-dark"}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                // Display ellipsis
                return <span key={pageNumber} className="px-3 py-2 text-neutral-dark">...</span>;
              }
              return null;
            })}
            
            <Button 
              variant={currentPage === totalPages ? "outline" : "secondary"} 
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              הבא
              <ChevronLeft className="mr-1" size={16} />
            </Button>
          </nav>
        </div>
      )}
      
      {/* Add Equipment Dialog */}
      <EquipmentForm 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSave={handleAddEquipment}
      />
    </div>
  );
};

export default EquipmentPage;
