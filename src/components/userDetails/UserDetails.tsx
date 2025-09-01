import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DatePicker from "../form/date-picker";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import FileInput from "../form/input/FileInput";
import Profile from "../../../public/profile.webp";
import PhoneInput from "../form/group-input/PhoneInput";
import CircularProgress from "@mui/material/CircularProgress";
import { setGlobalProfilCompleted } from "../../redux/slices/authSlice";

interface UserDetailsFormData {
    name: string;
    surname: string;
    father_name: string;
    fin_kod: string;
    personal_id_number: string;
    sex: string;
    born_place: string;
    born_date: string;
    living_location: string;
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
}

export default function UserDetails({ fin_kod }: { fin_kod: string | undefined | null }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const options = [
        { value: "0", label: "Kişi" },
        { value: "1", label: "Qadın" },
    ];

    const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);

    const [instituteName, setInstituteName] = useState("");

    const [formData, setFormData] = useState<UserDetailsFormData>({
        name: "",
        surname: "",
        father_name: "",
        fin_kod: "",
        personal_id_number: "",
        sex: "",
        born_place: "",
        born_date: "",
        living_location: "",
        citizenship: "",
        work_place: "",
        department: "",
        duty: "",
        main_education: "",
        additonal_education: "",
        scientific_degree: "",
        scientific_date: "",
        scientific_name: "",
        scientific_name_date: "",
        work_location: "",
        home_phone: "",
        personal_mobile_number: "",
        work_phone: "",
        personal_email: "",
        work_email: "",
    });
    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            sex: value,
        });
    };
    const handlePersonalPhoneNumberChange = (phoneNumber: string) => {
        setFormData({
            ...formData,
            personal_mobile_number: phoneNumber,
            home_phone: phoneNumber,
            work_phone: phoneNumber
        });
    };


    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('FormData values:', formData);

        const requiredFields: (keyof UserDetailsFormData)[] = [
            "name", "surname", "father_name", "personal_id_number", "sex", "born_place",
            "living_location", "citizenship", "work_place", "department", "duty", "main_education",
            "additonal_education", "scientific_degree", "scientific_name",
            "scientific_name_date",
            "personal_email", "born_date"
        ];

        const emptyFields = requiredFields.filter(field => {
            const value = formData[field];
            return !value || value.toString().trim() === "";
        });

        if (emptyFields.length > 0 || !image) {
            const formattedFieldNames = emptyFields
                .map(field => `• ${field.replace(/_/g, " ")}`)
                .join("<br>");

            const imageWarning = !image ? "<br>• şəkil" : "";

            Swal.fire({
                icon: "warning",
                title: "Aşağıdakı sahələr doldurulmalıdır:",
                html: formattedFieldNames + imageWarning,
                confirmButtonText: "Bağla"
            });

            return;
        }

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            if (image) {
                data.append("image", image);
            }

            console.log(data);


            await apiClient.post("/api/approve/profile", data);

            Swal.fire({
                icon: "success",
                title: "Profil uğurla göndərildi!",
                confirmButtonText: "OK"
            });
            dispatch(setGlobalProfilCompleted(1));

            navigate("/home");
        } catch (error: unknown) {
            let errorMessage = "Bilinməyən xəta";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: "error",
                title: "Xəta baş verdi",
                text: errorMessage
            });
        }
    };
    const [user, setUser] = useState<UserDetailsFormData | null>(null)
    const [loading, setLoading] = useState(true);
    console.log(user);

    useEffect(() => {
        apiClient.get(`/api/profile/${fin_kod}`)
            .then((res) => {
                setUser(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const userFinKod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            fin_kod: userFinKod ?? "Not given"
        }));
    }, [userFinKod]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            home_phone: "Not given"
        }));
    }, []);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            work_location:
                projectRole !== null
                    ? projectRole === 0
                        ? "Layihə rəhbəri"
                        : projectRole === 1
                            ? "Lahiyə icraçısı"
                            : "Not Given"
                    : "Not Given"
        }));
    }, [projectRole]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            work_email: prev.personal_email
        }));
    }, [formData.personal_email]);
    useEffect(() => {
        if (!user?.institution_code) return; // wait until user has institution_code

        const getInstitution = async () => {
            try {
                const response = await apiClient.get(`/api/institution/${user.institution_code}`);
                console.log(response);
                if (response.data.status === 200) {
                    setInstituteName(response.data.data);
                } else if (response.data.status === 404) {
                    setInstituteName("NOT FOUND");
                }
            } catch (error) {
                console.error("Failed to fetch institution:", error);
                setInstituteName("NOT FOUND");
            }
        };

        getInstitution();
    }, [user?.institution_code]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-full py-10">
                <CircularProgress />
            </div>
        );
    };


    return (
        <>
            {profileCompleted === 1 ? (
                <>
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mb-[50px]">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                    {user?.image ? (
                                        <div className="col-span-5 lg:col-span-1">
                                            <img
                                                src={`data:image/jpeg;base64,${user.image}`}
                                                alt="User"
                                                className="w-[100%] h-[100%] rounded-full object-cover border border-gray-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="col-span-5 lg:col-span-1">
                                            <img
                                                src={Profile}
                                                alt="User"
                                                className="w-[100%] h-[100%] rounded-full object-cover border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="order-3 xl:order-2">
                                    <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                        {user?.name} {user?.surname}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Şəxsi məlumatlar
                                </h4>

                                <div className="grid grid-cols-5 gap-5 lg:grid-cols-5 lg:gap-7 2xl:gap-x-32">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Soyad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.surname || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ata adı
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.father_name || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Fin kod
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.fin_kod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Şəxsiyyet vəsiqəsinin seriyası
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_id_number || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Cinsiyyət
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.sex !== undefined && user?.sex !== null
                                                ? user.sex === "0"
                                                    ? "Kişi"
                                                    : "Qadın"
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Doğum tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.born_date
                                                ? new Date(user.born_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Doğum yeri
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.born_place || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Vətandaşlıq
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.citizenship || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            İş yeri
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_place || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Şöbə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.department || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Vəzifə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.duty || ""}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Ali təhsil
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.main_education || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlavə Ali təhsil
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.additonal_education || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi dərəcə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_degree || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi dərəcənin tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_date
                                                ? new Date(user.scientific_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi ad
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_name || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Elmi adın verilmə tarixi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.scientific_name_date
                                                ? new Date(user.scientific_name_date).toISOString().split('T')[0].replace(/-/g, '/')
                                                : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Lahiyə rolu
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {projectRole === 0 ? "Layihə rəhbəri" : "Layihə icraçısı"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlaqə nömrəsi - şəxsi
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_mobile_number || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Əlaqə nömrəsi - koperativ
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_phone || ""}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Epoçt-Adres
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.personal_email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Epoçt- Adres - koperativ
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user?.work_email || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Müəssisə
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {instituteName ? instituteName : "sikdir"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-[100%] flex flex-col justify-center items-center p-[50px]">
                        <h1 className="text-[20px] text-center text-gray-400 dark:text-white/60 mb-10 mt-10">
                            Digər səhifələrə giriş icazəsi üçün bütün məlumatları doldurun və təsdiq edin!
                        </h1>
                        <form action="" onSubmit={(e) => handleSubmit(e)}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Ad</Label>
                                    {user?.name ? (
                                        <Input
                                            type="text"
                                            name="name"
                                            value={user?.name}
                                            readOnly
                                        />
                                    ) : <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />}
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Soyad</Label>
                                    {user?.surname ? (
                                        <Input
                                            type="text"
                                            name="surname"
                                            value={user?.surname}
                                            readOnly
                                        />
                                    ) : (
                                        <Input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Ata adı</Label>
                                    {user?.father_name ? (
                                        <Input
                                            type="text"
                                            name="father_name"
                                            value={user?.father_name}
                                            readOnly
                                        />
                                    ) : (
                                        <Input
                                            type="text"
                                            name="father_name"
                                            value={formData.father_name}
                                            required
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Fin kod</Label>
                                    <Input
                                        type="text"
                                        name="fin_kod"
                                        value={formData.fin_kod}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Doğum tarixi</Label>
                                    <DatePicker
                                        id="birth-date-picker"
                                        value={formData.born_date}
                                        placeholder="Tarix seçin"
                                        onChange={(dates, currentDateString) => {
                                            console.log(dates);

                                            setFormData(prev => ({
                                                ...prev,
                                                born_date: currentDateString
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Şəxsiyyət vəsiqəsinin seriyası</Label>
                                    <Input
                                        maxLength={10}
                                        type="text"
                                        name="personal_id_number"
                                        value={formData.personal_id_number}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Cinsiyyət</Label>
                                    <Select
                                        options={options}
                                        placeholder="Cinsiyyət seçin"
                                        onChange={handleSelectChange}
                                        className="dark:bg-dark-900"
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Doğum yeri</Label>
                                    <Input
                                        type="text"
                                        name="born_place"
                                        value={formData.born_place}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Yaşayış yeri</Label>
                                    <Input
                                        type="text"
                                        name="living_location"
                                        value={formData.living_location}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Vətəndaşlıq</Label>
                                    <Input
                                        type="text"
                                        name="citizenship"
                                        value={formData.citizenship}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>İş yeri</Label>
                                    <Input
                                        type="text"
                                        name="work_place"
                                        value={formData.work_place}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Şöbə</Label>
                                    <Input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Vəzifə</Label>
                                    <Input
                                        type="text"
                                        name="duty"
                                        value={formData.duty}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Ali təhsil</Label>
                                    <Input
                                        type="text"
                                        name="main_education"
                                        value={formData.main_education}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Əlavə ali təhsil</Label>
                                    <Input
                                        type="text"
                                        name="additonal_education"
                                        value={formData.additonal_education}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Elmi dərəcə</Label>
                                    <Input
                                        type="text"
                                        name="scientific_degree"
                                        value={formData.scientific_degree}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Elmi dərəcənin tarixi</Label>
                                    <DatePicker
                                        id="scientific-date-picker"
                                        value={formData.scientific_date}
                                        placeholder="Tarix seçin"
                                        onChange={(dates, currentDateString) => {
                                            console.log(dates);

                                            setFormData(prev => ({
                                                ...prev,
                                                scientific_date: currentDateString
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Elmi ad</Label>
                                    <Input
                                        type="text"
                                        name="scientific_name"
                                        value={formData.scientific_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Elmi adın verilmə tarixi</Label>
                                    <DatePicker
                                        id="scientific-name-date-picker"
                                        value={formData.scientific_name_date}
                                        placeholder="Tarix seçin"
                                        onChange={(dates, currentDateString) => {
                                            console.log(dates);

                                            setFormData(prev => ({
                                                ...prev,
                                                scientific_name_date: currentDateString
                                            }));
                                        }}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Lahiyə rolu</Label>
                                    <Input
                                        type="text"
                                        name="work_location"
                                        value={formData.work_location}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Əlaqə nömrəsi-şəxsi</Label>
                                    <PhoneInput
                                        selectPosition="start"
                                        placeholder="+1 (555) 000-0000"
                                        onChange={handlePersonalPhoneNumberChange}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Epoçt-adres</Label>
                                    <Input
                                        type="text"
                                        name="personal_email"
                                        value={formData.personal_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1">
                                    <Label>Şəkil yüklə</Label>
                                    {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
                                    <FileInput className="custom-class" onChange={handleImageChange} />
                                </div>
                            </div>
                            <Button className="mt-10">
                                Təsdiq edin
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}