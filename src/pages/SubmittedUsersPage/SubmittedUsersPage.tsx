import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SubmittedUsers from "../../components/submittedUsers/SubmittedUsers";

export default function SubmittedUsersPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Təqdim olunmuş layihələr" />
            <SubmittedUsers />
        </div>
    );
}