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
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningImage from "../../../public/warning.png";
import CircularProgress from "@mui/material/CircularProgress";

interface OtherExpItem {
    id: number;
    project_code: number;
    expenses_name: string;
    unit_of_measure: string;
    unit_price: number;
    quantity: number;
    duration: number;
    total_amount: number;
}

export default function SmetaOther({ projectCode }: { projectCode: Number | null }) {
    const [otherExps, setOtherExps] = useState<OtherExpItem[]>([]);
    const [expensesName, setExpensesName] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [duration, setDuration] = useState(0);
    const totalAmount = unitPrice * quantity * duration;
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;

    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        async function fetchOtherExps() {
            try {
                const response = await apiClient.get(`/api/get-other_exp-all-tables/${projectCode}`);
                setOtherExps(response.data);
            } catch (error) {
                console.error("Failed to fetch other expenses", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOtherExps();
    }, [projectCode]);

    const handleSubmit = async () => {
        // Validation before sending request
        if (
            !expensesName.trim() ||
            !unitOfMeasure.trim() ||
            Number(unitPrice) <= 0 ||
            Number(quantity) <= 0 ||
            Number(duration) <= 0
        ) {
            await Swal.fire({
                icon: "warning",
                title: "Diqqət!",
                text: "Bütün xanalari doldurun və qiymət/miqdarı/müddəti 0-dan böyük daxil edin.",
                confirmButtonText: "Bağla"
            });
            return;
        }

        try {
            const response = await apiClient.post("/api/other_exp", {
                project_code: projectCode,
                expenses_name: expensesName,
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
            const response = await apiClient.delete(`/api/delete-other_exp-table/${projectCode}/${id}`);
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
        }
    };

    // Editing state for one row at a time
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<OtherExpItem>>({});

    const handleEditClick = (item: OtherExpItem) => {
        setEditingId(item.id);
        setEditForm({
            expenses_name: item.expenses_name,
            unit_of_measure: item.unit_of_measure,
            unit_price: item.unit_price,
            quantity: item.quantity,
            duration: item.duration,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (field: keyof OtherExpItem, value: string | number) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-10">
                <CircularProgress />
            </div>
        );
    }

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            const payload = {
                id: editingId,
                project_code: projectCode,
                expenses_name: editForm.expenses_name,
                unit_of_measure: editForm.unit_of_measure,
                unit_price: editForm.unit_price,
                quantity: editForm.quantity,
                duration: editForm.duration,
                total_amount:
                    (editForm.unit_price || 0) *
                    (editForm.quantity || 0) *
                    (editForm.duration || 0),
            };
            const response = await apiClient.patch(`/api/edit-other_exp-table/${editingId}`, payload);
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: "Məlumat yeniləndi",
                });
                setOtherExps((prev) =>
                    prev.map((item) =>
                        item.id === editingId ? { ...item, ...response.data.data } : item
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
                <p style={{ fontSize: 25, marginBottom: 20 }}>
                    Smeta yaratmaq üçün ilk öncə şəxsi məlumatlarınız doldurun və layihə yaradın.
                </p>
                <Link to={"/project-offer"}>
                    <Button>Layihə yaradın</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Xərc maddələrinin adı*
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Ölcü vahidi
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Vahidin qiyməti {'(manat)'}
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
                                    Müddət {'(ay)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Cəmi məbləğ {'(manat)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Təsdiq et
                                </TableCell>
                                {(projectRole === 0 && !viewOnly && pathname === "/project-smeta-other-expences") && (
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
                            {otherExps.map((item) => {
                                const isEditing = item.id === editingId;
                                const calcTotal =
                                    isEditing
                                        ? (editForm.unit_price || 0) *
                                        (editForm.quantity || 0) *
                                        (editForm.duration || 0)
                                        : item.total_amount;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    value={editForm.expenses_name || ""}
                                                    onChange={(e) =>
                                                        handleEditChange("expenses_name", e.target.value)
                                                    }
                                                    placeholder="Xərc maddəsinin adı"
                                                />
                                            ) : (
                                                item.expenses_name
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
                                                item.unit_of_measure
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
                                                    placeholder="Vahid qiyməti"
                                                />
                                            ) : (
                                                item.unit_price
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
                                                item.quantity
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
                                                item.duration
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {calcTotal}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block" style={{ textAlign: "center" }}>
                                                Təsdiq olunub
                                            </p>
                                        </TableCell>
                                        {(projectRole === 0 && !viewOnly) && (
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 space-x-1">
                                                {isEditing ? (
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
                                                ) : pathname === "/project-smeta-other-expences" ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            title="Redaktə et"
                                                            className="bg-blue-500 p-1 rounded text-white"
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (projectCode !== null)
                                                                    handleDelete(Number(projectCode), item.id);
                                                            }}
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
                            {projectRole === 0 && !viewOnly && pathname === "/project-smeta-other-expences" ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={expensesName}
                                            onChange={(e) => setExpensesName(e.target.value)}
                                            placeholder="Xərc maddəsinin adı"
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
                                            placeholder="Vahid qiyməti"
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
                                    colSpan={5}
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    Cəm
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                                >
                                    {otherExps.reduce((sum, item) => sum + item.total_amount, 0)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    );
}