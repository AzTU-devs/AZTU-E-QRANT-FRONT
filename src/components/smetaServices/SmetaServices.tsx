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
import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningImage from "../../../public/warning.png";
import CircularProgress from "@mui/material/CircularProgress";

interface ServiceItem {
    id: number;
    project_code: number;
    fin_code?: string;
    services_name: string;
    unit_of_measure: string;
    price: number;
    quantity: number;
    total_amount: number;
}

export default function SmetaServices({ projectCode }: { projectCode: Number | null }) {
    const [servicesName, setServicesName] = useState('');
    const [unitOfMeasure, setUnitOfMeasure] = useState('');
    const [price, setPrice] = useState<number | ''>(0);
    const [quantity, setQuantity] = useState<number | ''>(0);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;

    const [editInputs, setEditInputs] = useState<{
        services_name: string;
        unit_of_measure: string;
        price: string;
        quantity: string;
    }>({
        services_name: '',
        unit_of_measure: '',
        price: '',
        quantity: '',
    });

    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    const location = useLocation();
    const [viewOnly, setViewOnly] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.startsWith("/project-view/")) {
            setViewOnly(true);
        }
    }, [location.pathname]);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get(`/api/get-services/${projectCode}`);
            setServices(response.data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [projectCode]);

    const handleSubmit = async () => {
        // Validation before sending request
        if (
            !servicesName.trim() ||
            !unitOfMeasure.trim() ||
            price === '' ||
            quantity === '' ||
            Number(price) <= 0 ||
            Number(quantity) <= 0
        ) {
            await Swal.fire({
                icon: 'warning',
                title: 'Diqqət!',
                text: 'Bütün xanalari doldurun və qiymət/miqdarı 0-dan böyük daxil edin.',
                confirmButtonText: 'Bağla'
            });
            return;
        }

        try {
            const response = await apiClient.post('/api/add-services', {
                project_code: projectCode,
                services_name: servicesName,
                unit_of_measure: unitOfMeasure,
                price,
                quantity,
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Uğurlu!',
                    text: "Məlumat uğurla yadda saxlanıldı"
                });
                setServicesName('');
                setUnitOfMeasure('');
                setPrice(0);
                setQuantity(0);
                await fetchServices();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta!',
                    text: 'Xəta baş verdi yenidən cəhd edin',
                });
            }
        } catch (err: any) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Sorğu alınmadı',
            });
        }
    };

    const handleDelete = async (projectCode: number, id: number) => {
        try {
            const response = await apiClient.delete(`/api/delete-services/${projectCode}/${id}`);
            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Uğurlu!",
                    text: "Məlumat silindi",
                });
                await fetchServices();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Xəta!",
                    text: "Silinmə zamanı xəta baş verdi",
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

    const handleEditClick = (service: ServiceItem) => {
        setEditingId(service.id);
        setEditInputs({
            services_name: service.services_name,
            unit_of_measure: service.unit_of_measure,
            price: service.price.toString(),
            quantity: service.quantity.toString(),
        });
    };

    const handleEditChange = (field: keyof typeof editInputs, value: string) => {
        setEditInputs((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async (id: number) => {
        try {
            const response = await apiClient.patch(`/api/update-services/${projectCode}`, {
                id,
                services_name: editInputs.services_name,
                unit_of_measure: editInputs.unit_of_measure,
                price: parseFloat(editInputs.price),
                quantity: parseFloat(editInputs.quantity),
            });

            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Yeniləndi!',
                    text: 'Məlumat uğurla yeniləndi',
                });
                setEditingId(null);
                await fetchServices();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Xəta!',
                    text: 'Məlumatı yeniləmək mümkün olmadı',
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: 'Sorğu alınmadı',
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

    const totalAmount = services.reduce((sum, item) => sum + item.total_amount, 0);

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
                                    İş və xidmətlərin adları*
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
                                    Cəmi məbləğ {'(manat)'}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Tesdiq et
                                </TableCell>
                                {projectRole === 0 && !viewOnly && pathname === "/project-smeta-services" ? (
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
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingId === service.id && !viewOnly ? (
                                            <Input
                                                value={editInputs.services_name}
                                                onChange={(e) => handleEditChange("services_name", e.target.value)}
                                            />
                                        ) : (
                                            service.services_name
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingId === service.id && !viewOnly ? (
                                            <Input
                                                value={editInputs.unit_of_measure}
                                                onChange={(e) => handleEditChange("unit_of_measure", e.target.value)}
                                            />
                                        ) : (
                                            service.unit_of_measure
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingId === service.id && !viewOnly ? (
                                            <Input
                                                type="number"
                                                value={editInputs.price}
                                                onChange={(e) => handleEditChange("price", e.target.value)}
                                            />
                                        ) : (
                                            service.price.toFixed(2)
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {editingId === service.id && !viewOnly ? (
                                            <Input
                                                type="number"
                                                value={editInputs.quantity}
                                                onChange={(e) => handleEditChange("quantity", e.target.value)}
                                            />
                                        ) : (
                                            service.quantity
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {service.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <p className="bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100 px-2 py-1 rounded-[20px] inline-block" style={{ textAlign: "center" }}>
                                            Təsdiq olunub
                                        </p>
                                    </TableCell>
                                    {projectRole === 0 && !viewOnly ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {editingId === service.id ? (
                                                <div
                                                    className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                    title="Yadda saxla"
                                                    onClick={() => handleSaveEdit(service.id)}
                                                >
                                                    <DoneIcon className="text-white cursor-pointer" />
                                                </div>
                                            ) : pathname === "/project-smeta-services" ? (
                                                <>
                                                    <div
                                                        className="bg-blue-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px] mr-2"
                                                        title="Redaktə et"
                                                        onClick={() => handleEditClick(service)}
                                                    >
                                                        <EditIcon className="text-white cursor-pointer" />
                                                    </div>
                                                    <div
                                                        className="bg-red-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                                        title="Sil"
                                                        onClick={() => handleDelete(service.project_code, service.id!)}
                                                    >
                                                        <DeleteIcon className="text-white cursor-pointer" />
                                                    </div>
                                                </>
                                            ) : null}
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                            {projectRole === 0 && !viewOnly && pathname === "/project-smeta-services" ? (
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={servicesName}
                                            onChange={(e) => setServicesName(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                            placeholder="İş və xidmətlərin adları*"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="text"
                                            value={unitOfMeasure}
                                            onChange={(e) => setUnitOfMeasure(e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                            placeholder="Ölçü vahidi"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="number"
                                            step="any"
                                            value={price}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setPrice(val === '' ? '' : parseFloat(val));
                                            }}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                            placeholder="Vahidin qiyməti (manat)"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Input
                                            type="number"
                                            step="any"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setQuantity(val === '' ? '' : parseFloat(val));
                                            }}
                                            className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                            placeholder="Miqdar"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {+price * +quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div
                                            onClick={handleSubmit}
                                            className="bg-green-500 rounded-[10px] inline-flex items-center justify-center p-1 cursor-pointer w-[35px] h-[35px]"
                                        >
                                            <DoneIcon className="text-white cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
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
                                    {totalAmount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </>
    );
}           