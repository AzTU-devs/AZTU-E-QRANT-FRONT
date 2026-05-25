import {
    Table,
    TableCell,
    TableBody,
    TableRow
} from "../ui/table";
import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import NotFound from "../../../public/404-error.png";
import CircularProgress from "@mui/material/CircularProgress";

interface Project {
    project_name?: string;
    project_purpose?: string;
    project_requirements?: string;
    project_scientific_idea?: string;
    project_structure?: string;
    team_characterization?: string;
    project_annotation?: string;
    project_assessment?: string;
    project_code?: string;
    project_deadline?: string;
    project_key_words?: string;
    project_monitoring?: string;
    priotet?: string;
    priotet_name?: string;
}

export default function ProjectDetailsView({ projectCode }: { projectCode: Number | null }) {
    const [loading, setLoading] = useState(true);
    // const [prioritetText, setPrioritetText] = useState("");

    const [project, setProject] = useState<Project>({
        project_name: "",
        project_purpose: "",
        project_requirements: "",
        project_scientific_idea: "",
        project_structure: "",
        team_characterization: "",
        project_annotation: "",
        project_assessment: "",
        project_code: "",
        project_deadline: "",
        project_key_words: "",
        project_monitoring: "",
        priotet: "",
        priotet_name: ""
    })
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get(`/api/project/${projectCode}`);
                console.log(response.data.data);
                setProject(response.data.data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
            return (
                <div className="flex justify-center items-center p-10">
                    <CircularProgress />
                </div>
            );
        }
    
        console.log(`project: ${project}`);

    return (
        <>
            {Object.values(project).every(value => !value) ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 flex justify-center items-center">
                    <img src={NotFound} alt="Not Found" className="w-[100px] h-[100px]"/>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-theme-sm dark:border-white/[0.06] dark:bg-gray-900/40">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə adı
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Prioritet
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project?.priotet_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin məqsədi
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_purpose}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin annotasiyası
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_annotation}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə üzrə açar sözlər
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_key_words}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin elmi ideyası
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_scientific_idea}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə üzrə tədqiqatın strukturu
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_structure}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihə elmi kollektivinin xarakterizə edilməsi
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.team_characterization}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin monitorinqi və davamlığı
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_monitoring}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin qiymətləndirilməsi və hesabatlılığı
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_assessment}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Layihənin tələbləri
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex justify-end items-end">
                                        {project.project_requirements}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}