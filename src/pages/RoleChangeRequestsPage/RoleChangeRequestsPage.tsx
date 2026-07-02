import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RoleChangeRequests from "../../components/roleChangeRequests/RoleChangeRequests";

export default function RoleChangeRequestsPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant | Rol dəyişiklik sorğuları"
                description="İstifadəçilərin rol dəyişiklik sorğularının idarə edilməsi"
            />
            <PageBreadcrumb pageTitle="Rol dəyişiklik sorğuları" />
            <RoleChangeRequests />
        </div>
    );
}
