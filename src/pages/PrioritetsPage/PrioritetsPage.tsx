import PageMeta from "../../components/common/PageMeta";
import Prioritets from "../../components/Prioritets/Prioritets";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function PrioritetsPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Prioritetlər" />
            <Prioritets />
        </div>
    );
}