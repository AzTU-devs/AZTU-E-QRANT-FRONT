import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import apiClient from "../../util/apiClient";
import NotFound from "../../../public/404-error.png";

interface ReportFile {
    id: number;
    original_filename: string;
    content_type: string | null;
    file_size: number | null;
    uploaded_at: string | null;
}

interface QuarterlyReport {
    id: number;
    project_code: number;
    quarter_number: number;
    year: number;
    submission_date: string | null;
    files: ReportFile[];
    [key: `point_${number}`]: string | null | number | ReportFile[] | undefined;
}

const POINT_LABELS: Record<string, string> = {
    point_1: "1. Cari rübdə görülmüş elmi işlər",
    point_2: "2. Planlaşdırılmış işlərin yerinə yetirilmə dərəcəsi (%)",
    point_3: "3. Əldə edilmiş elmi nəticələr, yenilik",
    point_4: "4. Tətbiq olunan metod və yanaşmalar",
    point_5: "5. Elmi nəşrlər",
    point_6: "6. İxtiralar və patentlər",
    point_7: "7. Ezamiyyətlər",
    point_8: "8. Elmi ekspedisiyalar",
    point_9: "9. Digər tədbirlər",
    point_10: "10. Elmi məruzələr",
    point_11: "11. Əldə edilmiş cihaz, avadanlıq, qurğu və mal-materiallar",
    point_12: "12. Yerli həmkarlarla əlaqələr",
    point_13: "13. Xarici həmkarlarla əlaqələr",
    point_14: "14. Kadr hazırlığı",
    point_15: "15. Sərgilərdə iştirak",
    point_16: "16. Stajirovka və təcrübə mübadiləsi",
    point_17: "17. Elmi-kütləvi nəşrlər, mediada çıxışlar və s.",
};

const POINT_KEYS = Object.keys(POINT_LABELS);

const formatSize = (bytes: number | null) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ProjectReportsView({ projectCode }: { projectCode: number }) {
    const [reports, setReports] = useState<QuarterlyReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(`/api/reports/project/${projectCode}`);
                setReports(res.data.reports ?? []);
            } catch (error) {
                console.error("Hesabatlar yüklənərkən xəta:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [projectCode]);

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            const res = await apiClient.get(`/api/reports-pdf/${projectCode}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `project_${projectCode}_reports.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire("Xəta baş verdi!", "Hesabat PDF-i yüklənə bilmədi", "error");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadFile = async (file: ReportFile) => {
        try {
            const res = await apiClient.get(`/api/reports/files/download/${file.id}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.original_filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire("Xəta baş verdi!", "Fayl endirilə bilmədi", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex flex-col justify-center items-center gap-3">
                <img src={NotFound} alt="Not Found" className="w-[100px] h-[100px]" />
                <p>Bu layihə üzrə hələ heç bir hesabat təqdim edilməyib.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className={`px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded ${downloading ? "opacity-50" : ""}`}
                >
                    {downloading ? "Yüklənir..." : "Hesabatları PDF yükləyin"}
                </button>
            </div>

            {reports.map((report) => (
                <div
                    key={report.id}
                    className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40"
                >
                    <div className="border-b border-gray-100 dark:border-white/[0.05] px-5 py-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            {report.year} - {report.quarter_number}-ci rüb
                        </h3>
                        {report.submission_date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Təqdim tarixi: {new Date(report.submission_date).toLocaleString("az-AZ")}
                            </p>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {POINT_KEYS.map((key) => (
                            <div key={key} className="px-5 py-3">
                                <p className="text-theme-sm font-medium text-brand-600 dark:text-brand-400 mb-1">
                                    {POINT_LABELS[key]}
                                </p>
                                <p className="text-theme-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {(report[key as `point_${number}`] as string) || "—"}
                                </p>
                            </div>
                        ))}
                    </div>

                    {report.files && report.files.length > 0 && (
                        <div className="border-t border-gray-100 dark:border-white/[0.05] px-5 py-4">
                            <h4 className="text-theme-sm font-semibold text-gray-800 dark:text-white/90 mb-2">
                                Əlavə sənədlər
                            </h4>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                                {report.files.map((file) => (
                                    <li
                                        key={file.id}
                                        className="flex items-center justify-between gap-3 px-4 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {file.original_filename}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatSize(file.file_size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDownloadFile(file)}
                                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                                        >
                                            Endir
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
