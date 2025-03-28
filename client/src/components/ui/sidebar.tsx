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

const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="flex flex-col bg-primary text-white transition-all duration-300 lg:w-64 w-16 flex-shrink-0 shadow-lg">
      {/* Logo Area */}
      <div className="p-4 flex items-center justify-center lg:justify-start">
        <div className="text-4xl lg:text-3xl">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 8.27V4.31C22 2.5 21.5 2 19.69 2H15.73C13.92 2 13.42 2.5 13.42 4.31V8.27C13.42 10.08 13.92 10.58 15.73 10.58H19.69C21.5 10.58 22 10.08 22 8.27Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.58 8.52V3.94C10.58 2.64 10.08 2.14 8.78 2.14H4.21C2.91 2.14 2.41 2.64 2.41 3.94V8.52C2.41 9.82 2.91 10.32 4.21 10.32H8.78C10.08 10.32 10.58 9.82 10.58 8.52Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.58 19.78V15.21C10.58 13.91 10.08 13.41 8.78 13.41H4.21C2.91 13.41 2.41 13.91 2.41 15.21V19.78C2.41 21.08 2.91 21.58 4.21 21.58H8.78C10.08 21.58 10.58 21.08 10.58 19.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 19.78V15.21C22 13.91 21.5 13.41 20.2 13.41H15.63C14.33 13.41 13.83 13.91 13.83 15.21V19.78C13.83 21.08 14.33 21.58 15.63 21.58H20.2C21.5 21.58 22 21.08 22 19.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold mr-3 hidden lg:block">אחזקת אשלג</h1>
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
