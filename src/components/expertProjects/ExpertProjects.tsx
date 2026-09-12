import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GradingIcon from "@mui/icons-material/Grading";
import CircularProgress from "@mui/material/CircularProgress";

interface Criterion {
    key: string;
    number: number;
    max_score: number;
    title: string;
}

interface CriterionRow extends Criterion {
    score: number | null;
    note: string | null;
}

interface Assessment {
    assessment: number | null;
    total: number | null;
    max_total: number;
    criteria: CriterionRow[];
    note: string | null;
    updated_at: string | null;
}

interface AssignedProject {
    project_code: number;
    project_name: string | null;
    project_annotation: string | null;
    submitted: boolean;
    lead_name: string | null;
    max_total: number;
    assessment: Assessment | null;
}

/** What the expert has typed for one criterion, before it is saved. */
interface Draft {
    score: string;
    note: string;
}

function ProjectCard({
    project, criteria, onSaved,
}: { project: AssignedProject; criteria: Criterion[]; onSaved: () => void }) {
    // Seeded from whatever was scored before, so re-opening shows the sheet as
    // it was left rather than blank.
    const [draft, setDraft] = useState<Record<string, Draft>>(() => {
        const seeded: Record<string, Draft> = {};
        for (const criterion of criteria) {
            const saved = project.assessment?.criteria?.find((row) => row.key === criterion.key);
            seeded[criterion.key] = {
                score: saved?.score != null ? String(saved.score) : "",
                note: saved?.note ?? "",
            };
        }
        return seeded;
    });
    const [note, setNote] = useState(project.assessment?.note ?? "");
    const [saving, setSaving] = useState(false);

    const maxTotal = project.max_total ?? criteria.reduce((sum, c) => sum + c.max_score, 0);

    const setRow = (key: string, patch: Partial<Draft>) =>
        setDraft((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

    /** Clamp to the row's own maximum and keep digits only. */
    const setScore = (criterion: Criterion, raw: string) => {
        const digits = raw.replace(/\D/g, "");
        if (digits === "") return setRow(criterion.key, { score: "" });
        setRow(criterion.key, {
            score: String(Math.min(parseInt(digits, 10), criterion.max_score)),
        });
    };

    // The running total, recomputed as the expert types. The server derives the
    // stored total the same way, so what is shown is what gets saved.
    const total = criteria.reduce(
        (sum, c) => sum + (parseInt(draft[c.key]?.score ?? "", 10) || 0), 0
    );
    const unscored = criteria.filter((c) => (draft[c.key]?.score ?? "") === "");

    const handleSave = async () => {
        if (unscored.length) {
            Swal.fire(
                "Diqqət!",
                `Bütün meyarlar üzrə bal verilməlidir. Qalan: ${unscored.map((c) => c.number).join(", ")}`,
                "warning"
            );
            return;
        }
        try {
            setSaving(true);
            await apiClient.post("/api/expert/assessment", {
                project_code: project.project_code,
                criteria: Object.fromEntries(
                    criteria.map((c) => [c.key, {
                        score: parseInt(draft[c.key].score, 10),
                        note: draft[c.key].note,
                    }])
                ),
                note,
            });
            Swal.fire("Yadda saxlanıldı!", `Yekun bal: ${total}/${maxTotal}`, "success");
            onSaved();
        } catch (error: any) {
            console.error("Failed to save assessment:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Qiymətləndirməni yadda saxlamaq mümkün olmadı.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-5 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge color="light" size="sm">Kod: {project.project_code}</Badge>
                {project.assessment?.assessment != null ? (
                    <Badge color="success" size="sm">
                        Qiymətləndirilib — {project.assessment.assessment}/{maxTotal}
                    </Badge>
                ) : (
                    <Badge color="warning" size="sm">Qiymətləndirilməyib</Badge>
                )}
            </div>

            <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
                {project.project_name || "Adsız layihə"}
            </h3>
            {project.lead_name ? (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Layihə rəhbəri: {project.lead_name}
                </p>
            ) : null}

            {project.project_annotation ? (
                <ReadMore
                    text={project.project_annotation}
                    lines={3}
                    className="mt-3 text-sm text-gray-600 dark:text-gray-300"
                />
            ) : null}

            <Link
                to={`/project-view/${project.project_code}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
                <VisibilityIcon style={{ width: 16, height: 16 }} />
                Layihənin tam məzmunu
            </Link>

            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/[0.06]">
                <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-white/90">
                    Qiymətləndirmə meyarları
                </h4>

                <div className="max-w-full overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.06]">
                    <table className="w-full min-w-[720px] border-collapse text-sm">
                        <thead className="bg-gray-50 dark:bg-white/[0.04]">
                            <tr>
                                <th className="w-10 px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">№</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Qiymətləndirmə meyarı</th>
                                <th className="w-20 px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Maks. bal</th>
                                <th className="w-24 px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Ekspert balı</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                            {criteria.map((criterion) => (
                                <tr key={criterion.key} className="align-top">
                                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400">{criterion.number}</td>
                                    <td className="px-3 py-3">
                                        <p className="text-gray-800 dark:text-gray-200">{criterion.title}</p>
                                        <TextArea
                                            value={draft[criterion.key]?.note ?? ""}
                                            rows={2}
                                            placeholder="Bu meyar üzrə qeydiniz"
                                            onChange={(value) => setRow(criterion.key, { note: value })}
                                            disabled={saving}
                                            className="mt-2"
                                        />
                                    </td>
                                    <td className="px-3 py-3 text-center font-semibold text-gray-500 dark:text-gray-400">
                                        {criterion.max_score}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            aria-label={`${criterion.number}. meyar üzrə bal`}
                                            value={draft[criterion.key]?.score ?? ""}
                                            disabled={saving}
                                            placeholder="0"
                                            onChange={(e) => setScore(criterion, e.target.value)}
                                            className="h-10 w-16 rounded-xl border border-gray-200 bg-white/70 text-center text-sm font-semibold text-gray-800 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90"
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-bold dark:bg-white/[0.04]">
                                <td className="px-3 py-3" />
                                <td className="px-3 py-3 text-gray-800 dark:text-white/90">YEKUN BAL</td>
                                <td className="px-3 py-3 text-center text-gray-800 dark:text-white/90">{maxTotal}</td>
                                <td className="px-3 py-3 text-center">
                                    <span className={`text-base ${unscored.length ? "text-gray-400" : "text-brand-600 dark:text-brand-300"}`}>
                                        {total}/{maxTotal}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <Label>Ümumi rəy</Label>
                    <TextArea
                        value={note}
                        rows={4}
                        placeholder="Layihə haqqında ümumi rəyinizi yazın"
                        onChange={(value) => setNote(value)}
                        disabled={saving}
                    />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                        {unscored.length
                            ? `Bal verilməmiş meyarlar: ${unscored.map((c) => c.number).join(", ")}`
                            : project.assessment?.updated_at
                                ? `Son yenilənmə: ${new Date(project.assessment.updated_at).toLocaleDateString("az-AZ")}`
                                : "Bütün meyarlar dolduruldu."}
                    </span>
                    <Button size="sm" onClick={handleSave} disabled={saving || unscored.length > 0}>
                        {saving ? "Yadda saxlanılır..." : "Qiymətləndirməni yadda saxla"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/** Everything this expert has been appointed to, each with its scoring form. */
export default function ExpertProjects() {
    const [projects, setProjects] = useState<AssignedProject[]>([]);
    // The sheet is served alongside the work, so the weights live in one place.
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await apiClient.get("/api/expert/my-projects");
            setProjects(res.data?.data?.projects ?? []);
            setCriteria(res.data?.data?.criteria ?? []);
        } catch (error) {
            console.error("Failed to fetch assigned projects:", error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) {
        return (
            <div className="flex h-[300px] items-center justify-center"><CircularProgress /></div>
        );
    }

    if (!projects.length) {
        return (
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-10 text-center dark:border-white/[0.06] dark:bg-gray-900/40">
                <GradingIcon className="text-gray-300" style={{ width: 48, height: 48 }} />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hazırda sizə təyin olunmuş layihə yoxdur.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {projects.map((project) => (
                <ProjectCard
                    key={project.project_code}
                    project={project}
                    criteria={criteria}
                    onSaved={load}
                />
            ))}
        </div>
    );
}
