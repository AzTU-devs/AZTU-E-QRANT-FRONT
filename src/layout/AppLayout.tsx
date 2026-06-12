import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <main className="relative">
          <div className="p-3 mx-auto max-w-(--breakpoint-2xl) md:p-4 lg:px-6 lg:py-5 animate-[fadeIn_280ms_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <>
      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
