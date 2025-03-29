import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Search, Bell } from "lucide-react";
import logoPath from "@/assets/logo.svg";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [location] = useLocation();
  const [searchInput, setSearchInput] = useState("");

  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "לוח בקרה";
      case "/equipment":
        return "ציוד ונכסים";
      case "/schedule":
        return "לוח זמנים";
      case "/work-orders":
        return "הזמנות עבודה";
      case "/staff":
        return "צוות תחזוקה";
      case "/reports":
        return "דוחות";
      default:
        if (location.startsWith("/equipment/")) {
          return "פרטי ציוד";
        }
        return title || "מערכת ניהול אחזקה";
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="hidden md:flex items-center ml-4">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="מערכת אחזקה - מפעלי ים המלח" 
                className="h-8 w-8 object-contain" 
              />
            </Link>
          </div>
          <h2 className="text-xl font-semibold text-neutral-dark">{getPageTitle()}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative ml-4">
            <input 
              type="text" 
              placeholder="חיפוש..." 
              className="bg-neutral-light px-4 py-2 rounded-lg border border-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-48 lg:w-64 text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-neutral-dark text-opacity-70" size={18} />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-1 rounded-full hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-primary">
              <Bell className="text-neutral-dark" size={22} />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-danger text-white text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
