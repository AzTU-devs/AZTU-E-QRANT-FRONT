import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import Profile from "../../../public/profile.webp";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Collaborator {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    projectRole: number;
    image?: {
        image: string | null;
    } | null;
}

export default function ApproveWaitingUsers() {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/api/app-wait-collaborators/${projectCode}`);
                setCollaborators(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            }
        };
        fetchCollaborators();
    }, []);

    const handleApprove = async (finKod: string) => {
        try {
            const response = await apiClient.post(`/api/app-collaborator/${finKod}`);

            if (response.data.status === 200) {
                Swal.fire("Uğurla təsdiqləndi!", "", "success");
            } else {
                Swal.fire("Xəta baş verdi!", "Təsdiqləmə mümkün olmadı", "error");
            }
        } catch (error) {
            console.error("Error during approval:", error);
            Swal.fire("Xəta baş verdi!", "Serverə qoşulmaq mümkün olmadı", "error");
        }
    };

    const handleReject = async (finKod: string) => {
        try {
            const response = await apiClient.delete(`/api/reject-collaborator/${finKod}`);

            if (response.data.status === 200) {
                Swal.fire("Uğurla ləğv edildi!", "", "success");
            } else {
                Swal.fire("Xəta baş verdi!", "Təsdiqləmə mümkün olmadı", "error");
            }
        } catch (error) {
            console.error("Error during approval:", error);
            Swal.fire("Xəta baş verdi!", "Serverə qoşulmaq mümkün olmadı", "error");
        };
    };

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
                                    Ad, Soyad
                                </TableCell>
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
                                            <div className="flex items-center gap-3">
                                                {collaborator?.image?.image ? (

                                                    <img
                                                        src={`data:image/jpeg;base64,${collaborator?.image?.image}`}
                                                        alt={`${collaborator.name} ${collaborator.surname}`}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={Profile}
                                                        alt="User"
                                                        className="w-[fit-content] h-[fit-content] rounded-full object-cover border border-gray-300"
                                                    />
                                                )}
                                                <span>{collaborator.name} {collaborator.surname} {collaborator.father_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Layihə İştirakçısı
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${collaborator.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DoneIcon
                                                    className="text-white cursor-pointer"
                                                    onClick={() => handleApprove(collaborator.fin_kod)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]">
                                                <DeleteIcon
                                                    className="text-white cursor-pointer"
                                                    onClick={() => handleReject(collaborator.fin_kod)}
                                                />
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
