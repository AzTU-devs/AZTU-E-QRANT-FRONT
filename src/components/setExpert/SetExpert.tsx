import Swal from "sweetalert2";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import apiClient from "../../util/apiClient";

export default function SetExpert() {
    const location = useLocation();
    const project = location.state?.project;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [experts, setExperts] = useState<{ value: string; label: string }[]>([]);
    const [selectedExpert, setSelectedExpert] = useState<string>("");
    const [priotetName, setPriotetName] = useState("");

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const response = await apiClient.get("/api/experts");
                const data = response.data?.data || [];

                console.log(data);

                setExperts(
                    data.map((exp: any) => ({
                        value: exp.email,
                        label: `${exp.name} ${exp.surname} (${exp.email})`
                    }))
                );

                if (response.data.status === 200) {
                    Swal.fire({
                                        icon: 'success',
                                        title: 'Ekspert uğurla təyin edildi!',
                                        confirmButtonText: 'OK'
                                    });
                } else {
                     Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
                }
            } catch (err) {
                console.error("Failed to fetch experts", err);
            }
        };
        fetchExperts();
        const getPrioritetName = async () => {
            try {
                const response = await apiClient.get(`/api/priotet/${project?.priotet}`);
                const data = response.data?.priotet_name;

                setPriotetName(data);
            } catch (err) {
                console.error("Failed to fetch experts", err);
            };
        };
        getPrioritetName();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await apiClient.post("/api/set-expert", {
                email: selectedExpert,
                project_code: project?.project_code
            });
            setSuccess(true);
        } catch (err: any) {
            console.error("Failed to set expert", err);
            setError("Ekspert əlavə edilə bilmədi.");
        } finally {
            setLoading(false);
        }
    };
    console.log(priotetName);
    
    
    return (
        <>
        <div>
            <p className="text-gray-700 dark:text-gray-300">
                Layihə rəhbəri: {project?.user.name} {project?.user.surname} ({project?.fin_kod})
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                Layihə adı: {project?.project_name}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
                Layihə prioteti: {priotetName}
            </p>
        </div>
            <form className="space-y-6 mx-auto w-full mt-[20px]" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                    <div style={{ width: "calc((100% / 3) - 10px)" }}>
                        <Label>Ekspert</Label>
                        <Select
                            options={experts}
                            onChange={(value: any) => setSelectedExpert(value ?? "")}
                            placeholder="Ekspert seçin" />
                    </div>
                </div>
                <div className="w-full flex justify-start items-start">
                    <Button className="w-[200px]" size="sm">
                        {loading ? "Yüklənir..." : "Eksperti əlavə et"}
                    </Button>
                </div>
            </form>
        </>
    );
};