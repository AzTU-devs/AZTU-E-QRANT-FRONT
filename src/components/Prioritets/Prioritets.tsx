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
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import EditIcon from '@mui/icons-material/Edit';
import { useModal } from "../../hooks/useModal";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";

interface Expert {
    id: number;
    prioritet_name: string;
    prioritet_code: number;
    created_at: string;
}

export default function Prioritets() {
    const [loading, setLoading] = useState(false);
    const [creationLoading, setCreationLoading] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const [prioritetName, setPrioritetName] = useState("");
    const [prioritets, setPrioritets] = useState<Expert[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const [maxPrioritetCode, setMaxPrioritetCode] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selectedPrioritet, setSelectedPrioritet] = useState<number | null>(null);
    const [newPrName, setNewPrName] = useState("");

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/api/priotets`);
                setPrioritets(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollaborators();
    }, []);

    useEffect(() => {
        if (prioritets.length > 0) {
            const maxCode = Math.max(...prioritets.map(p => p.prioritet_code));
            setMaxPrioritetCode(maxCode);
        }
    }, [prioritets]);

    const handleNewPrioritet = async () => {
        try {
            setCreationLoading(true);
            const response = await apiClient.post(
                '/api/create-priotet',
                {
                    prioritet_name: prioritetName,
                    prioritet_code: maxPrioritetCode ? maxPrioritetCode + 1 : 1
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = response.data;

            if (result.statusCode === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Ekspert uğurla əlavə edildi!",
                    showConfirmButton: true,
                }).then(() => {
                    setPrioritets(prev => [...prev, result.data]);
                    closeModal();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                });
            }
        } catch (error: any) {
            console.error('Error creating prioritet:', error.response?.data?.message || error.message);
        } finally {
            setCreationLoading(false);
        }
    };

    const handleDelete = async (code: number) => {
        try {
            setDeleteLoading(true);
            const response = await apiClient.delete(`/api/del-prioritet/${code}`);

            if (response.data.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Prioritet uğurla silindi",
                    showConfirmButton: true,
                }).then(() => {
                    window.location.reload();
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Xəta",
            });
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleUpdate = async (prioritet_name: string, prioritet_code: number) => {
        try {
            const response = await apiClient.post(
                '/api/upd-prioritet',
                {
                    prioritet_name: prioritet_name,
                    prioritet_code: prioritet_code
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (response.data.statusCode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Prioritet uğurla redaktə edildi",
                    showConfirmButton: true,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta",
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Xəta",
            });
        } finally {
            setDeleteLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Prioritet kodu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Prioritet adı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Əlavə edilmə tarixi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Sil
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Redaktə et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {prioritets.length === 0 ? (
                                <TableRow className="p-5">
                                    <TableCell colSpan={4} className="p-5">
                                        Prioritet mövcud deyil
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {prioritets.map((prioritet, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {prioritet.prioritet_code}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {prioritet.prioritet_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {prioritet.created_at}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {
                                                <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]" onClick={() => handleDelete(prioritet.prioritet_code)}>
                                                    {deleteLoading ? (
                                                        <CircularProgress style={{ color: "#fff" }} />
                                                    ) : (
                                                        <DeleteIcon
                                                            className="text-white cursor-pointer"
                                                        />
                                                    )}
                                                </div>
                                            }
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div
                                                className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title="Redaktə et"
                                                onClick={() => {
                                                    setSelectedPrioritet(prioritet.prioritet_code);
                                                    setEdit(true);
                                                    openModal();
                                                }}
                                            >
                                                <EditIcon className="text-white cursor-pointer" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex justify-end flex-end">
                <Button className="mt-[20px]" onClick={openModal}>
                    Yeni Prioritet
                </Button>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                {edit ? (
                    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Prioriteti redaktə edin
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                Məlumatları dolduraraq prioriteti redaktə edin
                            </p>
                        </div>
                        <form className="flex flex-col">
                            <div className="px-2 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Prioritet kodu</Label>
                                        <Input type="text" value={selectedPrioritet ? selectedPrioritet : 0} disabled={true} />
                                    </div>
                                    <div>
                                        <Label>Prioritet adı</Label>
                                        <Input type="text" value={newPrName} onChange={(e) => setNewPrName(e.target.value)} placeholder="Prioritet adı" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Bağla
                                </Button>
                                <Button size="sm" onClick={() => handleUpdate(newPrName, selectedPrioritet ? selectedPrioritet : 0)}>
                                    {creationLoading ? "Redaktə edilir" : "Redaktə et"}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Yeni prioritet
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                Məlumatları dolduraraq prioritet əlavə edin
                            </p>
                        </div>
                        <form className="flex flex-col">
                            <div className="px-2 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Prioritet kodu</Label>
                                        <Input type="text" value={maxPrioritetCode ? maxPrioritetCode + 1 : 1} />
                                    </div>
                                    <div>
                                        <Label>Prioritet adı</Label>
                                        <Input type="text" value={prioritetName} onChange={(e) => setPrioritetName(e.target.value)} placeholder="Prioritet adı" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Bağla
                                </Button>
                                <Button size="sm" onClick={handleNewPrioritet}>
                                    {creationLoading ? "Əlavə edilir" : "Əlavə et"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </>
    )
}
