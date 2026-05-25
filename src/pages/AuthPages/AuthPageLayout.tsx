import React from "react";
import GridShape from "../../components/common/GridShape";
import AztuLogoLight from "../../../public/aztu-logo-light.png";
import GrantLogoLight from "../../../public/e-grant-logo-light.png";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 aurora-bg overflow-hidden lg:grid">
          {/* glow blobs */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-500/40 blur-3xl animate-[auroraShift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-[460px] w-[460px] rounded-full bg-purple-500/30 blur-3xl animate-[auroraShift_18s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-400/20 blur-3xl animate-[auroraShift_22s_ease-in-out_infinite]" />
          {/* grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
          <div className="relative flex items-center justify-center z-1 px-8">
            <GridShape />
            <div className="flex flex-col items-center max-w-md">
              <div className="flex justify-center items-center gap-5 mb-8 p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl">
                <img src={AztuLogoLight} alt="AzTU" className="h-[80px]" />
                <div className="h-16 w-px bg-white/20" />
                <img src={GrantLogoLight} alt="E-Grant" className="h-[100px]" />
              </div>
              <h1 className="text-4xl xl:text-[42px] font-bold text-center text-white leading-tight tracking-tight">
                AzTU Daxili <span className="bg-gradient-to-r from-brand-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Qrant Müsabiqəsi</span>
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
