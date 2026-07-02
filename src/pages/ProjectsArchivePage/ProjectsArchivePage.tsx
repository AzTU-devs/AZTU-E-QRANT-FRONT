import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectsArchive from "../../components/projectsArchive/ProjectsArchive";

export default function ProjectsArchivePage() {
    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Arxiv" description="Keçmiş müsabiqələrin layihələri" />
            <PageBreadcrumb pageTitle="Arxiv" />
            <ProjectsArchive />
        </div>
    );
}
