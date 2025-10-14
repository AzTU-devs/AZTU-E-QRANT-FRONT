import { useState } from "react";

import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AllUsersFilter from "../../components/allUsersFilter/AllUsersFilter";
import RolePermissions from "../../components/rolePermisisions/RolePermissions";

type Filters = {
    name?: string;
    surname?: string;
    finKod?: string;
};

export default function RolePermissionsPage() {
    const [filters, setFilters] = useState<Filters>({});

    return (
        <div>
            <PageMeta
                title="AzTU E-Qrant"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Rol və icazlər (Bütün istifadəçilər)" />
            <>
                <AllUsersFilter onChange={setFilters} />
                <RolePermissions filters={filters} />
            </>
        </div>
    );
}