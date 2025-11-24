import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice } from "@/lib/price";

interface GenerateInvoiceOptions {
    customer: any;
    plan: any;
    subscription: any;
    filename: string;
}

function numberToWords(num: number) {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + numberToWords(num % 100) : "");
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");

    return String(num);
}

export const generateInvoicePdf = async ({
    customer,
    plan,
    subscription,
    filename,
}: GenerateInvoiceOptions) => {

    // Resolve all fields properly
    const rawInvoice = subscription.order_id || subscription.id;
    const formattedInvoice = String(rawInvoice).padStart(6, "0").slice(-6);
    const invoiceDate = subscription.created
        ? new Date(subscription.created).toLocaleDateString("en-GB")
        : "-";
    const periodStart = subscription.created
        ? new Date(subscription.created).toLocaleDateString("en-GB")
        : "-";
    const periodEnd = subscription.expiry_date
        ? new Date(subscription.expiry_date).toLocaleDateString("en-GB")
        : "-";
    const users = subscription.totaluser || 0;
    const subtotal = Number(subscription.plantotalprice) || 0;
    const rate = subscription.per_user_rate || 0;
    const discount = Number(subscription.discount) || 0;
    const tax = (Number(subscription.taxprice) || 0);
    const cgst = Number(subscription.cgst) || 0;
    const sgst = Number(subscription.sgst) || 0;
    const igst = Number(subscription.igst) || 0;
    const total = Number(subscription.total) || rate - discount + tax;

    // START PDF
    const toBase64 = (url: string): Promise<string> =>
        fetch(url)
            .then((res) => res.blob())
            .then(
                (blob) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    })
            );

    const logoBase64 = await toBase64("/assest/image/logo13.png");

    const doc = new jsPDF();
    doc.addImage(logoBase64, "PNG", 10, 4, 80, 16);
    // Draw RED BAR first
    doc.setFillColor(58, 123, 213);
    doc.rect(12, 23, 184, 1, "F");
    // Now draw LOGO on top of it

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(58, 123, 213);
    doc.text("Invoice By:", 14, 32);

    // Invoice By (static company)
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Doomshell Softwares Private Limited", 14, 41);
    doc.text("A-3 Mall Road, Near Radhy Bakers,", 14, 46);
    doc.text("Jaipur-303091, Rajasthan", 14, 51);
    doc.text("GSTIN: 08AACCD6890Q1ZU", 14, 56);

    // Invoice No & Date
    doc.setFontSize(11);
    doc.text("Invoice No:", 160, 39);
    doc.setFontSize(10);
    doc.text(String(formattedInvoice), 194, 39, { align: "right" });

    // // Invoice Date
    // doc.setFontSize(11);
    // doc.text("Invoice Date:", 140, 45);
    // doc.setFontSize(10);
    // doc.text(invoiceDate, 190, 45, { align: "right" });

    // Wrap long address
    // Clean Address (fixes the spacing issue)
    let cleanAddress = (customer.address1 || "-")
        .replace(/\s+/g, " ")
        .replace(/,\s*/g, ", ")
        .trim();

    const wrappedAddress = doc.splitTextToSize(cleanAddress, 85);
    const addressLines = wrappedAddress.length;

    const boxHeight = 55 + (addressLines - 1) * 6;

    doc.setFillColor(245, 245, 245);
    doc.rect(14, 65, 182, boxHeight, "F");

    // LEFT SIDE START Y
    let leftY = 75;

    // Billing To:
    doc.setFontSize(12);
    doc.setTextColor(58, 123, 213);
    doc.text("Billing To:", 18, leftY);

    // Customer Name
    doc.setFontSize(10);
    doc.setTextColor(0);
    leftY += 7;
    doc.text(customer.name || "-", 18, leftY);

    // Address (multi-lines)
    leftY += 6;
    doc.text(wrappedAddress, 18, leftY);

    // Move pointer to end of address
    leftY += addressLines * 6;

    // GST
    doc.text(`GST: ${customer.gstin || "-"}`, 18, leftY);

    // Top of right side EXACTLY matches top of "Customer Name"
    let rightY = 82;   // = 75 + 7

    doc.setFontSize(11);
    doc.setTextColor(0);

    // Invoice Date label + value
    doc.text("Invoice Date:", 150, rightY);
    doc.setFontSize(10);
    doc.text(invoiceDate, 194, rightY, { align: "right" });

    // Table Header (Description)
    autoTable(doc, {
        startY: 106,
        head: [
            [
                { content: "Description", styles: { halign: "left" } },
                { content: "Amount (In Rs.)", styles: { halign: "right" } },
            ],
        ],
        headStyles: {
            fillColor: [58, 123, 213],
            textColor: 255,
            fontSize: 12,
            halign: "center",
        },
        body: [
            [
                {
                    content: `Doomshell Software\n- ${plan?.name} Plan @ Rs. ${formatPrice(rate)}\n- Billing Period: ${periodStart} to ${periodEnd}`,
                    styles: { halign: "left", fontSize: 10 },
                },
                {
                    content: formatPrice(rate),
                    styles: { halign: "right", fontSize: 10 },
                },
            ],
        ],
        bodyStyles: {
            textColor: [32, 32, 32],  // ★ gray body text
            cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
        },
        styles: {
            fontSize: 10,
            valign: "middle",
        },
        theme: "grid",
        columnStyles: {
            1: { halign: "right" },
        },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 6;

    // Totals Breakdown
    doc.setFontSize(11);
    doc.setTextColor(58, 123, 213);
    doc.text("Thank you for your Business!", 14, finalY);

    // Right-side values
    doc.setTextColor(0);
    doc.setFontSize(10);

    const items: [string, number][] = [
        ["Sub Total", rate],
        ["Discount", discount],
        ["Net Price", rate - discount],
    ];
    if (igst && igst !== 0) {
        items.push(["IGST", igst]);
    }
    else {
        items.push(["CGST", cgst]);
        items.push(["SGST", sgst]);
    }
    items.push(["Total Tax", tax]);

    items.forEach(([label, value], i) => {
        const y = finalY + 4 + i * 7;
        doc.text(label, 140, y);
        doc.text(formatPrice(Number(value)), 194, y, { align: "right" });
    });

    const roundedValue = Math.round(total)   // increased for better padding
    const roundedTotal = formatPrice(roundedValue);
    const roundedTotalForWords = Math.round(total);

    // -------- BLUE TOTAL BOX (AUTO POSITIONED) --------
    // height of tax table:
    const tableHeight = items.length * 7; // each row 7px

    // add extra gap
    const boxY = finalY + tableHeight;
    const boxLeftX = 136;
    const boxRightX = 196;
    const boxWidth = boxRightX - boxLeftX;
    const boxXHeight = 10;

    // Draw box
    doc.setFillColor(58, 123, 213);
    doc.rect(boxLeftX, boxY, boxWidth, boxXHeight, "F");

    doc.setFontSize(11);
    doc.setTextColor(255);

    const labelY = boxY + 7;

    // Left label
    doc.text("Total Order Value:", 140, labelY);

    // Right value
    doc.text(String(roundedTotal), 194, labelY, { align: "right" });

    // -------- AMOUNT IN WORDS --------
    doc.setFontSize(12);
    doc.setTextColor(58, 123, 213);
    doc.text("Amount in Words", 14, boxY + 18);

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(numberToWords(roundedTotalForWords) + " Only", pageWidth - 15, boxY + 18, {
        align: "right",
    });

    // doc.save(`${filename}.pdf`);
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
};