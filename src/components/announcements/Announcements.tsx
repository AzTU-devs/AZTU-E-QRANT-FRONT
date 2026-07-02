import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Switch from "../form/switch/Switch";
import TextArea from "../form/input/TextArea";
import { useModal } from "../../hooks/useModal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
import {
    Announcement,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from "../../services/announcement/announcement";

const formatDate = (value: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
};

export default function Announcements() {
    const { isOpen, openModal, closeModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const data = await getAllAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setPublished(true);
        openModal();
    };

    const openEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setTitle(announcement.title);
        setContent(announcement.content);
        setPublished(announcement.published);
        openModal();
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            Swal.fire({ icon: "warning", title: "Başlıq və məzmun boş ola bilməz" });
            return;
        }
        try {
            setSubmitting(true);
            if (editingId) {
                await updateAnnouncement(editingId, { title, content, published });
            } else {
                await createAnnouncement({ title, content, published });
            }
            await fetchAnnouncements();
            closeModal();
            Swal.fire({
                icon: "success",
                title: editingId ? "Elan redaktə edildi" : "Elan əlavə edildi",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Failed to save announcement:", error);
            Swal.fire({ icon: "error", title: "Xəta baş verdi" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleTogglePublished = async (announcement: Announcement) => {
        try {
            await updateAnnouncement(announcement.id, { published: !announcement.published });
            setAnnouncements(prev =>
                prev.map(a => (a.id === announcement.id ? { ...a, published: !a.published } : a))
            );
        } catch (error) {
            console.error("Failed to toggle announcement:", error);
            Swal.fire({ icon: "error", title: "Xəta baş verdi" });
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Əminsiniz?",
            text: "Bu elan silinəcək.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr"
        });
        if (!result.isConfirmed) return;

        try {
            setDeletingId(id);
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            Swal.fire({ icon: "success", title: "Elan silindi", timer: 1500, showConfirmButton: false });
        } catch (error) {
            console.error("Failed to delete announcement:", error);
            Swal.fire({ icon: "error", title: "Xəta baş verdi" });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Başlıq
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Məzmun
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Tarix
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Redaktə et
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Sil
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {announcements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                        Elan mövcud deyil
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {announcements.map((announcement) => (
                                <TableRow key={announcement.id}>
                                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm font-medium dark:text-gray-300 max-w-[220px]">
                                        <span className="line-clamp-2">{announcement.title}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[320px]">
                                        <span className="line-clamp-2">{announcement.content}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        <button
                                            onClick={() => handleTogglePublished(announcement)}
                                            title={announcement.published ? "Dərc olunub — gizlət" : "Qaralama — dərc et"}
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${announcement.published
                                                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-600/20 dark:text-green-300"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300"
                                                }`}
                                        >
                                            {announcement.published ? "Dərc olunub" : "Qaralama"}
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatDate(announcement.created_at)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        <div
                                            className="bg-brand-600 hover:bg-brand-700 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                            title="Redaktə et"
                                            onClick={() => openEdit(announcement)}
                                        >
                                            <EditIcon className="text-white cursor-pointer" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        <div
                                            className="bg-red-500 hover:bg-red-600 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                            title="Sil"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            {deletingId === announcement.id ? (
                                                <CircularProgress size={20} style={{ color: "#fff" }} />
                                            ) : (
                                                <DeleteIcon className="text-white cursor-pointer" />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end">
                <Button className="mt-[20px]" onClick={openCreate}>
                    Yeni Elan
                </Button>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {editingId ? "Elanı redaktə edin" : "Yeni elan"}
                        </h4>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Elanın başlığını və məzmununu daxil edin. Dərc olunan elanlar istifadəçi paneli və rəsmi saytda görünəcək.
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-y-5">
                                <div>
                                    <Label>Başlıq</Label>
                                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Elanın başlığı" />
                                </div>
                                <div>
                                    <Label>Məzmun</Label>
                                    <TextArea value={content} onChange={(value) => setContent(value)} rows={6} placeholder="Elanın məzmunu" />
                                </div>
                                <div>
                                    <Switch
                                        key={`published-${editingId ?? "new"}`}
                                        label="Dərc olunsun"
                                        defaultChecked={published}
                                        onChange={(checked) => setPublished(checked)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Bağla
                            </Button>
                            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Yadda saxlanılır..." : editingId ? "Redaktə et" : "Əlavə et"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
