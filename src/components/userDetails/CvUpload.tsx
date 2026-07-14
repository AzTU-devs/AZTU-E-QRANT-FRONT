import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Button from "../ui/button/Button";
import apiClient from "../../util/apiClient";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CircularProgress from "@mui/material/CircularProgress";

export default function CvUpload({ finKod }: { finKod: string | null }) {
    const [cvName, setCvName] = useState<string | null>(null);
    const [hasCv, setHasCv] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        if (!finKod) { setLoading(false); return; }
        try {
            const res = await apiClient.get(`/api/profile/${finKod}`);
            const u = res.data?.data ?? res.data;
            setHasCv(!!u?.has_cv);
            setCvName(u?.cv_original_filename ?? null);
        } catch (error) {
            console.error("Failed to load CV info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [finKod]);

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file || !finKod) return;
        const fd = new FormData();
        fd.append("cv", file);
        try {
            setUploading(true);
            await apiClient.post(`/api/profile/${finKod}/cv`, fd);
            await load();
            Swal.fire({ icon: "success", title: "CV yükləndi", timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            const msg = error?.response?.data?.message || "CV yüklənə bilmədi.";
            Swal.fire("Xəta!", msg, "error");
        } finally {
            setUploading(false);
        }
    };

    const download = async () => {
        if (!finKod) return;
        try {
            const res = await apiClient.get(`/api/profile/${finKod}/cv`, { responseType: "blob" });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = cvName || "cv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            Swal.fire("Xəta!", "CV yüklənə bilmədi.", "error");
        }
    };

    return (
        <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
            <div className="mb-4 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 text-white">
                    <DescriptionIcon className="size-5" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-gray-800 dark:text-white/90">CV / Tərcümeyi-hal</h2>
            </div>

            {loading ? (
                <div className="flex h-[80px] items-center justify-center"><CircularProgress /></div>
            ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        {hasCv ? (
                            <button onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                                <DescriptionIcon fontSize="small" className="text-brand-600" />
                                <span className="max-w-[220px] truncate">{cvName || "CV"}</span>
                                <DownloadIcon fontSize="small" className="text-gray-400" />
                            </button>
                        ) : (
                            <p className="text-sm text-gray-400">Hələ CV yüklənməyib. PDF, DOC və ya DOCX yükləyin.</p>
                        )}
                    </div>
                    <input ref={inputRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={onPick} />
                    <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
                        {uploading ? "Yüklənir..." : (
                            <span className="inline-flex items-center gap-1.5"><UploadFileIcon fontSize="small" /> {hasCv ? "CV-ni dəyiş" : "CV yüklə"}</span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
