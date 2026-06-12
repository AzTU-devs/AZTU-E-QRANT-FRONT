import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";

interface Collaborator {
    fin_kod: string;
    project_role: number;
}

export default function ApproveWaitingUsersByAdmin() {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
    const [approveLoadingFin, setApproveLoadingFin] = useState<string | null>(null);
    const [rejectLoadingFin, setRejectLoadingFin] = useState<string | null>(null);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/auth/app-wait-users`);
                setCollaborators(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollaborators();
    }, []);


    const handleApprove = async (finKod: string) => {
        setApproveLoadingFin(finKod);
        try {
            const response = await apiClient.post(`/auth/app-user/${finKod}`);

            if (response.data.statusCode === 200) {
                Swal.fire("Uğurla təsdiqləndi!", "", "success")
                    .then(() => {
                        window.location.reload();
                    });
            } else {
                Swal.fire("Xəta baş verdi!", "Təsdiqləmə mümkün olmadı", "error");
            }
        } catch (error) {
            console.error("Error during approval:", error);
            Swal.fire("Xəta baş verdi!", "Serverə qoşulmaq mümkün olmadı", "error");
        } finally {
            setApproveLoadingFin(null);
        }
    };

    const handleReject = async (finKod: string) => {
        setRejectLoadingFin(finKod);
        try {
            const response = await apiClient.delete(`/auth/reject-user/${finKod}`);

            if (response.data.statusCode === 200) {
                Swal.fire("Uğurla ləğv edildi!", "", "success")
                    .then(() => {
                        window.location.reload();
                    })
            } else {
                Swal.fire("Xəta baş verdi!", "Təsdiqləmə mümkün olmadı", "error");
            }
        } catch (error) {
            console.error("Error during approval:", error);
            Swal.fire("Xəta baş verdi!", "Serverə qoşulmaq mümkün olmadı", "error");
        } finally {
            setRejectLoadingFin(null);
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
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Fin Kod
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə Rolu
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Təsdiqlə
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ləğv et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {collaborators.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {collaborators.map((collaborator, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.project_role === 0 ? "Layihə rəhbəri" : "Layihə icraçısı"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${collaborator.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-brand-50 text-brand-600 rounded p-1 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-800/60 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                {approveLoadingFin === collaborator.fin_kod ? <CircularProgress size={24} style={{ color: "#fff" }} /> : (
                                                    <DoneIcon
                                                        className="text-white cursor-pointer"
                                                        onClick={() => handleApprove(collaborator.fin_kod)}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                {rejectLoadingFin === collaborator.fin_kod ? <CircularProgress size={24} style={{ color: "#fff" }} /> : (
                                                    <DeleteIcon
                                                        className="text-white cursor-pointer"
                                                        onClick={() => handleReject(collaborator.fin_kod)}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
