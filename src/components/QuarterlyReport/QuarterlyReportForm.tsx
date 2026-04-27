import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import apiClient from "../../util/apiClient";

interface Props {
    projectCode: string | number;
    quarter: number;
    year: number;
}

const POINT_LABELS: Record<string, string> = {
    point_1:  "1. Cari rübdə görülmüş elmi işlər",
    point_2:  "2. Planlaşdırılmış işlərin yerinə yetirilmə dərəcəsi (%)",
    point_3:  "3. Əldə edilmiş elmi nəticələr, yenilik",
    point_4:  "4. Tətbiq olunan metod və yanaşmalar",
    point_5:  "5. Elmi nəşrlər",
    point_6:  "6. İxtiralar və patentlər",
    point_7:  "7. Ezamiyyətlər",
    point_8:  "8. Elmi ekspedisiyalar",
    point_9:  "9. Digər tədbirlər",
    point_10: "10. Elmi məruzələr",
    point_11: "11. Əldə edilmiş cihaz, avadanlıq, qurğu və mal-materiallar",
    point_12: "12. Yerli həmkarlarla əlaqələr",
    point_13: "13. Xarici həmkarlarla əlaqələr",
    point_14: "14. Kadr hazırlığı",
    point_15: "15. Sərgilərdə iştirak",
    point_16: "16. Stajirovka və təcrübə mübadiləsi",
    point_17: "17. Elmi-kütləvi nəşrlər, mediada çıxışlar və s.",
};

type PointKey = `point_${number}`;

const POINT_KEYS = Object.keys(POINT_LABELS) as PointKey[];

const emptyState = () =>
    POINT_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {} as Record<PointKey, string>);

const QuarterlyReportForm: React.FC<Props> = ({ projectCode, quarter, year }) => {
    const [fields, setFields] = useState<Record<PointKey, string>>(emptyState());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!projectCode || !quarter || !year) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(
                    `/api/reports/${projectCode}/${quarter}/${year}`
                );
                const report = res.data.report;
                if (report) {
                    const loaded = POINT_KEYS.reduce((acc, key) => ({
                        ...acc,
                        [key]: report[key] ?? "",
                    }), {} as Record<PointKey, string>);
                    setFields(loaded);
                }
            } catch (err: any) {
                if (err?.response?.status !== 404) {
                    console.error("Hesabat yüklənərkən xəta:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [projectCode, quarter, year]);

    const handleChange = (key: PointKey, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiClient.post("/api/reports/save", {
                project_code: projectCode,
                quarter_number: quarter,
                year,
                ...fields,
            });
            Swal.fire({
                icon: "success",
                title: "Uğurlu!",
                text: "Hesabat uğurla saxlanıldı.",
                confirmButtonColor: "#465fff",
            });
        } catch (err) {
            console.error("Hesabat saxlanılarkən xəta:", err);
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Hesabat saxlanılarkən xəta baş verdi.",
                confirmButtonColor: "#465fff",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <CircularProgress />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Layihə kodu: <span className="font-semibold text-gray-700 dark:text-gray-200">{projectCode}</span>
                    &nbsp;|&nbsp; Rüb: <span className="font-semibold text-gray-700 dark:text-gray-200">{quarter}</span>
                    &nbsp;|&nbsp; İl: <span className="font-semibold text-gray-700 dark:text-gray-200">{year}</span>
                </p>
            </div>

            {POINT_KEYS.map((key) => (
                <div key={key}>
                    <label
                        htmlFor={key}
                        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                        {POINT_LABELS[key]}
                    </label>
                    <textarea
                        id={key}
                        rows={key === "point_2" ? 2 : 4}
                        value={fields[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={key === "point_2" ? "Məsələn: 75%" : "Məlumat daxil edin..."}
                        className="h-auto w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 focus:border-brand-300 dark:focus:border-brand-800 transition-all duration-300 ease-in-out resize-y"
                    />
                </div>
            ))}

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {saving ? <CircularProgress size={18} color="inherit" /> : null}
                    {saving ? "Saxlanılır..." : "Hesabatı saxla"}
                </button>
            </div>
        </form>
    );
};

export default QuarterlyReportForm;
