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

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const response = await apiClient.get("/api/experts");
                const data = response.data?.data || [];
                setExperts(
                    data.map((exp: any) => ({
                        value: exp.email.toString(),
                        label: `${exp.name} ${exp.surname} (${exp.email})`
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch experts", err);
            }
        };
        fetchExperts();
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

    return (
        <>
            <div></div>
            <form className="space-y-6 mx-auto w-full" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                    <div style={{ width: "calc((100% / 3) - 10px)" }}>
                        <Label>Vəzifə</Label>
                        <Select options={experts} onChange={(val: any) => setSelectedExpert(val?.value ?? "")} />
                    </div>
                </div>

                {error && <p className="text-error-500">{error}</p>}
                {success && <p className="text-success-500">Ekspert uğurla əlavə edildi!</p>}

                <div className="w-full flex justify-center items-center">
                    <Button className="w-[200px]" size="sm">
                        {loading ? "Yüklənir..." : "Eksperti əlavə et"}
                    </Button>
                </div>
            </form>
        </>
    );
};