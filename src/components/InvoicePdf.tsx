import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface GenerateInvoiceOptions {
    customer: any;        // Customer object from backend
    subscription: any;    // Subscription object from backend
    filename: string;     // e.g. "invoice_8"
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
    subscription,
    filename,
}: GenerateInvoiceOptions) => {

    // --------------------------
    // Resolve all fields properly
    // --------------------------
    const invoiceNumber = subscription.order_id || subscription.id;

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
    const rate = subscription.per_user_rate || 0;
    const subtotal = Number(subscription.plantotalprice) || 0;
    const discount = Number(subscription.discount) || 0;
    const tax = Number(subscription.taxprice) || 0;
    const cgst = Number(subscription.cgst) || 0;
    const sgst = Number(subscription.sgst) || 0;
    const igst = Number(subscription.igst) || 0;

    const total = Number(subscription.total) || subtotal - discount + tax;

    // --------------------------
    // START PDF
    // --------------------------

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

    const logoBase64 = await toBase64("/assest/image/logo12.png");

    const doc = new jsPDF();
    // Draw RED BAR first
    doc.setFillColor(224, 76, 76);
    doc.rect(10, 15, 190, 3, "F");

    // Now draw LOGO on top of it
    doc.addImage(logoBase64, "PNG", 70, 8, 70, 20);


    // Title
    doc.setFontSize(16);
    doc.setTextColor(224, 76, 76);
    doc.text("Invoice By:", 14, 30);

    // --------------------------
    // Invoice By (static company)
    // --------------------------
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Doomshell Academy of Advance Computing", 14, 41);
    doc.text("A-3 Mall Road, Near Radhy Bakers,", 14, 46);
    doc.text("Jaipur-303091, Rajasthan", 14, 51);
    doc.text("GSTIN: 08AAKFD9537B1ZD", 14, 56);

    // Invoice No & Date
    doc.setFontSize(11);
    doc.text("Invoice No:", 140, 39);
    doc.setFontSize(10);
    doc.text(String(invoiceNumber), 190, 39, { align: "right" });

    // // Invoice Date
    // doc.setFontSize(11);
    // doc.text("Invoice Date:", 140, 45);
    // doc.setFontSize(10);
    // doc.text(invoiceDate, 190, 45, { align: "right" });

    // ---------------------------
    // BILLING TO (FULLY RESPONSIVE)
    // ---------------------------

    // ---------------------------
    // BILLING TO (FULLY RESPONSIVE)
    // ---------------------------

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
    doc.setFontSize(11);
    doc.setTextColor(224, 76, 76);
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

    // ---------------------------
    // RIGHT SIDE = aligned to same vertical spacing as LEFT
    // ---------------------------

    // Top of right side EXACTLY matches top of "Customer Name"
    let rightY = 82;   // = 75 + 7

    doc.setFontSize(11);
    doc.setTextColor(0);

    // Invoice Date label + value
    doc.text("Invoice Date:", 140, rightY);
    doc.setFontSize(10);
    doc.text(invoiceDate, 190, rightY, { align: "right" });

    // --------------------------
    // Table Header (Description)
    // --------------------------
    autoTable(doc, {
        startY: 100,
        head: [
            [
                { content: "Description", styles: { halign: "left" } },
                { content: "Amount (In Rs.)", styles: { halign: "right" } },
            ],
        ],
        headStyles: {
            fillColor: [224, 76, 76],
            textColor: 255,
            fontSize: 11,
            halign: "center",
        },
        body: [
            [
                {
                    content: `Doomshell Software\n- Plan @ Rs. ${rate}\n- Billing Period: ${periodStart} to ${periodEnd}`,
                    styles: { halign: "left", fontSize: 10 },
                },
                {
                    content: subtotal.toFixed(2),
                    styles: { halign: "right", fontSize: 10 },
                },
            ],
        ],
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

    // --------------------------
    // Totals Breakdown
    // --------------------------
    doc.setFontSize(11);
    doc.setTextColor(224, 76, 76);
    doc.text("Thank you for your Business!", 14, finalY);

    // Right-side values
    doc.setTextColor(0);
    doc.setFontSize(10);

    const items = [
        ["Sub Total", subtotal],
        ["Discount", discount],
        ["CGST", cgst],
        ["SGST", sgst],
        ["IGST", igst],
        ["Total Tax", tax],
    ];

    items.forEach(([label, value], i) => {
        doc.text(label as string, 140, finalY + i * 7);
        doc.text(String(Number(value).toFixed(2)), 195, finalY + i * 7, {
            align: "right",
        });
    });


    const boxX = 140;
    const boxWidth = 56;
    const boxY = finalY + 45;
    const boxHeights = 10;

    // Red Total Box
    doc.setFillColor(224, 76, 76);
    doc.rect(boxX, boxY, boxWidth, boxHeights, "F");

    // White centered text
    doc.setTextColor(255);
    doc.setFontSize(11);

    const centerX = boxX + boxWidth / 2;

    doc.text(`Total Order Value:  ${total.toFixed(2)}`, centerX, boxY + 7, {
        align: "center",
    });


    // LEFT LABEL (red)
    doc.setFontSize(12);
    doc.setTextColor(224, 76, 76);  // red
    doc.text("Amount in Words", 14, finalY + 65);

    // RIGHT TEXT (black)
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(numberToWords(total) + " Only", 200, finalY + 65, { align: "right" });

    // Save
    // doc.save(`${filename}.pdf`);
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
};