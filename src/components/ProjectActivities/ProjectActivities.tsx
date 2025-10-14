import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

interface Activity {
    id?: number;
    name: string;
    months: string[];
    created?: boolean;
    isEditing?: boolean;
}

interface ProjectActivity {
    id: number;
    activity_name: string;
    month: number;
    project_code: number;
    created_at: string;
    updated_at: string | null;
}

const ProjectActivitiesTable = ({ projectCode }: { projectCode: number }) => {
    const [activities, setActivities] = useState<Activity[]>(
        Array.from({ length: 15 }, (_, i) => ({
            name: "",
            months: [] as string[],
            created: false,
            isEditing: false
        }))
    );

    const [loading, setLoading] = useState(false);

    // ✅ Fetch existing activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await apiClient.get<{ message: string; activities: ProjectActivity[]; status_code: number }>(
                    `/api/project-activity/${projectCode}`
                );
                if (res.data.activities) {
                    const existing = res.data.activities.map((a) => ({
                        id: a.id,
                        name: a.activity_name,
                        months: [a.month.toString()],
                        created: true,
                        isEditing: false
                    }));
                    setActivities((prev) => [...existing, ...prev.slice(existing.length)]);
                }
            } catch (err) {
                console.error("Error fetching project activities:", err);
            }
        };
        fetchActivities();
    }, [projectCode]);

    // ✅ Handle name input
    const handleNameChange = (index: number, newName: string) => {
        setActivities((prev) =>
            prev.map((act, i) => (i === index ? { ...act, name: newName } : act))
        );
    };

    // ✅ Handle month selection (only one month per activity)
    const handleMonthChange = (index: number, selectedMonth: string) => {
        setActivities((prev) =>
            prev.map((act, i) =>
                i === index
                    ? {
                        ...act,
                        months: act.months.includes(selectedMonth)
                            ? act.months.filter((m) => m !== selectedMonth)
                            : [selectedMonth] // Only one month allowed per activity
                    }
                    : act
            )
        );
    };

    // ✅ Create activity (POST to Flask)
    const handleCreate = async (index: number) => {
        const activity = activities[index];
        if (!activity.name.trim() || activity.months.length === 0) {
            alert("Fəaliyyət adı və ay seçilməlidir!");
            return;
        }

        try {
            setLoading(true);
            await apiClient.post("/api/project-activity/create", {
                activity_name: activity.name,
                month: parseInt(activity.months[0]),
                project_code: projectCode
            });

            setActivities((prev) =>
                prev.map((act, i) =>
                    i === index ? { ...act, created: true } : act
                )
            );
        } catch (err) {
            console.error("Error creating activity:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Start editing an activity
    const handleEdit = (index: number) => {
        setActivities((prev) =>
            prev.map((act, i) => ({
                ...act,
                isEditing: i === index,
            }))
        );
    };

    // ✅ Save edited activity (PATCH to Flask)
    const handleSave = async (index: number) => {
        const activity = activities[index];
        if (!activity.name.trim() || activity.months.length === 0) {
            alert("Fəaliyyət adı və ay seçilməlidir!");
            return;
        }
        // Validate month is not used by other activities (excluding the current one)
        const selectedMonth = activity.months[0];
        const monthUsedByOther = activities.some(
            (act, i) => i !== index && act.months.includes(selectedMonth)
        );
        if (monthUsedByOther) {
            alert("Seçilmiş ay başqa bir fəaliyyət tərəfindən istifadə olunur!");
            return;
        }
        if (!activity.id) {
            alert("Fəaliyyətin ID-si tapılmadı.");
            return;
        }

        try {
            setLoading(true);
            await apiClient.patch(`/api/project-activity/update/${activity.id}`, {
                activity_name: activity.name,
                month: parseInt(selectedMonth),
            });

            setActivities((prev) =>
                prev.map((act, i) =>
                    i === index ? { ...act, created: true, isEditing: false } : act
                )
            );
        } catch (err) {
            console.error("Error updating activity:", err);
        } finally {
            setLoading(false);
        }
    };

    const selectedMonths = new Set(
        activities.flatMap((a) => a.months)
    );

    const isAnyEditing = activities.some((act) => act.isEditing);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Layihə Fəaliyyətləri (Proyekt kodu: {projectCode})
            </h2>

            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">Fəaliyyət</th>
                        {months.map((month) => (
                            <th key={month} className="border border-gray-300 px-4 py-2">
                                {month}
                            </th>
                        ))}
                        <th className="border border-gray-300 px-4 py-2">Əməliyyat</th>
                    </tr>
                </thead>

                <tbody>
                    {activities.map((activity, index) => {
                        const isSelectedByOther =
                            selectedMonths.has(activity.months[0]) &&
                            !activity.months.includes(activity.months[0]);
                        const disableInputs = isAnyEditing && !activity.isEditing;

                        return (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 text-center">{index + 1}</td>

                                <td className="border border-gray-300 p-2">
                                    <textarea
                                        value={activity.name}
                                        placeholder="Fəaliyyətin adını daxil edin"
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 h-20"
                                        disabled={disableInputs || (!activity.isEditing && activity.created)}
                                    />
                                </td>

                                {months.map((month) => {
                                    const isSelectedByOtherMonth =
                                        selectedMonths.has(month) && !activity.months.includes(month);
                                    return (
                                        <td key={month} className="border border-gray-300 text-center">
                                            <input
                                                type="checkbox"
                                                checked={activity.months.includes(month)}
                                                onChange={() => handleMonthChange(index, month)}
                                                disabled={
                                                    disableInputs ||
                                                    (!activity.isEditing && activity.created) ||
                                                    isSelectedByOtherMonth
                                                }
                                            />
                                        </td>
                                    );
                                })}

                                <td className="border border-gray-300 text-center">
                                    {!activity.created ? (
                                        <button
                                            onClick={() => handleCreate(index)}
                                            className="bg-green-600 hover:text-green-800 disabled:text-gray-400 rounded-[10px] p-[10px]"
                                            disabled={loading || isAnyEditing}
                                        >
                                            <DoneIcon className="text-white" />
                                        </button>
                                    ) : activity.isEditing ? (
                                        <button
                                            onClick={() => handleSave(index)}
                                            className="bg-green-600 hover:text-green-800 disabled:text-gray-400 rounded-[10px] p-[10px]"
                                            disabled={loading}
                                        >
                                            <DoneIcon className="text-white" />
                                        </button>
                                    ) : (
                                        <>
                                            <span className="text-gray-400 mr-2">✔️</span>
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] p-[10px]"
                                                disabled={isAnyEditing}
                                                title="Edit"
                                            >
                                                <EditIcon />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectActivitiesTable;