import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from "../ui/table";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import WarningImage from "../../../public/warning.png";
import EditIcon from '@mui/icons-material/Edit';

interface SalaryData {
    id: number;
    project_code: number;
    fin_kod: string;
    salary_per_month: number;
    months: number;
    total_salary: number;
}

interface Owner {
    name?: string;
    surname?: string;
    father_name?: string;
    fin_kod?: string;
    salary?: SalaryData | null;
}

interface Collaborator {
    name?: string;
    surname?: string;
    father_name?: string;
    fin_kod?: string;
    salary?: SalaryData | null;
}

export default function SmetaSalary({ projectCode }: { projectCode: Number | null }) {
    const [owner, setOwner] = useState<Owner>();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [ownerInputs, setOwnerInputs] = useState({ salary: "", months: "" });
    const [collabInputs, setCollabInputs] = useState<{ [finKod: string]: { salary: string, months: string } }>({});
    const [editingRow, setEditingRow] = useState<string | null>(null); // "owner" for owner row or fin_kod for collaborators
    const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);
    const location = useLocation();
    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await apiClient.get(`/api/salary/smeta/${projectCode}`);
                setOwner(response.data.project_owner);
                setCollaborators(response.data.collaborators);

                if (response.data.project_owner?.salary) {
                    setOwnerInputs({
                        salary: response.data.project_owner.salary.salary_per_month.toString(),
                        months: response.data.project_owner.salary.months.toString(),
                    });
                }

                const collabInitInputs: { [finKod: string]: { salary: string; months: string } } = {};
                response.data.collaborators.forEach((collab: Collaborator) => {
                    if (collab.salary && collab.fin_kod) {
                        collabInitInputs[collab.fin_kod] = {
                            salary: collab.salary.salary_per_month.toString(),
                            months: collab.salary.months.toString(),
                        };
                    }
                });
                setCollabInputs(collabInitInputs);

            } catch (error) {
                console.error("Failed to fetch salary data:", error);
            }
        };
        fetchSalaries();
    }, [projectCode]);

    const handleUpdateSalary = async (
        fin_kod: string,
        salary: string,
        months: string
    ) => {
        try {
            if (!projectCode) {
                throw new Error('Project code is missing');
            }

            if (!salary || !months) {
                throw new Error('Xidmət haqqı və müddət boş ola bilməz');
            }

            await apiClient.patch(`/api/edit-salary-table/${projectCode}`, {
                fin_kod,
                salary_per_month: Number(salary),
                months: Number(months),
            });

            await Swal.fire({
                icon: 'success',
                title: 'Yeniləndi!',
                text: 'Məlumat uğurla yeniləndi',
                confirmButtonText: 'OK',
            });

            setEditingRow(null);

            // Refresh data after update
            const response = await apiClient.get(`/api/salary/smeta/${projectCode}`);
            setOwner(response.data.project_owner);
            setCollaborators(response.data.collaborators);

        } catch (error: any) {
            console.error('Error updating salary:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: error?.message || 'Məlumatı yeniləmək mümkün olmadı',
                confirmButtonText: 'Bağla',
            });
        }
    };

    const totalAllSalaries = (owner?.salary?.total_salary || 0) + collaborators.reduce((sum, collaborator) => {
        return sum + (collaborator.salary?.total_salary || 0);
    }, 0);

    if (!profileCompleted) {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-[100px]">
                <img src={WarningImage} alt="warning" className="w-[70px] mb-[20px]" />
                <p style={{ fontSize: 25, marginBottom: 20 }}>Smeta yaratmaq üçün ilk öncə şəxsi məlumatlarınız doldurun və layihə yaradın.</p>
                <Link to={"/project-offer"}>
                    <Button>Layihə yaradın</Button>
                </Link>
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
                                    Ad, Soyad, Ata adı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihədə funksiyası
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Aylıq xidmət haqqı {'(manat)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Müddət {'(ay)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə üzrə ümumi xidmət haqqı
                                </TableCell>
                                {!viewOnly ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Əməliyyatlar
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {/* Owner Row */}
                            <TableRow>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.name} {owner?.surname} {owner?.father_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    Layihə rəhbəri
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {editingRow === "owner" && !viewOnly ? (
                                        <Input
                                            placeholder="Xidmət haqqı"
                                            value={ownerInputs.salary}
                                            onChange={(e) => setOwnerInputs({ ...ownerInputs, salary: e.target.value })}
                                            autoFocus
                                        />
                                    ) : (
                                        owner?.salary?.salary_per_month || ""
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {editingRow === "owner" && !viewOnly ? (
                                        <Input
                                            placeholder="Müddət"
                                            value={ownerInputs.months}
                                            onChange={(e) => setOwnerInputs({ ...ownerInputs, months: e.target.value })}
                                        />
                                    ) : (
                                        owner?.salary?.months || ""
                                    )}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.salary?.total_salary || ""}
                                </TableCell>
                                {!viewOnly ? (
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingRow === "owner" ? (
                                            <div
                                                className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title="Yadda saxla"
                                                onClick={() => handleUpdateSalary(owner?.fin_kod || "", ownerInputs.salary, ownerInputs.months)}
                                            >
                                                <DoneIcon className="text-white cursor-pointer" />
                                            </div>
                                        ) : (
                                            <div
                                                className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title="Redaktə et"
                                                onClick={() => {
                                                    if (owner?.salary) {
                                                        setOwnerInputs({
                                                            salary: owner.salary.salary_per_month.toString(),
                                                            months: owner.salary.months.toString(),
                                                        });
                                                    }
                                                    setEditingRow("owner");
                                                }}
                                            >
                                                <EditIcon className="text-white cursor-pointer" />
                                            </div>
                                        )}
                                    </TableCell>
                                ) : null}
                            </TableRow>
                            {/* Collaborators Rows */}
                            {collaborators.map((collaborator, index) => {
                                const finKod = collaborator.fin_kod || `collab-${index}`;
                                const isEditing = editingRow === finKod;
                                return (
                                    <TableRow key={finKod}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator?.name} {collaborator?.surname} {collaborator?.father_name}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Layihə iştirakçısı
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {isEditing && !viewOnly ? (
                                                <Input
                                                    placeholder="Xidmət haqqı"
                                                    value={collabInputs[finKod]?.salary || ""}
                                                    onChange={(e) =>
                                                        setCollabInputs({
                                                            ...collabInputs,
                                                            [finKod]: {
                                                                ...collabInputs[finKod],
                                                                salary: e.target.value,
                                                            }
                                                        })
                                                    }
                                                    autoFocus
                                                />
                                            ) : (
                                                collaborator.salary?.salary_per_month || ""
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {isEditing && !viewOnly ? (
                                                <Input
                                                    placeholder="Müddət"
                                                    value={collabInputs[finKod]?.months || ""}
                                                    onChange={(e) =>
                                                        setCollabInputs({
                                                            ...collabInputs,
                                                            [finKod]: {
                                                                ...collabInputs[finKod],
                                                                months: e.target.value,
                                                            }
                                                        })
                                                    }
                                                />
                                            ) : (
                                                collaborator.salary?.months || ""
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {collaborator.salary?.total_salary || ""}
                                        </TableCell>
                                        {!viewOnly ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {isEditing ? (
                                                    <div
                                                        className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                        title="Yadda saxla"
                                                        onClick={() =>
                                                            handleUpdateSalary(
                                                                finKod,
                                                                collabInputs[finKod]?.salary || "",
                                                                collabInputs[finKod]?.months || ""
                                                            )
                                                        }
                                                    >
                                                        <DoneIcon className="text-white cursor-pointer" />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                        title="Redaktə et"
                                                        onClick={() => {
                                                            setCollabInputs({
                                                                ...collabInputs,
                                                                [finKod]: {
                                                                    salary: collaborator.salary?.salary_per_month.toString() || "",
                                                                    months: collaborator.salary?.months.toString() || "",
                                                                }
                                                            });
                                                            setEditingRow(finKod);
                                                        }}
                                                    >
                                                        <EditIcon className="text-white cursor-pointer" />
                                                    </div>
                                                )}
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    colSpan={4}
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {totalAllSalaries}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    )
}