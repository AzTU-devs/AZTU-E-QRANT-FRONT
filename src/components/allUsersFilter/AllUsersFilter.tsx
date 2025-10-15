import Label from "../form/Label";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';

type AllUsersFilterProps = {
    onChange: (filters: {
        name?: string;
        surname?: string;
        fatherName?: string;
        finKod?: string;
        faculty_code?: string;
        cafedra_code?: string;
    }) => void;
};


export default function AllUsersFilter({ onChange }: AllUsersFilterProps) {
    const [name, setName] = useState("");
    const [finKod, setFinKod] = useState("");
    const [surname, setSurname] = useState("");
    const [filter, setFilter] = useState(false);

    const toggleFilter = async () => {
        setFilter(prev => !prev);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onChange({
            name,
            surname,
            finKod
        });
    };

    return (
        <>
            <div>
                <div
                    style={{
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        color: "rgba(0, 0, 0, 0.4)",
                        marginBottom: 10,
                        cursor: "pointer"
                    }}
                    onClick={toggleFilter}>
                    <FilterListIcon />
                </div>
                {filter ? (
                    <form action="" onSubmit={handleSubmit} className="flex">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4 w-full">
                            <div>
                                <Label>Ad</Label>
                                <Input type="text" value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Ad" />
                            </div>

                            <div>
                                <Label>Soyad</Label>
                                <Input type="text" value={surname} onChange={(e) => { setSurname(e.target.value) }} placeholder="Soyad" />
                            </div>

                            <div>
                                <Label>Fin kod</Label>
                                <Input
                                    type="text"
                                    value={finKod}
                                    maxLength={7}
                                    onChange={(e) => {
                                        const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                                        setFinKod(cleanedValue);
                                    }}
                                    placeholder="Fin Kod"
                                />
                            </div>
                        </div>
                        <div className="mt-[10px]">
                            <Button>
                                Filter
                            </Button>
                        </div>
                    </form>
                ) : null}
            </div>
        </>
    )
}
