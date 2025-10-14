import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectActivitiesTable from "../../components/ProjectActivities/ProjectActivities";

export default function ProjectActivitiesPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Layihədə görüləcək işlər (ay üzrə)" />
            <ProjectActivitiesTable projectCode={14419424}/>
        </div>
    );
}