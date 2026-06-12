import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import apiClient from "../../util/apiClient";

interface Props {
    projectCode: string | number;
    quarter: number;
    year: number;
}

interface ReportFile {
    id: number;
    original_filename: string;
    content_type: string | null;
    file_size: number | null;
    uploaded_at: string | null;
}

const ACCEPT = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const formatSize = (bytes: number | null) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ReportFilesUpload: React.FC<Props> = ({ projectCode, quarter, year }) => {
    const [files, setFiles] = useState<ReportFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchFiles = useCallback(async () => {
        if (!projectCode || !quarter || !year) return;
        setLoading(true);
        try {
            const res = await apiClient.get(
                `/api/reports/files/${projectCode}/${quarter}/${year}`
            );
            setFiles(res.data.files ?? []);
        } catch (err) {
            console.error("Fayllar yüklənərkən xəta:", err);
        } finally {
            setLoading(false);
        }
    }, [projectCode, quarter, year]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const onDrop = useCallback(
        async (acceptedFiles: File[], fileRejections: any[]) => {
            if (fileRejections.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Yalnız PDF, DOC, DOCX",
                    text: "Bəzi fayllar dəstəklənmir və əlavə edilmədi.",
                    confirmButtonColor: "#182f79",
                });
            }
            if (acceptedFiles.length === 0) return;

            const formData = new FormData();
            formData.append("project_code", String(projectCode));
            formData.append("quarter_number", String(quarter));
            formData.append("year", String(year));
            acceptedFiles.forEach((file) => formData.append("files", file));

            setUploading(true);
            try {
                await apiClient.post("/api/reports/files/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                await fetchFiles();
                Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: `${acceptedFiles.length} fayl yükləndi.`,
                    confirmButtonColor: "#182f79",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err: any) {
                console.error("Fayl yüklənərkən xəta:", err);
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                    text: err?.response?.data?.error ?? "Fayl yüklənərkən xəta baş verdi.",
                    confirmButtonColor: "#182f79",
                });
            } finally {
                setUploading(false);
            }
        },
        [projectCode, quarter, year, fetchFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPT,
        disabled: uploading,
    });

    const handleDownload = async (file: ReportFile) => {
        try {
            const res = await apiClient.get(
                `/api/reports/files/download/${file.id}`,
                { responseType: "blob" }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.original_filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Fayl endirilərkən xəta:", err);
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Fayl endirilərkən xəta baş verdi.",
                confirmButtonColor: "#182f79",
            });
        }
    };

    const handleDelete = async (file: ReportFile) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Faylı silmək istəyirsiniz?",
            text: file.original_filename,
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#182f79",
        });
        if (!result.isConfirmed) return;

        try {
            await apiClient.delete(`/api/reports/files/${file.id}`);
            setFiles((prev) => prev.filter((f) => f.id !== file.id));
        } catch (err) {
            console.error("Fayl silinərkən xəta:", err);
            Swal.fire({
                icon: "error",
                title: "Xəta",
                text: "Fayl silinərkən xəta baş verdi.",
                confirmButtonColor: "#182f79",
            });
        }
    };

    return (
        <div className="space-y-4 px-4 pb-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Əlavə sənədlər (yalnız 4-cü rüb)
            </h4>

            <div className="transition-all border-2 border-gray-200 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-white/10 rounded-2xl hover:border-brand-400 hover:bg-brand-25/40 dark:hover:bg-brand-500/[0.04]">
                <div
                    {...getRootProps()}
                    className={`dropzone rounded-2xl border-dashed p-7 transition-all
                    ${
                        isDragActive
                            ? "border-brand-500 bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-500/10 dark:to-purple-500/10"
                            : "border-gray-200 bg-white/40 dark:border-white/10 dark:bg-white/[0.02]"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-[0_10px_28px_-8px_rgba(24,47,121,0.55)]">
                            {uploading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <svg
                                    className="fill-current"
                                    width="26"
                                    height="26"
                                    viewBox="0 0 29 28"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                    />
                                </svg>
                            )}
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
                            {isDragActive
                                ? "Faylları buraxın"
                                : "Faylları sürüşdürün və buraxın"}
                        </h4>
                        <span className="mb-3 block text-center text-sm text-gray-700 dark:text-gray-400">
                            PDF, DOC və ya DOCX (hər biri maks. 25 MB)
                        </span>
                        <span className="font-medium underline text-theme-sm text-brand-500">
                            Fayllarda axtarış edin
                        </span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-4">
                    <CircularProgress size={20} />
                </div>
            ) : files.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                    {files.map((file) => (
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
                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDownload(file)}
                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
                                >
                                    Endir
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(file)}
                                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    Sil
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500">
                    Hələ heç bir fayl yüklənməyib.
                </p>
            )}
        </div>
    );
};

export default ReportFilesUpload;
