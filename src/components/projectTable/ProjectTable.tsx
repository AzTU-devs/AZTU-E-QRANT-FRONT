import {
    Table,
    TableCell,
    TableHeader,
    TableBody,
    TableRow
} from "../ui/table";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import { setGlobalIsCollaborator } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function ProjectTable() {
    const disptach = useDispatch();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const fin_kod = useSelector((state: RootState) => state.auth.fin_kod);
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const isCollaborator = useSelector((state: RootState) => state.auth.isCollaborator);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get('/api/projects');
                console.log(response.data.data);
                setProjects(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleBeCollaborator = async (fin_kod: string, project_code: string) => {
    const result = await Swal.fire({
        title: 'Əminsiniz?',
        text: 'Layihəyə iştirakçı olaraq qoşulmaq istədiyinizə əminsiniz? \n Təsdiqlədikdən sonra yalnız bir layihədə icraçı olursuz və layihə dəyişikliyi mümkün deyil.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Bəli, əminəm',
        cancelButtonText: 'Xeyr, imtina et'
    });

    if (!result.isConfirmed) return;

    try {
        const response = await apiClient.post('/api/be-collaborator', {
            fin_kod,
            project_code
        });

        if (response.data.status === 201) {
            disptach(setGlobalIsCollaborator(true));
            Swal.fire({
                icon: 'success',
                title: 'İştirakçı olaraq əlavə olundunuz!',
                text: "Təsdiq edildikdən sonra aktiv icraçı statusu əldə edəcəksiniz!",
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
        }

    } catch (error: any) {
        if (error.response?.status === 403) {
            Swal.fire({
                title: 'Xəta!',
                text: 'Layihəni təsdiq etmək üçün ilk növbədə şəxsi məlumatlarınızı təmin etməlisiniz!',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Şəxsi məlumatlara keç',
                cancelButtonText: 'Bağla'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = `/user-details/${fin_kod}`;
                }
            });
        } else if (error.response?.status === 409) {
            Swal.fire({
                title: 'Xəta!',
                text: 'Layihə üçün bütün yerlər doludur!',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        } else {
            Swal.fire('Xəta!', 'Serverlə əlaqə zamanı xəta baş verdi.', 'error');
        }
    }
};

    if (loading) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center">
                <CircularProgress />
            </div>
        );
    };

    console.log(isCollaborator);    

    return (
        <>
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
                                    Layihə adı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə rəhbəri
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İştirakçı sayı
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Layihə statusu
                                </TableCell>
                                {/* <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Baxış
                                </TableCell> */}
                                {projectRole === 1 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        İştirakçı Ol
                                    </TableCell>
                                ) : null}
                                {projectRole === 2 ? (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Ekspert təyin et
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                        Məlumat yoxdur
                                    </TableCell>
                                </TableRow>
                            ) : null}
                            {projects.map((project, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.project_name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.user.name && project.user.surname ? `${project.user.name} ${project.user.surname}` : "Mövcud deyil"}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.members?.length || 0}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {project.approved === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200/60 dark:bg-warning-500/15 dark:text-warning-400 dark:ring-warning-400/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse" />
                                                Təsdiq gözləyir
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-success-50 text-success-700 ring-1 ring-inset ring-success-200/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-400/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                                                Təsdiq olunub
                                            </span>
                                        )}
                                    </TableCell>
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Link to={`/project-view/${project.project_code}`}>
                                                <VisibilityIcon
                                                    style={{ width: 35, height: 35 }}
                                                    className="cursor-pointer bg-blue-100 text-blue-600 rounded p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-700 transition-colors duration-200"
                                                />
                                            </Link>
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 1 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {fin_kod && (
                                                <Button onClick={() => handleBeCollaborator(fin_kod, project.project_code)} disabled={!project.approved || !!isCollaborator}>
                                                    İştirakçı Ol
                                                </Button>
                                            )}
                                        </TableCell>
                                    ) : null}
                                    {projectRole === 2 ? (
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {
                                                <Link to={"/set-expert"} state={{project}}>
                                                    <Button>
                                                        Ekspert təyin et
                                                    </Button>
                                                </Link>
                                            }
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}