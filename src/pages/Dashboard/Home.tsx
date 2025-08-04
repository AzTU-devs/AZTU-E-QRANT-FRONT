 import { Link } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import { RootState } from '../../redux/store';
  import WorkIcon from '@mui/icons-material/Work';
  import SchoolIcon from '@mui/icons-material/School';
  import PageMeta from "../../components/common/PageMeta";
  import AztuLogoDark from "../../../public/aztu-logo.webp";
  import AztuLogoLight from "../../../public/aztu-logo-light.png";
  import GrantLogoDark from "../../../public/e-grant-logo-dark.png";
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import GrantLogoLight from "../../../public/e-grant-logo-light.png";

  export default function Home() {
    const role = useSelector((state: RootState) => state.auth.projectRole);
    const finKod = useSelector((state: RootState) => state.auth.fin_kod);

    return (
      <>
        <PageMeta
          title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
          description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />
        <div className="flex flex-col justify-center items-center text-center px-4">
          <div className="flex justify-center items-center">
            <img
              src={AztuLogoLight}
              alt=""
              className="hidden dark:block w-auto h-16 md:h-24 mr-[30px]"
            />
            <img
              src={AztuLogoDark}
              alt=""
              className="block dark:hidden w-auto h-16 md:h-24 mr-[30px]"
            />
            {/* Light mode image */}
            <img
              src={GrantLogoLight}
              alt="Grant Logo Light"
              className="hidden dark:block w-auto h-20 md:h-32"
            />
            {/* Dark mode image */}
            <img
              src={GrantLogoDark}
              alt="Grant Logo Dark"
              className="block dark:hidden w-auto h-20 md:h-32"
            />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[rgb(20,30,79)] dark:text-white">
            AzTU Daxili Qrant müsabiqəsi
          </h1>
          <p className="mt-8 max-w-2xl text-center text-gray-600 dark:text-gray-300">
            Elmi-tədqiqat və ya innovasiya layihələrinin maliyyə dəstəyi ilə həyata
            keçirilməsi üçün Azərbaycan Texniki Universiteti tərəfindən qrant
            müsabiqəsi elan olunu. Elmi qrant layihələrinin əsas məqsədi elmi
            tədqiqatların və innovativ ideyaların maliyyələşdirilməsi və
            dəstəklənməsidir. Əlavə olaraq, qrantlar şəffaflıq, rəqabət və elmi
            keyfiyyət prinsiplərinə əsaslanaraq, elmi mühitdə yaradıcılığı və
            məhsuldarlığı artırmaq məqsədi daşıyır.
          </p>
        </div>
        <div className="mt-[50px] px-4 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <Link to={`/projects`} className={`w-full md:w-[calc((100% / ${role === 1 ? 2 : 3}) - 10px)]`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <WorkIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Layihələr
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <Link to={`/user-details/${finKod}`} className={`w-full md:w-[calc((100% / ${role === 1 ? 2 : 3}) - 10px)]`}>
            <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <AccountCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Şəxsi məlumatlar
                  </span>
                </div>
              </div>
            </div>
          </Link>
          {role === 0 ? (
            <Link to={"/project-offer"} className="w-full md:w-[calc((100% / 3) - 10px)]">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <SchoolIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Layihə detalları
                  </span>
                </div>
              </div>
            </div>
            </Link>
          ) : null}
        </div>
        <div className="mt-[20px] px-4 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          {role === 1 ? (
            <Link to={"/collaborator-project"} className="w-full md:w-[calc((100% / 2) - 10px)]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <WorkIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    İcraçı olduğum layihə
                  </span>
                </div>
              </div>
            </div>
            </Link>
          ) : null}
        </div>
      </>
    );
  }