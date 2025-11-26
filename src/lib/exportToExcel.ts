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

  const formatStatus = (val: any) => {
    if (val == null) return "Inactive";
    const s = String(val).trim().toUpperCase();
    return ["Y", "YES", "1", "TRUE"].includes(s) ? "Active" : "Inactive";
  };

  const formatPrice = (val: any) => {
    if (!val || isNaN(val)) return "N/A";
    return `₹ ${Number(val).toLocaleString("en-IN")}`;
  };

  // 3️⃣ Add data rows
  data.forEach((item, index) => {
    const row = [
      index + 1,
      ...Object.keys(data[0]).map((key) => {
        const lower = key.toLowerCase();

        // ⏳ Date / Time fields
        if (
          lower.includes("date") ||
          lower.includes("created") ||
          lower.includes("expiry") ||
          lower.includes("start")
        ) {
          return formatDateTime(item[key]);
        }

        // 🔘 Status fields
        if (
          lower.includes("status") ||
          lower.includes("approval")
        ) {
          return formatStatus(item[key]);
        }

        // 💰 Price / Money fields
        if (
          lower.includes("price") ||
          lower.includes("amount") ||
          lower.includes("total") ||
          lower.includes("tax") ||
          lower.includes("paid")
        ) {
          return formatPrice(item[key]);
        }

        return item[key];
      }),
    ];

    worksheet.addRow(row);
  });

  // 🔍 Detect price columns
  const priceColumnIndexes: number[] = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    const text = String(cell.value).toLowerCase();
    if (
      text.includes("price") ||
      text.includes("amount") ||
      text.includes("total") ||
      text.includes("tax") ||
      text.includes("paid")
    ) {
      priceColumnIndexes.push(colNumber);
    }
  });

  // 🎯 Apply right alignment to price cells
  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return; // skip header
    priceColumnIndexes.forEach((col) => {
      row.getCell(col).alignment = { horizontal: "right" };
    });
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