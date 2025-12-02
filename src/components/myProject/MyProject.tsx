import Swal from "sweetalert2";
import { useRef, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import { ActivitiesView } from "../ActivitiesView/ActivitiesView";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";

export default function MyProject() {
    const projectCode = useSelector((state: RootState) => state.auth.projectCode);
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, ] = useState(false);

    //   const handleDownloadPdf = async () => {
    //     console.log("PDF download started");
    //     setIsExporting(true);
    //     console.log("Exporting flag set to true");
    //     await new Promise((resolve) => setTimeout(resolve, 100));

    //     const element = printRef.current;
    //     console.log("Checking printRef element:", element);
    //     if (!element) return;

    //     const canvas = await html2canvas(element, { scale: 2 });
    //     console.log("Canvas created with width:", canvas.width, "and height:", canvas.height);
    //     const imgData = canvas.toDataURL("image/png");
    //     console.log("Image data generated for PDF");

    //     const pdf = new jsPDF("p", "mm", "a4");
    //     console.log("jsPDF instance created");
    //     const imgWidth = pdf.internal.pageSize.getWidth();
    //     const pageHeight = pdf.internal.pageSize.getHeight();
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //     let heightLeft = imgHeight;
    //     let position = 0;

    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;

    //     while (heightLeft > 0) {
    //       position = heightLeft - imgHeight;
    //       pdf.addPage();
    //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //       heightLeft -= pageHeight;
    //     }

    //     pdf.save("layihe-detallari.pdf");
    //     console.log("PDF saved as 'layihe-detallari.pdf'");
    //     console.log("Exporting flag set to false");
    //     setIsExporting(false);
    //   };
    const handleDownloadPdf = async () => {
        try {
            // const response = await fetch(`http://e-grant.aztu.edu.az/api/project-pdf/${projectCode}`, {
            //     method: "GET",
            // });
            
            const response = await fetch(`http://127.0.0.1:8080/api/project-pdf/${projectCode}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to download PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `project_${projectCode}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire("Xəta baş verdi!", "PDF yüklənə bilmədi", "error");
        }
    };
    const handleDownloadExcel = async () => {
        try {
            // const response = await fetch(`http://e-grant.aztu.edu.az/api/project-excel/${projectCode}`, {
            //     method: "GET",
            // });

            const response = await fetch(`http://127.0.0.1:8080/api/project-excel/${projectCode}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to download Excel");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `project_${projectCode}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            Swal.fire("Xəta baş verdi!", "Excel yüklənə bilmədi", "error");
        }
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
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {isExporting ? <CircularProgress size={20} color="inherit" /> : "PDF yüklə"}
            </button>
            <button
                onClick={handleDownloadExcel}
                className="mb-4 ml-5 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Excel ixrac edin
            </button>
            <div
                ref={printRef}
                className={isExporting ? "export-safe" : ""}
            >
                {projectCode ? (
                    <>
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">Layihə detalları</h1>
                        <ProjectDetailsView projectCode={+projectCode} />
                        <h1 className="my-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s">Layihə üzrə görüləcək işlər (ay üzrə)</h1>
                        <ActivitiesView projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Layihənin komandası</h1>
                        <Collaborators projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Layihə Smetası</h1>
                        <MainSmeta projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Layihə rəhbərinin və icraçıların xidmət haqqı smetası</h1>
                        <SmetaSalary projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası</h1>
                        <SmetaTools projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">İşlərin və xidmətlərin satınalınması smetası</h1>
                        <SmetaServices projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Layihə üzrə icarə xərclər smetası</h1>
                        <SmetaExpenses projectCode={+projectCode} />
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-l dark:text-white/90 sm:text-title-s mt-[20px]">Digər birbaşa xərclər smetası</h1>
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