import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPdf = (data: unknown[], filename: string, heading: string) => {
  if (!Array.isArray(data) || data.length === 0) return;

  // ✅ Only include these keys
  const includedFields = ["name", "email", "mobile_no", "status", "address"];

  const headers = ["S.No.", ...includedFields.map((key) => key.toUpperCase())];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const rows = data.map((item, index) => {
    return [
      index + 1,
      ...includedFields.map((key) => {
        const value = item[key];

        // Format status
        function formatStatus(val) {
          if (val == null) return "Inactive"; // null or undefined
          const s = String(val).trim().toUpperCase();
          return ["Y", "YES", "1", "TRUE"].includes(s) ? "Active" : "Inactive";
        }

        // usage
        if (key === "status") {
          return formatStatus(value);
        }
        if (key === "dob" && value) {
          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, "0");
          const month = monthNames[date.getMonth()];
          const year = String(date.getFullYear()).slice(-2);
          return `${day}-${month}-${year}`; // 👉 dd-MMM-yy
        }
        // Format empty values
        if (value === null || value === undefined || value === "") {
          return "N/A";
        }

        return value;
      }),
    ];
  });

  const doc = new jsPDF();
  doc.text(heading, 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: rows,
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [0, 102, 204], // Blue header
      textColor: 255,
      fontStyle: "bold",
    },
    margin: { top: 10, bottom: 10, left: 10, right: 10 },
  });

  doc.save(`${filename}.pdf`);
};

// export const exportToPdfOne = (
//     data: any,
//     filename: string,
//     profile?: string // 🖼️ Optional profile image (Base64)
//   ) => {
//     if (!data || typeof data !== "object") return;

//     const excludedFields = ["password", "profile", "document", "updatedAt"];
//     const allKeys = Object.keys(data).filter((key) => !excludedFields.includes(key));

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const formatValue = (key: string, value: any): string => {
//       if (key === "createdAt" && value) {
//         const d = new Date(value);
//         return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
//       }

//       if (key === "dob" && value) {
//         const d = new Date(value);
//         return `${String(d.getDate()).padStart(2, "0")}-${monthNames[d.getMonth()]}-${String(d.getFullYear()).slice(-2)}`;
//       }

//       if (typeof value === "boolean") return value ? "Active" : "Inactive";
//       if (Array.isArray(value)) return value.join(", ");
//       if (value === null || value === undefined || value === "") return "N/A";

//       return String(value);
//     };

//     const rows = allKeys.map((key) => [
//       key.charAt(0).toUpperCase() + key.slice(1),
//       formatValue(key, data[key]),
//     ]);

//     const doc = new jsPDF();

//     // 🖼️ Circular-looking profile image top-right
//     const imageX = 155;
//     const imageY = 10;
//     const imageSize = 40;

//     if (profile) {
//       doc.setFillColor(255, 255, 255);
//       doc.circle(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 'F');
//       doc.addImage(profile, 'JPEG', imageX, imageY, imageSize, imageSize);
//     }

//     // 🏢 Company Info - Top left
//     doc.setFontSize(16);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont(undefined, "normal");
//     doc.text([
//       "Doomshell Softwares Private Limited.",
//       "Incorporated: August 27, 2006",
//       "Jaipur, Rajasthan."
//     ], 14, 15); // x: 14, y: 12

//     // 🧾 Title - Bold
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.setFont(undefined, "bold");
//     doc.text("Detail Report", 14,50);
//     doc.setFont(undefined, "normal");

//     // 📄 Detail Table
//     autoTable(doc, {
//       startY: 60,
//       head: [["Field", "Value"]],
//       body: rows,
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//       },
//       columnStyles: {
//         0: { fontStyle: "bold", halign: "left", textColor: [33, 33, 33] },
//         1: { halign: "left" },
//       },
//       headStyles: {
//         fillColor: [33, 150, 243],
//         textColor: 255,
//         halign: "left",
//       },
//       margin: { top: 8, left: 14, right: 14 },
//     });

//         // 🏢 Footer
//         const pageHeight = doc.internal.pageSize.getHeight();
//         doc.setFontSize(10);
//         doc.setTextColor(100);
//         doc.text(
//           "Doomshell Softwares Private Limited.\nIncorporated: August 27, 2006\nJaipur, Rajasthan.",
//           doc.internal.pageSize.getWidth() / 2,
//           pageHeight - 14,
//           { align: "center" }
//         );
//     // 💾 Save the file
//     doc.save(`${filename}.pdf`);
//   };
