import Swal from "sweetalert2";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TextArea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
import { useModal } from "../../hooks/useModal";
import CircularProgress from "@mui/material/CircularProgress";
import {
    RoleChangeRequest,
    ROLE_LABELS,
    createRoleChangeRequest,
    getMyRoleChangeRequests,
} from "../../services/roleChange/roleChange";

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
};

const statusBadge = (status: RoleChangeRequest["status"]) => {
    if (status === "approved") return <Badge color="success" size="sm">Təsdiqləndi</Badge>;
    if (status === "rejected") return <Badge color="error" size="sm">Rədd edildi</Badge>;
    return <Badge color="warning" size="sm">Gözləyir</Badge>;
};

export default function RequestRoleChange() {
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const { isOpen, openModal, closeModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reason, setReason] = useState("");
    const [requests, setRequests] = useState<RoleChangeRequest[]>([]);

    // 0 = lead, 1 = member. Only these two can switch.
    const currentRole = projectRole ?? -1;
    const targetRole = currentRole === 0 ? 1 : 0;
    const hasPending = requests.some((r) => r.status === "pending");

    const fetchRequests = async () => {
        try {
            setRequests(await getMyRoleChangeRequests());
        } catch (error) {
            console.error("Failed to fetch my role-change requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await createRoleChangeRequest({ requested_role: targetRole, reason: reason.trim() || undefined });
            setReason("");
            closeModal();
            await fetchRequests();
            Swal.fire({
                icon: "success",
                title: "Sorğu göndərildi",
                text: "Admin təsdiqindən sonra rolunuz dəyişəcək.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Sorğu göndərilə bilmədi.";
            Swal.fire("Xəta!", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[240px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (currentRole !== 0 && currentRole !== 1) {
        return (
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 text-gray-500 dark:border-white/[0.06] dark:bg-gray-900/40">
                Rol dəyişikliyi yalnız layihə rəhbəri və icraçılar üçün mümkündür.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-theme-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cari rolunuz</p>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge color="info">{ROLE_LABELS[currentRole]}</Badge>
                            <span className="text-gray-400">→</span>
                            <Badge color="light">{ROLE_LABELS[targetRole]}</Badge>
                        </div>
                        <p className="mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                            Rolunuzu <strong>{ROLE_LABELS[targetRole]}</strong> olaraq dəyişmək üçün sorğu göndərə bilərsiniz.
                            Sorğu admin tərəfindən təsdiqləndikdən sonra dəyişiklik avtomatik tətbiq olunur. Əvvəlki
                            layihələriniz tarixçənizdə qalır.
                        </p>
                    </div>
                    <Button onClick={openModal} disabled={hasPending}>
                        {hasPending ? "Sorğu gözləyir" : "Rol dəyişikliyi tələb et"}
                    </Button>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">Sorğu tarixçəsi</h3>
                {requests.length === 0 ? (
                    <p className="text-sm text-gray-400">Hələ sorğu göndərməmisiniz.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {requests.map((r) => (
                            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3 dark:border-white/[0.05]">
                                <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    {ROLE_LABELS[r.current_role]} <span className="text-gray-400">→</span> {ROLE_LABELS[r.requested_role]}
                                </span>
                                <span className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                                    {statusBadge(r.status)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Rol dəyişikliyi tələbi</h4>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            Rolunuz <strong>{ROLE_LABELS[currentRole]}</strong> → <strong>{ROLE_LABELS[targetRole]}</strong> olaraq dəyişdiriləcək (admin təsdiqindən sonra).
                        </p>
                    </div>
                    <div className="px-2">
                        <Label>Səbəb (istəyə bağlı)</Label>
                        <TextArea value={reason} onChange={(v) => setReason(v)} rows={4} placeholder="Rol dəyişikliyinin səbəbi" />
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={closeModal}>Bağla</Button>
                        <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Göndərilir..." : "Sorğu göndər"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
