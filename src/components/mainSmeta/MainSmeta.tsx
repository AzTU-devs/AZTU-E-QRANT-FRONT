import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
} from "../ui/table";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import Button from "../ui/button/Button";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from "@mui/icons-material/Done";
import ErrorImage from "../../../public/error.png";
import CircularProgress from "@mui/material/CircularProgress";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";

interface MainSmeta {
    total_other_smeta?: number,
    total_rent_smeta?: number,
    total_salary_smeta?: number,
    total_services_smeta?: number,
    total_tools_smeta?: number,
    total_main_amount?: number,
    total_defense_fund?: number,
    total_tax?: number,
    max_amount_error?: boolean | null
}

export default function MainSmeta({ projectCode }: { projectCode: Number | null }) {
    const [loading, setLoading] = useState(true);
    const [taxEdit, setTaxEdit] = useState(false);
    const [socialEdit, setSocialEdit] = useState(false);
    const pathname = useLocation().pathname;
    // const deadline = useSelector((state: RootState) => state.deadline.submissionDeadline);

    const [mainSmeta, setMainSmeta] = useState<MainSmeta>({
        total_other_smeta: 0,
        total_rent_smeta: 0,
        total_salary_smeta: 0,
        total_services_smeta: 0,
        total_tools_smeta: 0,
        total_main_amount: 0,
        total_defense_fund: 0,
        total_tax: 0,
        max_amount_error: null
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get(`/api/main-smeta/${projectCode}`);
                setMainSmeta(response.data.data);
            } catch (error: any) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleSmetaUpdate = async (column: string, value: string | number) => {
        try {
            const response = await apiClient.patch(`/api/update-smeta-field/${projectCode}`, {
                column,
                value
            });

            if (response.data && response.data.data) {
                setMainSmeta((prev) => ({
                    ...prev,
                    [column]: value
                }));
                Swal.fire({
                    icon: "success",
                    title: "Düzəliş edildi!",
                    text: `Uğurla düzəliş edildi`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "No data returned from update response.",
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to update smeta field: ${error.message || error}`,
            });
        }
    };

    const exportToExcel = () => {
        const headers = ["Xərc maddələrinin adları", "Layihə üzrə cəmi", "birinci il üçün", "Ikinci il üçün"];
        const rows = [
            [
                "1. Layihə rəhbərinin və icraçıların xidmət haqları",
                mainSmeta.total_salary_smeta ?? 0
            ],
            [
                "2. Layihə üzrə vergilər və digər məcburi  ödənişlər",
                mainSmeta.total_tax
            ],
            [
                "3. Dövlət Sosial Müdafiə Fonduna ayırmalar",
                mainSmeta.total_defense_fund
            ],
            [
                "4. Avadanlıq, cihaz, qurğu və mal-materialların satınalınması*",
                mainSmeta.total_tools_smeta
            ],
            [
                "5. İşlərin və xidmətlərin satınalınması",
                mainSmeta.total_services_smeta ?? 0
            ],
            [
                "İcarə",
                mainSmeta.total_rent_smeta ?? 0
            ],
            [
                "Digər birbaşa xərclər",
                mainSmeta.total_other_smeta ?? 0
            ],
            [
                "Cəm",
                mainSmeta.total_main_amount
            ],
        ];
        const wsData = [headers, ...rows];
        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Main Smeta");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `${projectCode}_smeta.xlsx`);
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
            {mainSmeta.max_amount_error ? (
                <div className="flex justify-start items-center">
                    <img src={ErrorImage} alt="error" className="w-[50px] mr-[20px]" />
                    <p>Layihənizin smeta dəyəri müəyyən edilmiş maksimum məbləği (30,000 AZN) keçmişdir. Zəhmət olmasa, smetalarınızda müvafiq düzəlişlər edin.</p>
                </div>
            ) : null}
            {pathname === "/main-smeta" ? (
                <div className="my-[10px]">
                    <Button onClick={exportToExcel}>Excelə ixrac et</Button>
                </div>
            ) : null}
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >

                                    Xərc maddələrinin adları
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə üzrə cəmi

                                </TableCell>
                                {pathname === "/main-smeta" ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Düzəliş et
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    1. Layihə rəhbərinin və icraçıların xidmət haqları
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_salary_smeta}
                                </TableCell>

                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    2. Layihə üzrə vergilər və digər məcburi  ödənişlər
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {taxEdit && pathname === "/main-smeta" ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Vergi"
                                                value={String(mainSmeta.total_tax ?? "")}
                                                onChange={(e) =>
                                                    setMainSmeta((prev) => ({
                                                        ...prev,
                                                        total_tax: parseFloat(e.target.value)
                                                    }))
                                                }
                                                type="number"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {mainSmeta.total_tax ? (
                                                <p>{mainSmeta.total_tax}</p>
                                            ) : (
                                                <div>
                                                    <p className="bg-yellow-200 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                                                        Təyin edilməyib
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {taxEdit ? (
                                        <div
                                            onClick={() => {
                                                handleSmetaUpdate("total_fee", mainSmeta.total_tax ?? 0);
                                                setTaxEdit(false);
                                            }}
                                            className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[40px] h-[35px]"
                                            title="Təsdiq et"
                                        >
                                            <DoneIcon className="text-white" />
                                        </div>
                                    ) : pathname === "/main-smeta" ? (
                                        <div style={{
                                            borderRadius: 10,
                                            backgroundColor: "rgb(67, 88, 251)",
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer"
                                        }} onClick={
                                            () => {
                                                setTaxEdit(true);
                                            }
                                        }>
                                            <EditIcon style={{ color: "#fff" }} />
                                        </div>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    3.   Dövlət Sosial Müdafiə Fonduna ayırmalar
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {socialEdit ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Vergi"
                                                value={String(mainSmeta.total_defense_fund ?? "")}
                                                onChange={(e) =>
                                                    setMainSmeta((prev) => ({
                                                        ...prev,
                                                        total_defense_fund: parseFloat(e.target.value)
                                                    }))
                                                }
                                                type="number"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {mainSmeta.total_defense_fund ? (
                                                <p>{mainSmeta.total_defense_fund}</p>
                                            ) : (
                                                <div>
                                                    <p className="bg-yellow-200 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded-[20px] inline-block">
                                                        Təyin edilməyib
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {socialEdit ? (
                                        <div
                                            onClick={() => {
                                                handleSmetaUpdate("defense_fund", mainSmeta.total_defense_fund ?? 0);
                                                setSocialEdit(false);
                                            }}
                                            className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[40px] h-[40px]"
                                            title="Təsdiq et"
                                        >
                                            <DoneIcon className="text-white" />
                                        </div>
                                    ) : pathname === "/main-smeta" ? (
                                        <div style={{
                                            borderRadius: 10,
                                            backgroundColor: "rgb(67, 88, 251)",
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer"
                                        }} onClick={
                                            () => {
                                                setSocialEdit(true);
                                            }
                                        }>
                                            <EditIcon style={{ color: "#fff" }} />
                                        </div>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    4. Avadanlıq, cihaz, qurğu və mal-materialların satınalınması* (vergilər və digər məcburi ödənişlər daxil olmaqla)*
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_tools_smeta}
                                </TableCell>

                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    5.   İşlərin və xidmətlərin satınalınması (çatdırılma, quraşdırılma, sazlanma, sınaqdan keçirilmə, treninqlər və s.)
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_services_smeta}
                                </TableCell>

                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    İcarə
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_rent_smeta}
                                </TableCell>

                            </TableRow>
                            <TableRow >
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    Digər birbaşa xərclər
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {mainSmeta.total_other_smeta}
                                </TableCell>

                            </TableRow>
                        </TableBody>
                        <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {mainSmeta.total_main_amount}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div >
        </>
    )
}
