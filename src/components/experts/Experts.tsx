import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import Profile from "../../../public/profile.webp";
import NotFoundImage from "../../../public/not_found.png";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Expert {
    id: number;
    email: string;
    name: string;
    surname: string;
    father_name: string;
    personal_id_serial_number: string;
    work_place?: string | null;
    duty?: string | null;
    scientific_degree?: string | null;
    phone_number?: string | null;
}

export default function Experts() {
    const [collaborators, setCollaborators] = useState<Expert[]>([]);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await apiClient.get(`/api/experts`);
                setCollaborators(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            }
        };
        fetchCollaborators();
    }, []);

    console.log(collaborators);
    


    if (collaborators.length === 0) {
        return (
            <div className="w-full flex flex-col justify-center items-center">
                <img src={NotFoundImage} alt="not-found" className="w-[400px]"/>
                <p className="mt-[10px] text-[30px]" style={{color: "rgb(18, 32, 87)", fontWeight: 500}}>Layihə icraçıları mövcud deyil.</p>
            </div>
        )
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
                                    Ad, Soyad
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Telefon
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
                                    Elmi Dərəcə
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                     Baxış
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {collaborators.map((collaborator, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-3">

                                                <span>{collaborator.name} {collaborator.surname} {collaborator.father_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.email}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.phone_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.personal_id_serial_number}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.scientific_degree}
                                        </TableCell>
                                         <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Link to={`/user-view/${collaborator.personal_id_serial_number}`}>
                                            <VisibilityIcon
                                                style={{ width: 35, height: 35 }}
                                                className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                            />
                                        </Link>
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
