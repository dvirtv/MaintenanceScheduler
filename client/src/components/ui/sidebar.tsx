import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  ClipboardList, 
  Users, 
  BarChart3,
  ChevronDown
} from "lucide-react";
import logoPath from "@/assets/logo.svg";

const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="flex flex-col bg-primary text-white transition-all duration-300 lg:w-64 w-16 flex-shrink-0 shadow-lg">
      {/* Logo Area */}
      <div className="p-4 flex items-center justify-center lg:justify-start">
        <Link href="/" className="flex items-center">
          <img 
            src={logoPath} 
            alt="מערכת אחזקה - מפעלי ים המלח" 
            className="w-10 h-10 lg:w-12 lg:h-12 object-contain hidden lg:block" 
          />
          <img 
            src={logoPath} 
            alt="מערכת אחזקה - מפעלי ים המלח" 
            className="w-8 h-8 object-contain lg:hidden" 
          />
          <div className="mr-2 hidden lg:block">
            <h1 className="text-lg font-bold leading-tight">מערכת אחזקה</h1>
            <p className="text-xs text-gray-100">מפעלי ים המלח</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <ul>
          {/* Dashboard */}
          <li className="sidebar-item relative">
            <Link 
              href="/" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center text-white ${isActive("/") ? "bg-primary-light" : ""}`}
            >
              <LayoutDashboard className="lg:ml-3" size={22} />
              <span className="hidden lg:block">לוח בקרה</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              לוח בקרה
            </div>
          </li>
          
          {/* Equipment */}
          <li className="sidebar-item relative">
            <Link 
              href="/equipment" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center ${isActive("/equipment") ? "bg-primary-light" : ""}`}
            >
              <Wrench className="lg:ml-3" size={22} />
              <span className="hidden lg:block">ציוד ונכסים</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              ציוד ונכסים
            </div>
          </li>
          
          {/* Maintenance Schedule */}
          <li className="sidebar-item relative">
            <Link 
              href="/schedule" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center ${isActive("/schedule") ? "bg-primary-light" : ""}`}
            >
              <Calendar className="lg:ml-3" size={22} />
              <span className="hidden lg:block">לוח זמנים</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              לוח זמנים
            </div>
          </li>
          
          {/* Work Orders */}
          <li className="sidebar-item relative">
            <Link 
              href="/work-orders" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center ${isActive("/work-orders") ? "bg-primary-light" : ""}`}
            >
              <ClipboardList className="lg:ml-3" size={22} />
              <span className="hidden lg:block">הזמנות עבודה</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              הזמנות עבודה
            </div>
          </li>
          
          {/* Staff */}
          <li className="sidebar-item relative">
            <Link 
              href="/staff" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center ${isActive("/staff") ? "bg-primary-light" : ""}`}
            >
              <Users className="lg:ml-3" size={22} />
              <span className="hidden lg:block">צוות תחזוקה</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              צוות תחזוקה
            </div>
          </li>
          
          {/* Reports */}
          <li className="sidebar-item relative">
            <Link 
              href="/reports" 
              className={`flex items-center px-4 py-3 hover:bg-primary-light transition-colors duration-200 lg:text-base text-sm lg:justify-start justify-center ${isActive("/reports") ? "bg-primary-light" : ""}`}
            >
              <BarChart3 className="lg:ml-3" size={22} />
              <span className="hidden lg:block">דוחות</span>
            </Link>
            <div className="sidebar-tooltip hidden absolute right-16 top-0 bg-neutral-dark text-white py-1 px-2 rounded text-sm whitespace-nowrap">
              דוחות
            </div>
          </li>
        </ul>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-primary-light flex items-center lg:justify-start justify-center">
        <div className="w-8 h-8 rounded-full bg-neutral-medium flex items-center justify-center text-primary font-bold">
          א
        </div>
        <div className="mr-3 hidden lg:block">
          <p className="text-sm font-medium">אבי כהן</p>
          <p className="text-xs text-gray-300">מנהל אחזקה</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
