import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectHistory from "../../components/projectHistory/ProjectHistory";

export default function MyHistoryPage() {
    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Layihə tarixçəm" description="Keçmiş layihələriniz" />
            <PageBreadcrumb pageTitle="Layihə tarixçəm" />
            <ProjectHistory />
        </div>
    );
}
