import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ApproveWaitingUsersByAdmin from "../../components/approveWaitingUsers/ApproveWaitingUser";

export default function ApproveWaitingUsersPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Təsdiq gözləyən istifadəçilər" />
            <ApproveWaitingUsersByAdmin />
        </div>
    );
}