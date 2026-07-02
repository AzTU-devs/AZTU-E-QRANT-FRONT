import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";
import Swal from "sweetalert2";
import Badge from "../ui/badge/Badge";
import ReadMore from "../ui/ReadMore";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
    RoleChangeRequest,
    ROLE_LABELS,
    getPendingRoleChangeRequests,
    approveRoleChange,
    rejectRoleChange,
} from "../../services/roleChange/roleChange";

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
};

export default function RoleChangeRequests() {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<RoleChangeRequest[]>([]);
    const [actingId, setActingId] = useState<number | null>(null);

    const fetchRequests = async () => {
        try {
            setRequests(await getPendingRoleChangeRequests());
        } catch (error) {
            console.error("Failed to fetch role-change requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const decide = async (req: RoleChangeRequest, approve: boolean) => {
        const result = await Swal.fire({
            title: approve ? "Təsdiq edilsin?" : "Rədd edilsin?",
            input: approve ? undefined : "textarea",
            inputPlaceholder: "Səbəb (istəyə bağlı)",
            text: approve
                ? `İstifadəçinin rolu "${ROLE_LABELS[req.requested_role]}" olaraq dəyişdiriləcək.`
                : undefined,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: approve ? "Bəli, təsdiqlə" : "Bəli, rədd et",
            cancelButtonText: "İmtina",
        });
        if (!result.isConfirmed) return;

        try {
            setActingId(req.id);
            if (approve) {
                await approveRoleChange(req.id);
            } else {
                await rejectRoleChange(req.id, typeof result.value === "string" ? result.value : undefined);
            }
            setRequests((prev) => prev.filter((r) => r.id !== req.id));
            Swal.fire({
                icon: "success",
                title: approve ? "Təsdiqləndi" : "Rədd edildi",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to decide role-change:", error);
            Swal.fire("Xəta!", "Əməliyyat baş tutmadı.", "error");
        } finally {
            setActingId(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start">Ad Soyad</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start">FIN</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start">Dəyişiklik</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start">Səbəb</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start whitespace-nowrap">Tarix</TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start">Əməliyyat</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Gözləyən sorğu yoxdur
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {requests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                    {req.user?.name || req.user?.surname
                                        ? `${req.user?.name ?? ""} ${req.user?.surname ?? ""}`.trim()
                                        : "Mövcud deyil"}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {req.fin_kod}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Badge color="light" size="sm">{ROLE_LABELS[req.current_role]}</Badge>
                                        <span className="text-gray-400">→</span>
                                        <Badge color="info" size="sm">{ROLE_LABELS[req.requested_role]}</Badge>
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 min-w-[180px] max-w-[300px]">
                                    <ReadMore text={req.reason} lines={2} />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {formatDate(req.created_at)}
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => decide(req, true)}
                                            disabled={actingId === req.id}
                                            title="Təsdiqlə"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-success-500 text-white hover:bg-success-600 disabled:opacity-60"
                                        >
                                            {actingId === req.id ? <CircularProgress size={16} style={{ color: "#fff" }} /> : <DoneIcon fontSize="small" />}
                                        </button>
                                        <button
                                            onClick={() => decide(req, false)}
                                            disabled={actingId === req.id}
                                            title="Rədd et"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-error-500 text-white hover:bg-error-600 disabled:opacity-60"
                                        >
                                            <CloseIcon fontSize="small" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
