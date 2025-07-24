import Swal from "sweetalert2";
import { useState } from "react";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";

export default function NewExpert() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [personalIdSerialNumber, setPersonalIdSerialNumber] = useState("");
    const [workPlace, setWorkPlace] = useState("");
    const [duty, setDuty] = useState("");
    const [scientificDegree, setScientificDegree] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.post("/api/create-expert", {
                email,
                name,
                surname,
                father_name: fatherName,
                personal_id_serial_number: personalIdSerialNumber,
                work_place: workPlace || null,
                duty: duty || null,
                scientific_degree: scientificDegree || null,
                phone_number: phoneNumber || null,
            });
            Swal.fire({
                icon: "success",
                title: "Ekspert uğurla əlavə edildi!",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire({
                icon: "warning",
                title: "Xəta",
            });
        } finally {
            setLoading(false);
        }
    };

    // Disable submit if any required field is empty
    const isDisabled =
        loading ||
        !email.trim() ||
        !name.trim() ||
        !surname.trim() ||
        !fatherName.trim() ||
        !personalIdSerialNumber.trim();

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mx-auto w-full">
            <div className="w-full flex justify-between items-center">
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>
                        Ad <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ad daxil edin"
                        required
                    />
                </div>
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>
                        Soyad <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Soyad daxil edin"
                        required
                    />
                </div>
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>
                        Ata adı <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="Ata adını daxil edin"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>
                        Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email daxil edin"
                        required
                    />
                </div>
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>
                        Şəxsiyyət vəsiqəsinin seriya nömrəsi <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={personalIdSerialNumber}
                        onChange={(e) => setPersonalIdSerialNumber(e.target.value)}
                        placeholder="Şəxsiyyət vəsiqəsinin seriya nömrəsi"
                        required
                    />
                </div>

                {/* Optional fields */}
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>İş yeri</Label>
                    <Input
                        value={workPlace}
                        onChange={(e) => setWorkPlace(e.target.value)}
                        placeholder="İş yerinizi daxil edin"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>Vəzifə</Label>
                    <Input
                        value={duty}
                        onChange={(e) => setDuty(e.target.value)}
                        placeholder="Vəzifənizi daxil edin"
                    />
                </div>

                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>Elmi dərəcə</Label>
                    <Input
                        value={scientificDegree}
                        onChange={(e) => setScientificDegree(e.target.value)}
                        placeholder="Elmi dərəcəni daxil edin"
                    />
                </div>

                <div style={{ width: "calc((100% / 3) - 10px)" }}>
                    <Label>Telefon nömrəsi</Label>
                    <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Telefon nömrəsi"
                    />
                </div>
            </div>

            <div className="w-full flex justify-center items-center">
                <Button className="w-[200px]" size="sm" disabled={isDisabled}>
                    {loading ? "Yüklənir..." : "Eksperti əlavə et"}
                </Button>
            </div>
        </form>
    );
}