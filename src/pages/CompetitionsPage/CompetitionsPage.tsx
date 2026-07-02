import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Competitions from "../../components/competitions/Competitions";

export default function CompetitionsPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant | Müsabiqələr"
                description="İllik qrant müsabiqələrinin idarə edilməsi"
            />
            <PageBreadcrumb pageTitle="Müsabiqələr" />
            <Competitions />
        </div>
    );
}
