import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MainSmeta from "../mainSmeta/MainSmeta";
import SmetaOther from "../smetaOther/SmetaOther";
import SmetaTools from "../smetaTools/SmetaTools";
import SmetaSalary from "../smetaSalary/SmetaSalary";
import NotFoundImage from "../../../public/not_found.png";
import SmetaExpenses from "../smetaExpenses/SmetaExpenses";
import SmetaServices from "../smetaServices/SmetaServices";
import Collaborators from "../collaborators/Collaborators";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";

export default function MyProject() {
  const projectCode = useSelector((state: RootState) => state.auth.projectCode);
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    // wait a tick for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("layihe-detallari.pdf");

    setIsExporting(false);
  };

  return (
    <>
      <style>{`
        /* Safe colors for export only */
        .export-safe * {
          color: #333 !important;
          background-color: transparent !important;
          border-color: #333 !important;
        }
      `}</style>

      <button
        onClick={handleDownloadPdf}
        className="mb-4 px-4 py-2 bg-blue text-white rounded"
      >
        PDF kimi yüklə
      </button>

      <div
        ref={printRef}
        className={isExporting ? "export-safe" : ""}
      >
        {projectCode ? (
          <>
            <h1 className="text-center mb-[20px] text-gray dark:text-gray">Layihə detalları</h1>
            <ProjectDetailsView projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihənin komandası</h1>
            <Collaborators projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə Smetası</h1>
            <MainSmeta projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə rəhbərinin və icraçıların xidmət haqqı smetası</h1>
            <SmetaSalary projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası</h1>
            <SmetaTools projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">İşlərin və xidmətlərin satınalınması smetası</h1>
            <SmetaServices projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Layihə üzrə icarə xərclər smetası</h1>
            <SmetaExpenses projectCode={+projectCode} />
            <h1 className="text-center mb-[20px] text-gray dark:text-gray mt-[20px]">Digər birbaşa xərclər smetası</h1>
            <SmetaOther projectCode={+projectCode} />
          </>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <img src={NotFoundImage} alt="not-found" className="w-[400px]" />
            <p
              className="mt-[10px] text-[30px]"
              style={{ color: "rgb(18, 32, 87)", fontWeight: 500 }}
            >
              Layihə mövcud deyil.
            </p>
          </div>
        )}
      </div>
    </>
  );
}