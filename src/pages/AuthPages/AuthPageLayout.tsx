import React from "react";
import GridShape from "../../components/common/GridShape";
import AztuLogoLight from "../../../public/aztu-logo-light.png";
import AztuLogoDark from "../../../public/aztu-logo-dark.png";
import GrantLogoLight from "../../../public/e-grant-logo-light.png";
import GrantLogoDark from "../../../public/e-grant-logo-dark.png";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-4 z-1 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
        {/* mobile logos (aurora panel is hidden below lg): dark logos on the
            light form background, light logos in dark mode */}
        <div className="flex items-center justify-center gap-4 pt-6 lg:hidden">
          <img src={AztuLogoDark} alt="AzTU" className="block h-12 w-auto dark:hidden" />
          <img src={AztuLogoLight} alt="AzTU" className="hidden h-12 w-auto dark:block" />
          <span className="h-8 w-px bg-gray-300 dark:bg-white/20" />
          <img src={GrantLogoDark} alt="E-Grant" className="block h-14 w-auto dark:hidden" />
          <img src={GrantLogoLight} alt="E-Grant" className="hidden h-14 w-auto dark:block" />
        </div>
        {children}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 aurora-bg overflow-hidden lg:grid">
          {/* glow blobs */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-500/40 blur-3xl animate-[auroraShift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-[460px] w-[460px] rounded-full bg-purple-500/30 blur-3xl animate-[auroraShift_18s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-brand-400/20 blur-3xl animate-[auroraShift_22s_ease-in-out_infinite]" />
          {/* grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
          <div className="relative flex items-center justify-center z-1 px-5">
            <GridShape />
            <div className="flex flex-col items-center max-w-md">
              <div className="flex justify-center items-center gap-5 mb-5 p-4 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
                <img src={AztuLogoLight} alt="AzTU" className="h-[80px]" />
                <div className="h-16 w-px bg-white/20" />
                <img src={GrantLogoLight} alt="E-Grant" className="h-[100px]" />
              </div>
              <h1 className="text-4xl xl:text-[42px] font-bold text-center text-white leading-tight tracking-tight">
                AzTU Daxili <span className="bg-gradient-to-r from-brand-300 via-purple-300 to-brand-300 bg-clip-text text-transparent">Qrant Müsabiqəsi</span>
              </h1>
              <p className="mt-4 text-center text-white/70 text-base max-w-sm leading-relaxed">
                Tədqiqat layihələrinizi təqdim edin, fəaliyyətinizi izləyin və müsabiqədə iştirak edin.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
