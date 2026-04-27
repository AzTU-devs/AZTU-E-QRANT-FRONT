import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import QuarterlyReportForm from "../../components/QuarterlyReport/QuarterlyReportForm";

const currentYear = new Date().getFullYear();
const QUARTERS = [1, 2, 3, 4];
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function QuarterlyReportPage() {
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);

    const [quarter, setQuarter] = useState<number>(
        Math.ceil((new Date().getMonth() + 1) / 3)
    );
    const [year, setYear] = useState<number>(currentYear);

    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="Rüblük Elmi-Texniki Hesabat"
            />
            <PageBreadcrumb pageTitle="Rüblük Elmi-Texniki Hesabat" />

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                            Rüb:
                        </label>
                        <select
                            value={quarter}
                            onChange={(e) => setQuarter(Number(e.target.value))}
                            className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
                        >
                            {QUARTERS.map((q) => (
                                <option key={q} value={q}>
                                    {q}-ci rüb
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                            İl:
                        </label>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {projectCode ? (
                    <QuarterlyReportForm
                        projectCode={projectCode}
                        quarter={quarter}
                        year={year}
                    />
                ) : (
                    <div className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        Layihə kodu tapılmadı. Zəhmət olmasa əvvəlcə layihənizi seçin.
                    </div>
                )}
            </div>
        </div>
    );
}
