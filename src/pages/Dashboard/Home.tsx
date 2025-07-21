import Logo from "../../../public/e-qrant-logo.jpeg";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="flex flex-col justify-center items-center">
        <img src={Logo} alt="E-Qrant Logo" style={{ width: 300, marginBottom: 20 }} />
        <h1 className="text-black dark:text-white" style={{ fontSize: 40 }}>AzTU E-Qrant</h1>
        <p className="text-black dark:text-white mt-[30px]" style={{ width: "60%", textAlign: "center" }}>
          Elmi-tədqiqat və ya innovasiya layihələrinin maliyyə dəstəyi ilə
          həyata keçirilməsi üçün Azərbaycan Texniki Universiteti tərəfindən
          qrant müsabiqəsi elan olunu. Elmi qrant layihələrinin əsas məqsədi
          elmi tədqiqatların və innovativ ideyaların maliyyələşdirilməsi və dəstəklənməsidir.
          Əlavə olaraq, qrantlar şəffaflıq, rəqabət və elmi keyfiyyət prinsiplərinə əsaslanaraq,
          elmi mühitdə yaradıcılığı və məhsuldarlığı artırmaq məqsədi daşıyır.
        </p>
      </div>
    </>
  );
}
