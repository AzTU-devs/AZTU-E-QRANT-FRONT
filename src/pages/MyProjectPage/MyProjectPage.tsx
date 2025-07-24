import PageMeta from "../../components/common/PageMeta";
import MyProject from "../../components/myProject/MyProject";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function MyProjectPage() {
  return (
    <div>
      <PageMeta
        title="AzTU E-Qrant"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Layihəm" />
      <MyProject />
    </div>
  );
}