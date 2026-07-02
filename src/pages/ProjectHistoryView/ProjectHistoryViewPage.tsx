import { useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectDetailsView from "../../components/projectDetailsView/ProjectDetailsView";

export default function ProjectHistoryViewPage() {
    const { projectCode } = useParams<{ projectCode: string }>();

    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Layihə (baxış)" description="Keçmiş layihənizə yalnız baxış" />
            <PageBreadcrumb pageTitle="Layihə (baxış)" />

            {/* view-only notice */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-brand-200/60 bg-brand-50/60 px-4 py-3 text-sm text-brand-700 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300">
                <VisibilityIcon fontSize="small" />
                Bu layihə yalnız baxış üçündür — dəyişiklik etmək mümkün deyil.
            </div>

            <ProjectDetailsView projectCode={projectCode ? Number(projectCode) : null} />
        </div>
    );
}
