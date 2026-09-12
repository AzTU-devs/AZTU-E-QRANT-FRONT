import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import apiClient, { API_BASE_URL } from "../../util/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import GradingIcon from "@mui/icons-material/Grading";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CircularProgress from "@mui/material/CircularProgress";

interface CriterionRow {
    key: string;
    number: number;
    max_score: number;
    title: string;
    score: number | null;
    note: string | null;
}

interface Assessment {
    id: number;
    expert: string;
    expert_name: string;
    expert_degree: string | null;
    assessment: number | null;
    max_total: number;
    criteria: CriterionRow[];
    note: string | null;
    updated_at: string | null;
}

/**
 * Every expert's scoring sheet for one project, for the administrator.
 *
 * Each sheet is shown in full — the ten criteria, the score against each, the
 * expert's per-criterion note and their closing remark — because the total on
 * its own says nothing about why it was awarded.
 */
export default function AssessmentsView({ projectCode }: { projectCode: number }) {
    const [items, setItems] = useState<Assessment[]>([]);
    const [average, setAverage] = useState<number | null>(null);
    const [maxTotal, setMaxTotal] = useState(100);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiClient.get(`/api/project/${projectCode}/assessments`);
                const data = res.data?.data ?? {};
                setItems(data.assessments ?? []);
                setAverage(data.average_total ?? null);
                setMaxTotal(data.max_total ?? 100);
            } catch (error) {
                console.error("Failed to fetch assessments:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [projectCode]);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            // fetch rather than a plain link: the endpoint is admin-only, so the
            // bearer token has to travel with the request.
            const response = await fetch(
                `${API_BASE_URL}/api/project/${projectCode}/assessments/pdf`,
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (!response.ok) throw new Error(String(response.status));

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `assessments_${projectCode}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download the assessments PDF:", error);
            Swal.fire("Xəta baş verdi!", "PDF yüklənə bilmədi.", "error");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return <div className="flex h-[160px] items-center justify-center"><CircularProgress /></div>;
    }

    return (
        <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white">
                        <GradingIcon className="size-5" />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">
                            Ekspert qiymətləndirmələri
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {items.length
                                ? `${items.length} ekspert${average != null ? ` · Orta bal: ${average}/${maxTotal}` : ""}`
                                : "Hələ qiymətləndirmə yoxdur"}
                        </p>
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    disabled={downloading}
                    startIcon={<PictureAsPdfIcon style={{ width: 18, height: 18 }} />}
                >
                    {downloading ? "Yüklənir..." : "PDF ixrac et"}
                </Button>
            </div>

            {items.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                    Bu layihəni hələ heç bir ekspert qiymətləndirməyib.
                </p>
            ) : (
                <div className="flex flex-col gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-gray-100 p-4 dark:border-white/[0.06]">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-white/90">
                                        {item.expert_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.expert}
                                        {item.expert_degree ? ` · ${item.expert_degree}` : ""}
                                    </p>
                                </div>
                                <Badge color={item.assessment != null ? "success" : "light"} size="md">
                                    {item.assessment ?? 0}/{item.max_total ?? maxTotal}
                                </Badge>
                            </div>

                            <div className="max-w-full overflow-x-auto rounded-lg border border-gray-100 dark:border-white/[0.06]">
                                <table className="w-full min-w-[680px] border-collapse text-sm">
                                    <thead className="bg-gray-50 dark:bg-white/[0.04]">
                                        <tr>
                                            <th className="w-10 px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">№</th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Meyar</th>
                                            <th className="w-20 px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Maks.</th>
                                            <th className="w-20 px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Bal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                                        {item.criteria.map((row) => (
                                            <tr key={row.key} className="align-top">
                                                <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{row.number}</td>
                                                <td className="px-3 py-2">
                                                    <p className="text-gray-800 dark:text-gray-200">{row.title}</p>
                                                    {row.note ? (
                                                        <p className="mt-1 whitespace-pre-line rounded-lg bg-gray-50 p-2 text-xs text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
                                                            {row.note}
                                                        </p>
                                                    ) : null}
                                                </td>
                                                <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">{row.max_score}</td>
                                                <td className="px-3 py-2 text-center font-semibold text-gray-800 dark:text-white/90">
                                                    {row.score ?? "—"}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-bold dark:bg-white/[0.04]">
                                            <td className="px-3 py-2" />
                                            <td className="px-3 py-2 text-gray-800 dark:text-white/90">YEKUN BAL</td>
                                            <td className="px-3 py-2 text-center text-gray-800 dark:text-white/90">
                                                {item.max_total ?? maxTotal}
                                            </td>
                                            <td className="px-3 py-2 text-center text-brand-600 dark:text-brand-300">
                                                {item.assessment ?? 0}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {item.note ? (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ümumi rəy</p>
                                    <p className="mt-1 whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                                        {item.note}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
