import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../util/apiClient";
import Label from "../form/Label";
import CircularProgress from "@mui/material/CircularProgress";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";

interface ProjectFile {
    id: number;
    original_filename: string;
    content_type: string | null;
    file_size: number | null;
    is_image: boolean;
    uploaded_at: string | null;
}

function humanSize(bytes: number | null) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectFilesUpload({
    projectCode,
    disabled = false,
}: {
    projectCode: string | number;
    disabled?: boolean;
}) {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        if (!projectCode) { setLoading(false); return; }
        try {
            const res = await apiClient.get(`/api/project/${projectCode}/files`);
            setFiles(res.data?.data ?? []);
        } catch (error) {
            console.error("Failed to load project files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [projectCode]);

    const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (!picked.length || !projectCode) return;
        const fd = new FormData();
        picked.forEach((f) => fd.append("files", f));
        try {
            setUploading(true);
            await apiClient.post(`/api/project/${projectCode}/files`, fd);
            await load();
            Swal.fire({ icon: "success", title: "Fayllar yükləndi", timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Fayllar yüklənə bilmədi.";
            Swal.fire("Xəta!", msg, "error");
        } finally {
            setUploading(false);
        }
    };

    const download = async (file: ProjectFile) => {
        try {
            const res = await apiClient.get(`/api/project/files/${file.id}/download`, { responseType: "blob" });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.original_filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            Swal.fire("Xəta!", "Fayl yüklənə bilmədi.", "error");
        }
    };

    const remove = async (file: ProjectFile) => {
        const ok = await Swal.fire({
            title: "Silinsin?",
            text: `"${file.original_filename}" silinsin?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr",
            confirmButtonColor: "#dc2626",
        });
        if (!ok.isConfirmed) return;
        try {
            await apiClient.delete(`/api/project/files/${file.id}`);
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
        } catch {
            Swal.fire("Xəta!", "Fayl silinə bilmədi.", "error");
        }
    };

    if (!projectCode) {
        return (
            <div className="mt-[20px] rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 dark:border-white/10">
                Fayl əlavə etmək üçün əvvəlcə layihəni yadda saxlayın.
            </div>
        );
    }

    return (
        <div className="mt-[20px]">
            <Label className="mb-[10px]">Layihə faylları (sənədlər, şəkillər — say məhdudiyyəti yoxdur)</Label>

            <div className="rounded-xl border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <input ref={inputRef} type="file" multiple hidden onChange={onPick} />
                {!disabled && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-300 bg-brand-50/40 px-4 py-6 text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-60 dark:border-brand-500/30 dark:bg-brand-500/5"
                    >
                        {uploading ? (
                            <CircularProgress size={22} />
                        ) : (
                            <>
                                <UploadFileIcon />
                                <span className="text-sm font-medium">Fayl(lar) seçin və ya buraya sürükləyin</span>
                                <span className="text-xs text-gray-400">Bir neçə fayl seçə bilərsiniz</span>
                            </>
                        )}
                    </button>
                )}

                {loading ? (
                    <div className="flex h-[70px] items-center justify-center"><CircularProgress size={24} /></div>
                ) : files.length === 0 ? (
                    <p className="mt-3 text-center text-sm text-gray-400">Hələ fayl yüklənməyib.</p>
                ) : (
                    <ul className="mt-3 flex flex-col gap-2">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-white/10 dark:bg-gray-900/40"
                            >
                                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-white/10">
                                    {file.is_image ? <ImageIcon fontSize="small" /> : <InsertDriveFileIcon fontSize="small" />}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{file.original_filename}</p>
                                    <p className="text-xs text-gray-400">{humanSize(file.file_size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => download(file)}
                                    title="Yüklə"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-white/10"
                                >
                                    <DownloadIcon fontSize="small" />
                                </button>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => remove(file)}
                                        title="Sil"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
