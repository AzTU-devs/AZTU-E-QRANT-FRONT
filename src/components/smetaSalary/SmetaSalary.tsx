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
import EditIcon from '@mui/icons-material/Edit';
import WarningImage from "../../../public/warning.png";
import CircularProgress from "@mui/material/CircularProgress";

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
    const [salaryPerMonth, setSalaryPerMonth] = useState<number>();
    const [months, setMonths] = useState<number>();
    const [editingRow, setEditingRow] = useState<string | null>(null); // "owner" for owner row or fin_kod for collaborators
    const location = useLocation();
    const [viewOnly, setViewOnly] = useState<boolean>(false);
    const projectCodeRedux = useSelector((state: RootState) => state.auth.projectCode);
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;

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
            } finally {
                setLoading(false);
            }
        };
        fetchSalaries();
    }, [projectCode]);

    const handleNewSalary = async (
        finKod: string,
        months: string,
        salary_per_month: string
    ) => {
        try {
            console.log(salaryPerMonth, months);
            
            const response = await apiClient.post("/api/create-salary-table", {
                salary_per_month: Number(salary_per_month),
                months: Number(months),
                fin_kod: finKod,
                project_code: projectCodeRedux
            });
            if (response.data.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Yeniləndi!',
                    text: 'Xidmət haqqı uğurla əlavə edildi',
                    confirmButtonText: 'OK',
                });
            }
        } catch (err) {
            return Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Məlumatı saxlamaq mümkün olmadı',
                confirmButtonText: 'Bağla',
            });
        }
    }
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

            window.location.reload();

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

    if (!projectCode) {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
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
                                {!viewOnly && pathname === "/project-smeta-salary" ? (
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
                                    ) : !owner?.salary?.salary_per_month ? (
                                         <Input
                                            placeholder="Xidmət haqqı"
                                            value={salaryPerMonth}
                                            onChange={(e) => setSalaryPerMonth(+e.target.value)}
                                            autoFocus
                                        />
                                    ) : owner?.salary?.salary_per_month}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {editingRow === "owner" && !viewOnly ? (
                                        <Input
                                            placeholder="Müddət"
                                            value={ownerInputs.months}
                                            onChange={(e) => setOwnerInputs({ ...ownerInputs, months: e.target.value })}
                                        />
                                    ) : !owner?.salary?.months ?(
                                        <Input
                                            placeholder="Müddət"
                                            value={months}
                                            onChange={(e) => setMonths(+e.target.value)}
                                        />
                                    ) : owner?.salary?.months}
                                </TableCell>
                                { owner?.salary ? (
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {owner?.salary?.total_salary || owner?.salary?.salary_per_month * owner?.salary?.months}
                                </TableCell>
                                ) : null}
                                {!viewOnly && owner?.salary ? (
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingRow === "owner" || !owner?.salary ? (
                                            <div
                                                className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title={owner?.salary ? "Yadda saxla" : "Yenisini yarat"}
                                                onClick={() => handleUpdateSalary(owner?.fin_kod || "", ownerInputs.salary, ownerInputs.months)}
                                            >
                                                <DoneIcon className="text-white cursor-pointer" />
                                            </div>
                                        ) : pathname === "/project-smeta-salary" ? (
                                            <div
                                                className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title="Redaktə et"
                                                onClick={() => {
                                                    setOwnerInputs({
                                                        salary: owner?.salary?.salary_per_month?.toString() || "",
                                                        months: owner?.salary?.months?.toString() || "",
                                                    });
                                                    setEditingRow("owner");
                                                }}
                                            >
                                                <EditIcon className="text-white cursor-pointer" />
                                            </div>
                                        ) : null}
                                    </TableCell>
                                ) : !owner?.salary ? (
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div
                                                className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                title={owner?.salary ? "Yadda saxla" : "Yenisini yarat"}
                                                onClick={() => handleNewSalary(owner?.fin_kod || "", ownerInputs.salary, ownerInputs.months)}
                                            >
                                                <DoneIcon className="text-white cursor-pointer" />
                                            </div>
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
                                            ) : collaborator.salary?.salary_per_month ? (
                                                <p>
                                                    {collaborator?.salary?.salary_per_month}
                                                </p>
                                            ) : (
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
                                            ) : collaborator.salary?.months ? (
                                                <p>{collaborator.salary.months}</p>
                                            ) : (
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
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {Number(collaborator.salary?.total_salary) || ""}
                                        </TableCell>
                                        {!viewOnly ? (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {(isEditing || !collaborator.salary) && pathname === "/project-smeta-salary" ? (
                                                    <div
                                                        className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                        title={collaborator.salary ? "Yadda saxla" : "Yenisini yarat"}
                                                        onClick={() => {
                                                            if (collaborator.salary) {
                                                                handleUpdateSalary(
                                                                    collaborator.fin_kod || "",
                                                                    collabInputs[finKod]?.salary || "",
                                                                    collabInputs[finKod]?.months || ""
                                                                );
                                                            } else {
                                                                handleNewSalary(collaborator.fin_kod || "", collabInputs[finKod]?.months || "", collabInputs[finKod]?.months || "");
                                                            }
                                                        }}
                                                    >
                                                        <DoneIcon className="text-white cursor-pointer" />
                                                    </div>
                                                ) : pathname === "/project-smeta-salary" ? (
                                                    <div
                                                        className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                        title="Redaktə et"
                                                        onClick={() => {
                                                            setCollabInputs({
                                                                ...collabInputs,
                                                                [finKod]: {
                                                                    salary: collaborator.salary?.salary_per_month?.toString() || "",
                                                                    months: collaborator.salary?.months?.toString() || "",
                                                                }
                                                            });
                                                            setEditingRow(finKod);
                                                        }}
                                                    >
                                                        <EditIcon className="text-white cursor-pointer" />
                                                    </div>
                                                ) : null}
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