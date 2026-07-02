import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="relative min-h-screen xl:flex bg-gradient-to-br from-brand-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      {/* soft colorful ambient glows for a modern, light look */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-500/10" />
      </div>
      <div className="relative z-10">
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`relative z-10 flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
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
