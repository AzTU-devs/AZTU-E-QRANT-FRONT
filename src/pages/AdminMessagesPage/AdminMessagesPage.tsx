import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminInbox from "../../components/chat/AdminInbox";

export default function AdminMessagesPage() {
    return (
        <div>
            <PageMeta title="AzTU E-Qrant | Mesajlar" description="İstifadəçilərlə yazışma" />
            <PageBreadcrumb pageTitle="Mesajlar" />
            <AdminInbox />
        </div>
    );
}
