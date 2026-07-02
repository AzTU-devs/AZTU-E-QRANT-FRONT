import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Announcements from "../../components/announcements/Announcements";

export default function AnnouncementsPage() {
    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant | Elanlar"
                description="Daxili qrant müsabiqəsi elanlarının idarə edilməsi"
            />
            <PageBreadcrumb pageTitle="Elanlar" />
            <Announcements />
        </div>
    );
}
