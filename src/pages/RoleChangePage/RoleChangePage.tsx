import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RequestRoleChange from "../../components/roleChange/RequestRoleChange";

export default function RoleChangePage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant | Rol dəyişikliyi"
                description="Rolunuzu rəhbər və icraçı arasında dəyişmək üçün sorğu göndərin"
            />
            <PageBreadcrumb pageTitle="Rol dəyişikliyi" />
            <RequestRoleChange />
        </div>
    );
}
