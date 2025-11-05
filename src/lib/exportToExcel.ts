import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // 1️⃣ Add headers including "S.No."
  const headers = ["S.No.", ...Object.keys(data[0])];
  worksheet.addRow(headers);

  // 2️⃣ Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0000FF" }, // Blue background
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" }, // White text
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 🕒 Helper to format date-time into AM/PM format
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // return as-is if invalid
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
    return `${year}-${month}-${day} ${formattedTime}`;
  };

  // 3️⃣ Add data rows
  data.forEach((item, index) => {
    const row = [
      index + 1,
      ...Object.keys(data[0]).map((key) => {
        // If the key is "createdAt", format it to readable AM/PM format
        if (key.toLowerCase() === "created") {
          return formatDateTime(item[key]);
        }
        return item[key];
      }),
    ];
    worksheet.addRow(row);
  });

  // 4️⃣ Auto-fit column widths
  worksheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value?.toString().length || 0;
      maxLength = Math.max(maxLength, val);
    });
    column.width = maxLength + 2;
  });

  // 5️⃣ Export as Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${filename}.xlsx`);
};

// // 4️⃣ Add "Total" row after data
// const totalRow = worksheet.addRow([]);

// // Get column index for the last two columns
// const totalColumnIndex = headers.length - 1; // second last column
// const amountColumnIndex = headers.length;    // last column

// // 📘 "Total" label cell
// const totalLabelCell = totalRow.getCell(totalColumnIndex);
// totalLabelCell.value = "Total";
// totalLabelCell.font = { bold: true, color: { argb: "FFFFFF" } };
// totalLabelCell.fill = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "0000FF" }, // Blue background
// };
// totalLabelCell.alignment = { horizontal: "right", vertical: "middle" };
// totalLabelCell.border = {
//   top: { style: "thin" },
//   left: { style: "thin" },
//   bottom: { style: "thin" },
//   right: { style: "thin" },
// };

// // 📗 Total Amount Cell (formula)
// const startRow = 2; // data starts from row 2
// const endRow = totalRow.number - 1;
// const amountColumnLetter = worksheet.getColumn(amountColumnIndex).letter;

// const totalAmountCell = totalRow.getCell(amountColumnIndex);
// totalAmountCell.value = {
//   formula: `SUM(${amountColumnLetter}${startRow}:${amountColumnLetter}${endRow})`,
// };
// totalAmountCell.font = { bold: true, color: { argb: "FFFFFF" } };
// totalAmountCell.fill = {
//   type: "pattern",
//   pattern: "solid",
//   fgColor: { argb: "0000FF" }, // Light grey background
// };
// totalAmountCell.alignment = { horizontal: "right", vertical: "middle" };
// totalAmountCell.border = {
//   top: { style: "thin" },
//   left: { style: "thin" },
//   bottom: { style: "thin" },
//   right: { style: "thin" },
// };


// 5️⃣ Auto width for each column