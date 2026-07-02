import { Link } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PageMeta from "../../components/common/PageMeta";
import { Announcement, getAnnouncements } from "../../services/announcement/announcement";
import AztuLogoDark from "../../../public/aztu-logo.webp";
import AztuLogoLight from "../../../public/aztu-logo-light.png";
import GrantLogoDark from "../../../public/e-grant-logo-dark.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GrantLogoLight from "../../../public/e-grant-logo-light.png";

function ActionCard({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link to={to} className="group block flex-1">
      <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-4 shadow-theme-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-theme-md dark:border-white/[0.06] dark:bg-white/[0.03]">
        <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-[0_6px_16px_-6px_rgba(24,47,121,0.6)] transition-transform duration-200 group-hover:scale-105">
          {icon}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight text-gray-800 dark:text-white/90">
            {label}
          </span>
          <ArrowForwardIcon className="size-5 -translate-x-1 text-gray-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-brand-500 group-hover:opacity-100 dark:text-gray-600" />
        </div>
      </div>
    </Link>
  );
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
}

export default function Home() {
  const role = useSelector((state: RootState) => state.auth.projectRole);
  const finKod = useSelector((state: RootState) => state.auth.fin_kod);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getAnnouncements()
      .then(setAnnouncements)
      .catch((err) => console.error("Failed to fetch announcements", err));
  }, []);

  return (
    <>
      <PageMeta
        title="AzTU Daxili Qrant Müsabiqəsi"
        description="Azərbaycan Texniki Universitetinin daxili elmi-tədqiqat və innovasiya qrant müsabiqəsi platforması."
      />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 px-5 py-8 text-center shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03] sm:px-8 sm:py-10">
        {/* decorative brand glows */}
        <span className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20" />
        <span className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20" />

        <div className="relative flex items-center justify-center gap-6">
          <img src={AztuLogoLight} alt="AzTU" className="hidden h-14 w-auto dark:block md:h-20" />
          <img src={AztuLogoDark} alt="AzTU" className="block h-14 w-auto dark:hidden md:h-20" />
          <img src={GrantLogoLight} alt="e-Grant" className="hidden h-16 w-auto dark:block md:h-24" />
          <img src={GrantLogoDark} alt="e-Grant" className="block h-16 w-auto dark:hidden md:h-24" />
        </div>

        <h1 className="relative mt-6 text-2xl font-bold tracking-tight text-[rgb(20,30,79)] dark:text-white sm:text-3xl md:text-4xl">
          AzTU Daxili Qrant Müsabiqəsi
        </h1>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Elmi-tədqiqat və innovasiya layihələrinin maliyyə dəstəyi ilə həyata keçirilməsi üçün
          Azərbaycan Texniki Universiteti tərəfindən elan olunan qrant müsabiqəsi. Məqsəd —
          şəffaflıq, rəqabət və elmi keyfiyyət prinsipləri əsasında elmi tədqiqatların və
          innovativ ideyaların maliyyələşdirilməsi və dəstəklənməsidir.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        <ActionCard to="/projects" icon={<WorkIcon className="size-6" />} label="Layihələr" />
        <ActionCard to={`/user-details/${finKod}`} icon={<AccountCircleIcon className="size-6" />} label="Şəxsi məlumatlar" />
        {role === 0 ? (
          <ActionCard to="/project-offer" icon={<SchoolIcon className="size-6" />} label="Layihə detalları" />
        ) : null}
        {role === 1 ? (
          <ActionCard to="/collaborator-project" icon={<WorkIcon className="size-6" />} label="İcraçı olduğum layihə" />
        ) : null}
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white">
              <CampaignOutlinedIcon className="size-5" />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">
              Elanlar
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
              >
                <span className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500" />
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white/90">
                    {announcement.title}
                  </h3>
                  {announcement.created_at && (
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(announcement.created_at)}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
