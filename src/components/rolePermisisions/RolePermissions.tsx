import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell
} from "../ui/table";
import Swal from "sweetalert2";
import { getLockStatus, lockVariable, unlockVariable } from "../../services/lock/lockService";
import Select from "../form/Select";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../ui/button/Button";

interface UserInterface {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    personal_id_number: string;
    sex: string;
    born_place: string;
    born_date: string;
    living_location: string;
    project_role: number;
    citizenship: string;
    work_place: string;
    department: string;
    duty: string;
    main_education: string;
    additonal_education: string;
    scientific_degree: string;
    scientific_date: string;
    scientific_name: string;
    scientific_name_date: string;
    work_location: string;
    home_phone: string;
    personal_mobile_number: string;
    work_phone: string;
    personal_email: string;
    work_email: string;
    image?: string;
    institution_code?: string;
};

type AllUsersFilterProps = {
    filters: {
        name?: string;
        surname?: string;
        finKod?: string;
    };
};

export default function RolePermissions({ filters }: AllUsersFilterProps) {
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("");
    const [loadingRows, setLoadingRows] = useState<{ [finKod: string]: boolean }>({});
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [lockStatus, setLockStatus] = useState<boolean>(false);

    const roleOptions = [
        {
            value: "0",
            label: "Layihə rəhbəri"
        }, {
            value: "1",
            label: "Layihə icraçısı"
        }, {
            value: "2",
            label: "Admin"
        }
    ];

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        params.append(key, String(value));
                    }
                });
                const response = await apiClient.get(`api/users/all?${params.toString()}`);
                setUsers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch collaborators:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        // Fetch lock status on mount
        const fetchLockStatus = async () => {
            try {
                const response = await getLockStatus();
                setLockStatus(response.locked);
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchLockStatus();
    }, [filters, lockStatus]);

    const handleLockToggle = async () => {
        try {
            if (lockStatus) {
                await unlockVariable();
                Swal.fire("Sistem açıldı!", "", "success");
                setLockStatus(false);
            } else {
                await lockVariable();
                Swal.fire("Sistem kilidləndi!", "", "success");
                setLockStatus(true);
            }
        } catch (err) {
            Swal.fire("Server xətası!", "", "error");
        }
    };

    const handleRoleUpdate = async (finKod: string, projectRole: number) => {
        setLoadingRows(prev => ({ ...prev, [finKod]: true }));
        try {
            const response = await apiClient.post(`/auth/${finKod}/update/role/${+projectRole}`);
            if (response.status === 200) {
                Swal.fire("Yeni rol uğurla təyin edildi!", "", "success").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            } else if (response.status === 404) {
                Swal.fire("İstifadəçi mövcud deyil!", "", "error").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            } else {
                Swal.fire("Server xətası!", "", "error").then(() => {
                    setLoadingRows(prev => ({ ...prev, [finKod]: false }));
                });
            }
        } catch (err) {
            Swal.fire("Server xətası!", "", "error").then(() => {
                setLoadingRows(prev => ({ ...prev, [finKod]: false }));
            });
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
                <Button onClick={handleLockToggle} className={lockStatus ? "bg-red-500" : "bg-green-500"}>
                    {lockStatus ? "Unlock" : "Lock"}
                </Button>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-[30px]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ad, Soyad, Ata adı (Fin Kod)
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
                                    Təsdiq et
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {users.map((user, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {user.name} {user.surname} {user.father_name} {user.fin_kod}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {/* {user.project_role === 0 ? "Layihə rəhbəri" : user.project_role === 2 ? "Admin" : "Layihə icraçısı"} */}
                                            <Select
                                                options={roleOptions}
                                                placeholder={user.project_role === 0 ? "Layihə rəhbəri" : user.project_role === 2 ? "Admin" : "Layihə icraçısı"}
                                                onChange={handleRoleChange}
                                                className="dark:bg-dark-900 w-[100px]"
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/user-view/${user.fin_kod}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]" onClick={() => handleRoleUpdate(user.fin_kod, +selectedRole)}>
                                                {loadingRows[user.fin_kod] ? (
                                                    <CircularProgress style={{ width: 24, height: 24, color: 'white' }} />
                                                ) : (
                                                    <DoneIcon
                                                        className="text-white cursor-pointer"
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
