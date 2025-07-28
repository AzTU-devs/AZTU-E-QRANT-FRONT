import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import apiClient from "../../util/apiClient";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningImage from "../../../public/warning.png";
import CircularProgress from "@mui/material/CircularProgress";

interface RentItem {
    id?: number;
    project_code: number;
    rent_area: string;
    unit_of_measure: string;
    unit_price: number;
    quantity: number;
    duration: number;
    total_amount: number;
}

export default function SmetaExpenses({ projectCode }: { projectCode: Number | null }) {
    const [rents, setRents] = useState<RentItem[]>([]);
    const [rentArea, setRentArea] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [duration, setDuration] = useState(0);
    const totalAmount = unitPrice * quantity * duration;
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<RentItem>>({});

    useEffect(() => {
        async function fetchRents() {
            try {
                const response = await apiClient.get(`/api/get-rent-all-tables/${projectCode}`);
                setRents(response.data);
            } catch (error) {
                console.error("Failed to fetch rents", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRents();
    }, [projectCode]);

    const location = useLocation();

    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname]);

    const handleSubmit = async () => {
        try {
            const response = await apiClient.post("/api/rent", {
                project_code: projectCode,
                rent_area: rentArea,
                unit_of_measure: unitOfMeasure,
                unit_price: unitPrice,
                quantity,
                duration,
                total_amount: totalAmount,
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: "Məlumat uğurla yadda saxlanıldı",
                });
                window.location.reload();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Xəta!",
                    text: "Xəta baş verdi",
                });
                window.location.reload();
            }
        } catch (error: any) {
            await Swal.fire({
                icon: "error",
                title: "Xəta!",
                text: "Sorğu alınmadı",
            });
            window.location.reload();
        }
    };

    const handleDelete = async (projectCode: number, id: number) => {
        try {
            const response = await apiClient.delete(`/api/delete-rent-table/${projectCode}/${id}`);
            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: "Məlumat silindi.",
                });
                window.location.reload();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Xəta!",
                    text: "Silinmə zamanı xəta baş verdi.",
                });
            }
        } catch (error: any) {
            await Swal.fire({
                icon: "error",
                title: "Xəta!",
                text: "Sorğu alınmadı",
            });
        };
    };

    const handleEditClick = (rent: RentItem) => {
        setEditingId(rent.id || null);
        setEditForm({
            rent_area: rent.rent_area,
            unit_of_measure: rent.unit_of_measure,
            unit_price: rent.unit_price,
            quantity: rent.quantity,
            duration: rent.duration,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (field: keyof RentItem, value: string | number) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        try {
            const payload = {
                id: editingId,
                rent_area: editForm.rent_area,
                unit_of_measure: editForm.unit_of_measure,
                unit_price: editForm.unit_price,
                quantity: editForm.quantity,
                duration: editForm.duration,
            };
            const response = await apiClient.patch(`/api/edit-rent-table/${projectCode}`, payload);
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: "Məlumat yeniləndi",
                });
                // Update local rents state with updated rent
                setRents((prevRents) =>
                    prevRents.map((r) =>
                        r.id === editingId ? { ...r, ...response.data.data } : r
                    )
                );
                setEditingId(null);
                setEditForm({});
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xəta!",
                    text: "Yeniləmə zamanı xəta baş verdi",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Xəta!",
                text: "Sorğu alınmadı",
            });
        }
    };

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
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                İcarəyə götürüləcək daşınar və daşınmaz əmlakın adı*
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Ölçü vahidi
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Vahidin qiyməti (manat)
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Miqdarı
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Müddət (ay)
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Cəmi məbləğ (manat)
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Təsdiq et
                            </TableCell>
                            {(projectRole === 0 && !viewOnly && pathname === "/project-smeta-expences") && (
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Əməliyyatlar
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {rents.map((rent) => {
                            const isEditing = rent.id === editingId;
                            const calcTotal =
                                (isEditing
                                    ? (editForm.unit_price || 0) *
                                    (editForm.quantity || 0) *
                                    (editForm.duration || 0)
                                    : rent.total_amount) || 0;

                            return (
                                <TableRow key={rent.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={editForm.rent_area || ""}
                                                onChange={(e) =>
                                                    handleEditChange("rent_area", e.target.value)
                                                }
                                                placeholder="Ərazi"
                                            />
                                        ) : (
                                            rent.rent_area
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={editForm.unit_of_measure || ""}
                                                onChange={(e) =>
                                                    handleEditChange("unit_of_measure", e.target.value)
                                                }
                                                placeholder="Ölçü vahidi"
                                            />
                                        ) : (
                                            rent.unit_of_measure
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editForm.unit_price || 0}
                                                onChange={(e) =>
                                                    handleEditChange("unit_price", Number(e.target.value))
                                                }
                                                placeholder="Qiymət"
                                            />
                                        ) : (
                                            rent.unit_price
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editForm.quantity || 0}
                                                onChange={(e) =>
                                                    handleEditChange("quantity", Number(e.target.value))
                                                }
                                                placeholder="Miqdar"
                                            />
                                        ) : (
                                            rent.quantity
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editForm.duration || 0}
                                                onChange={(e) =>
                                                    handleEditChange("duration", Number(e.target.value))
                                                }
                                                placeholder="Müddət"
                                            />
                                        ) : (
                                            rent.duration
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {calcTotal}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block" style={{textAlign: "center"}}>
                                            Təsdiq olunub
                                        </p>
                                    </TableCell>
                                    {(projectRole === 0 && !viewOnly) && (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 space-x-1">
                                            {isEditing && pathname === "/project-smeta-expences" ? (
                                                <>
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        title="Yadda saxla"
                                                        className="bg-green-500 p-1 rounded text-white"
                                                    >
                                                        <SaveIcon />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        title="Ləğv et"
                                                        className="bg-red-500 p-1 rounded text-white"
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                </>
                                            ) : pathname === "/project-smeta-expences" ?(
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(rent)}
                                                        title="Redaktə et"
                                                        className="bg-blue-500 p-1 rounded text-white"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rent.project_code, rent.id!)}
                                                        title="Sil"
                                                        className="bg-red-500 p-1 rounded text-white"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </>
                                            ) : null}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                        {projectRole === 0 && !viewOnly && pathname === "/project-smeta-expences" ? (
                            <TableRow>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Input
                                        type="text"
                                        value={rentArea}
                                        onChange={(e) => setRentArea(e.target.value)}
                                        placeholder="Ərazi"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Input
                                        type="text"
                                        value={unitOfMeasure}
                                        onChange={(e) => setUnitOfMeasure(e.target.value)}
                                        placeholder="Ölçü vahidi"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Input
                                        type="number"
                                        value={unitPrice}
                                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                                        placeholder="Qiymət"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder="Miqdar"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        placeholder="Müddət"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {totalAmount}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div
                                        onClick={handleSubmit}
                                        className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                        title="Təsdiq et"
                                    >
                                        <DoneIcon className="text-white" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                    <TableFooter className="border-t border-gray-700 divide-y divide-gray-100 dark:divide-white/[0.05]">
                        <TableRow>
                            <TableCell
                                isHeader
                                colSpan={6}
                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                Cəm
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                                {rents.reduce((sum, r) => sum + r.total_amount, 0)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}