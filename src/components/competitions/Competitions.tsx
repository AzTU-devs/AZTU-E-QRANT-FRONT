import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";
import Swal from "sweetalert2";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Competition,
    getCompetitions,
    createCompetition,
    activateCompetition,
} from "../../services/competition/competition";

const formatDate = (value: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
};

const currentYear = new Date().getFullYear();

export default function Competitions() {
    const { isOpen, openModal, closeModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activatingId, setActivatingId] = useState<number | null>(null);
    const [competitions, setCompetitions] = useState<Competition[]>([]);

    const [year, setYear] = useState<string>(String(currentYear));
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [maxSmeta, setMaxSmeta] = useState("50000");
    const [collabLimit, setCollabLimit] = useState("7");
    const [activate, setActivate] = useState(true);

    const fetchCompetitions = async () => {
        try {
            setCompetitions(await getCompetitions());
        } catch (error) {
            console.error("Failed to fetch competitions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const openCreate = () => {
        setYear(String(currentYear));
        setCode("");
        setTitle("");
        setApplicationDeadline("");
        setMaxSmeta("50000");
        setCollabLimit("7");
        setActivate(true);
        openModal();
    };

    const handleCreate = async () => {
        const yearNum = parseInt(year, 10);
        if (!yearNum) {
            Swal.fire({ icon: "warning", title: "İl daxil edin" });
            return;
        }
        try {
            setSubmitting(true);
            await createCompetition({
                year: yearNum,
                code: code.trim() || undefined,
                title: title.trim() || undefined,
                application_deadline: applicationDeadline || undefined,
                max_smeta_amount: parseInt(maxSmeta, 10) || undefined,
                collaborator_limit: parseInt(collabLimit, 10) || undefined,
                activate,
            });
            await fetchCompetitions();
            closeModal();
            Swal.fire({ icon: "success", title: "Müsabiqə yaradıldı", timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Müsabiqə yaradıla bilmədi.";
            Swal.fire("Xəta!", msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleActivate = async (c: Competition) => {
        const result = await Swal.fire({
            title: "Aktivləşdirilsin?",
            text: `"${c.code}" aktiv müsabiqə olacaq. Yeni layihələr bu müsabiqəyə aid olacaq.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Bəli, aktivləşdir",
            cancelButtonText: "İmtina",
        });
        if (!result.isConfirmed) return;
        try {
            setActivatingId(c.id);
            await activateCompetition(c.id);
            setCompetitions((prev) => prev.map((x) => ({ ...x, is_active: x.id === c.id })));
            Swal.fire({ icon: "success", title: "Aktivləşdirildi", timer: 1500, showConfirmButton: false });
        } catch (error) {
            console.error("Failed to activate competition:", error);
            Swal.fire("Xəta!", "Aktivləşdirmə baş tutmadı.", "error");
        } finally {
            setActivatingId(null);
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
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 text-start whitespace-nowrap">İl</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">Kod</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">Ad</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">Son müraciət</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start">Əməliyyat</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {competitions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Müsabiqə mövcud deyil
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {competitions.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">{c.year}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{c.code}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">{c.title || "—"}</TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(c.application_deadline)}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        {c.is_active ? <Badge color="success" size="sm">Aktiv</Badge> : <Badge color="light" size="sm">Passiv</Badge>}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        {c.is_active ? (
                                            <span className="text-xs text-gray-400">Aktiv müsabiqə</span>
                                        ) : (
                                            <Button size="sm" onClick={() => handleActivate(c)} disabled={activatingId === c.id}>
                                                {activatingId === c.id ? "..." : "Aktivləşdir"}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end">
                <Button className="mt-[20px]" onClick={openCreate}>Yeni müsabiqə</Button>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Yeni müsabiqə</h4>
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            İli daxil edin. Aktivləşdirilən müsabiqə cari müsabiqə olur — istifadəçilər təkrar qeydiyyatdan keçmədən yeni layihə yarada bilər.
                        </p>
                    </div>
                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-5 lg:grid-cols-2 px-2">
                            <div>
                                <Label>İl *</Label>
                                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" />
                            </div>
                            <div>
                                <Label>Kod (avtomatik)</Label>
                                <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder={`AzTU-DQL-${year || currentYear}`} />
                            </div>
                            <div className="lg:col-span-2">
                                <Label>Ad</Label>
                                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Müsabiqənin adı" />
                            </div>
                            <div>
                                <Label>Son müraciət tarixi</Label>
                                <Input type="date" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} />
                            </div>
                            <div>
                                <Label>Maksimal büdcə (AZN)</Label>
                                <Input type="number" value={maxSmeta} onChange={(e) => setMaxSmeta(e.target.value)} />
                            </div>
                            <div>
                                <Label>İcraçı limiti</Label>
                                <Input type="number" value={collabLimit} onChange={(e) => setCollabLimit(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="activate" type="checkbox" checked={activate} onChange={(e) => setActivate(e.target.checked)} className="h-4 w-4" />
                                <label htmlFor="activate" className="text-sm text-gray-600 dark:text-gray-400">Dərhal aktivləşdir</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>Bağla</Button>
                            <Button size="sm" onClick={handleCreate} disabled={submitting}>
                                {submitting ? "Yaradılır..." : "Yarat"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
