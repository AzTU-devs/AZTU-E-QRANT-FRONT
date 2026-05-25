import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table"
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import Profile from "../../../public/profile.webp";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";

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

interface Owner {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    projectRole: number;
    image?: {
        image: string | null;
    } | null;
}

export default function Collaborators({ projectCode }: { projectCode: Number | null }) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [owner, setOwner] = useState<Owner | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/api/collaborators/${projectCode}`);
                setCollaborators(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            }
        };
        
        const fetchOwnerData = async () => {
            try {
                const response = await apiClient.get(`/api/project-owner/${projectCode}`);
                setOwner(response.data.owner_data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOwnerData();
        fetchCollaborators();
    }, []);

    console.log(owner);
    

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    };

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
                                {pathname === "/collaborators" ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Baxış
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : collaborators.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {owner ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-3">
                                            {owner.image?.image ? (

                                                <img
                                                    src={`data:image/jpeg;base64,${owner.image?.image}`}
                                                    alt={`${owner.name} ${owner.surname}`}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={Profile}
                                                    alt="User"
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                                />
                                            )}
                                            <span>{owner.name} {owner.surname} {owner.father_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {owner.fin_kod}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə rəhbəri
                                    </TableCell>
                                    {pathname === "/collaborators" ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${owner.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                    ) : null}
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
                                        {pathname === "/collaborators" ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Link to={`/user-view/${collaborator.fin_kod}`}>
                                                    <VisibilityIcon
                                                        style={{ width: 35, height: 35 }}
                                                        className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                                    />
                                                </Link>
                                            </TableCell>
                                        ) : null}
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
