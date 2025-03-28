import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-neutral-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
