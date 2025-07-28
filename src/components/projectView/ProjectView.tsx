import { useParams } from "react-router-dom";
import MainSmeta from "../mainSmeta/MainSmeta";
import SmetaOther from "../smetaOther/SmetaOther";
import SmetaTools from "../smetaTools/SmetaTools";
import SmetaSalary from "../smetaSalary/SmetaSalary";
import Collaborators from "../collaborators/Collaborators";
import SmetaServices from "../smetaServices/SmetaServices";
import SmetaExpenses from "../smetaExpenses/SmetaExpenses";
import ProjectDetailsView from "../projectDetailsView/ProjectDetailsView";
import { useRef } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectView() {
  const { projectCode } = useParams<{ projectCode: string }>();
  const contentRef = useRef<HTMLDivElement>(null);

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

  const generatePDF = () => {
    const element = contentRef.current;
    if (!element) return;

    overrideColors(element);

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`project_${projectCode}.pdf`);

      window.location.reload();
    });
  };

  // Safe HEX colors replacing Tailwind text-gray-700 and dark:text-gray-400:
  const headingStyle = {
    color: "#4B5563", // hex for Tailwind gray-700
    marginBottom: "20px",
    textAlign: "center" as const,
  };

  return (
    <>
      <button
        onClick={generatePDF}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Download PDF
      </button>

      <div ref={contentRef}>
        <h1 style={headingStyle}>Layihə detalları</h1>
        <ProjectDetailsView projectCode={+projectCode} />
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
    </>
  );
}