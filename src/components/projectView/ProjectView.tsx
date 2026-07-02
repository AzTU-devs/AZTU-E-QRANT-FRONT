import Swal from "sweetalert2";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MainSmeta from "../mainSmeta/MainSmeta";
import SmetaOther from "../smetaOther/SmetaOther";
import SmetaTools from "../smetaTools/SmetaTools";
import SmetaSalary from "../smetaSalary/SmetaSalary";
import Collaborators from "../collaborators/Collaborators";
import SmetaServices from "../smetaServices/SmetaServices";
import SmetaExpenses from "../smetaExpenses/SmetaExpenses";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";
import { ActivitiesView } from "../ActivitiesView/ActivitiesView";
import ProjectReportsView from "../projectReportsView/ProjectReportsView";
import { API_BASE_URL } from "../../util/apiClient";

export default function ProjectView() {
  const { projectCode } = useParams<{ projectCode: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [showReports, setShowReports] = useState(false);

  if (!projectCode) {
    return <div>Project code is missing.</div>;
  }

  const overrideColors = (element: HTMLElement) => {
    element.style.color = "#000000";
    element.style.backgroundColor = "#ffffff";
    element.style.borderColor = "#000000";

    Array.from(element.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        overrideColors(child);
      }
    });
  };

  // const generatePDF = () => {
  //   const element = contentRef.current;
  //   if (!element) return;

  //   overrideColors(element);

  //   html2canvas(element, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`project_${projectCode}.pdf`);

  //     window.location.reload();
  //   });
  // };

  const handleDownloadPdf = async () => {
    try {
      setIsLoadingPdf(true);
      // const response = await fetch(`http://e-grant.aztu.edu.az/api/project-pdf/${projectCode}`, {
      //   method: "GET",
      // });

      const response = await fetch(`${API_BASE_URL}/api/project-pdf/${projectCode}`, {
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
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsLoadingExcel(true);
      // const response = await fetch(`http://e-grant.aztu.edu.az/api/project-excel/${projectCode}`, {
      //   method: "GET",
      // });

      const response = await fetch(`${API_BASE_URL}/api/project-excel/${projectCode}`, {
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
    } finally {
      setIsLoadingExcel(false);
    }
  };
 
  const headingStyle = {
    color: "#4B5563",
    marginBottom: "20px",
    textAlign: "center" as const,
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!showReports && (
          <>
            <button
              onClick={handleDownloadPdf}
              disabled={isLoadingPdf}
              className={`px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded ${isLoadingPdf ? "opacity-50" : ""}`}
            >
              {isLoadingPdf ? "Yüklənir..." : "PDF yükləyin"}
            </button>

            <button
              onClick={handleDownloadExcel}
              disabled={isLoadingExcel}
              className={`px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded${isLoadingExcel ? " opacity-50" : ""}`}
            >
              {isLoadingExcel ? "Yüklənir..." : "Excel ixrac edin"}
            </button>
          </>
        )}

        <button
          onClick={() => setShowReports((prev) => !prev)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
        >
          {showReports ? "Layihəyə qayıt" : "Hesabatlar"}
        </button>
      </div>

      {showReports ? (
        <ProjectReportsView projectCode={+projectCode} />
      ) : (
      <div ref={contentRef}>
        <h1 style={headingStyle}>Layihə detalları</h1>
        <ProjectDetailsView projectCode={+projectCode} />
        <h1 style={headingStyle} className="mt-[20px]">Layihə üzrə görüləcək işlər (ay üzrə)</h1>
        <ActivitiesView projectCode={+projectCode}/>
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>Layihənin komandası</h1>
        <Collaborators projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>Layihə Smetası</h1>
        <MainSmeta projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>
          Layihə rəhbərinin və icraçıların xidmət haqqı smetası
        </h1>
        <SmetaSalary projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>
          Avadanlıq, cihaz, qurğu və mal-materialların satınalınması smetası
        </h1>
        <SmetaTools projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>
          İşlərin və xidmətlərin satınalınması smetası
        </h1>
        <SmetaServices projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>
          Layihə üzrə icarə xərclər smetası
        </h1>
        <SmetaExpenses projectCode={+projectCode} />
        <h1 style={{ ...headingStyle, marginTop: "20px" }}>
          Digər birbaşa xərclər smetası
        </h1>
        <SmetaOther projectCode={+projectCode} />
      </div>
      )}
    </>
  );
}