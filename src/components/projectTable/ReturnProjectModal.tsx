import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import apiClient from "../../util/apiClient";
import UndoIcon from "@mui/icons-material/Undo";

const MIN_NOTE = 10;

interface Props {
    isOpen: boolean;
    project: any;
    onClose: () => void;
    onReturned: (note: string) => void;
}

/**
 * Sending a submitted proposal back to its lead.
 *
 * The note is the point of the exercise — it is what the lead is told to fix —
 * so it is required here as well as on the server, and it reaches them three
 * ways: on their project page, as a notification, and by e-mail.
 */
export default function ReturnProjectModal({ isOpen, project, onClose, onReturned }: Props) {
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) setNote("");
    }, [isOpen, project?.project_code]);

    const tooShort = note.trim().length > 0 && note.trim().length < MIN_NOTE;
    const blocked = saving || note.trim().length < MIN_NOTE;

    const handleReturn = async () => {
        if (blocked) return;
        try {
            setSaving(true);
            await apiClient.post("/api/project/return-for-revision", {
                project_code: project?.project_code,
                note: note.trim(),
            });
            onReturned(note.trim());
            onClose();
            Swal.fire(
                "Geri qaytarıldı!",
                "Layihə rəhbərinə bildiriş və e-poçt göndərildi. Layihə yenidən redaktə oluna bilər.",
                "success"
            );
        } catch (error: any) {
            console.error("Failed to return the project:", error);
            Swal.fire(
                "Xəta baş verdi!",
                error.response?.data?.error ?? "Layihəni geri qaytarmaq mümkün olmadı.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4 p-6 lg:p-8">
            <h4 className="mb-1 flex items-center gap-2 text-title-sm font-semibold text-gray-800 dark:text-white/90">
                <UndoIcon /> Layihəni düzəliş üçün geri qaytar
            </h4>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                {project?.project_name || "Adsız layihə"}
            </p>

            <div className="mb-5 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300">
                Layihə <b>“təqdim edilib”</b> statusundan çıxarılacaq və rəhbər onu yenidən
                redaktə edə biləcək. Düzəlişlərdən sonra layihəni <b>yenidən təqdim etməlidir</b>.
            </div>

            <Label>
                Düzəldilməli olanlar <span className="ml-0.5 text-error-500">*</span>
            </Label>
            <TextArea
                value={note}
                rows={5}
                placeholder="Layihə rəhbərinin nəyi düzəltməli olduğunu konkret yazın"
                onChange={(value) => setNote(value)}
                disabled={saving}
            />
            <p className={`mt-1 text-xs ${tooShort ? "font-medium text-error-500" : "text-gray-400"}`}>
                {tooShort
                    ? `Qeyd ən azı ${MIN_NOTE} simvol olmalıdır.`
                    : "Bu qeyd layihə rəhbərinə həm sistemdə, həm də e-poçtla göndəriləcək."}
            </p>

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={saving}>Bağla</Button>
                <Button onClick={handleReturn} disabled={blocked}>
                    {saving ? "Göndərilir..." : "Geri qaytar və bildir"}
                </Button>
            </div>
        </Modal>
    );
}
