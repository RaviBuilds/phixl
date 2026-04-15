// components/DownloadInvoiceBtn.tsx
"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadInvoiceBtnProps {
  transaction: any;
  userEmail: string;
  fullName: string;
}

export default function DownloadInvoiceBtn({
  transaction,
  userEmail,
  fullName,
}: DownloadInvoiceBtnProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const dateStr = new Date(transaction.created_at).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
    const currencySymbol = transaction.currency === "USD" ? "$" : "₹";

    // 1. Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 0, 153); // Phixl AI Pink
    doc.text("Phixl AI", 14, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Historical Photo Restoration", 14, 28);
    doc.text("support@phixl.online", 14, 33);

    // 2. Invoice Details (Right Side)
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("INVOICE", 150, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${dateStr}`, 150, 28);
    doc.text(`Order ID: ${transaction.razorpay_order_id}`, 150, 33);

    // 3. Billed To
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Billed To:", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text(fullName, 14, 56);
    doc.text(userEmail, 14, 61);

    // 4. Transaction Table
    autoTable(doc, {
      startY: 75,
      headStyles: { fillColor: [255, 0, 153] }, // Phixl Pink Header
      head: [["Description", "Credits Added", "Total"]],
      body: [
        [
          "Phixl AI Premium Credits (One-time purchase)",
          `+${transaction.credits_added}`,
          `${currencySymbol}${transaction.amount}`,
        ],
      ],
      theme: "grid",
    });

    // 5. Total
    // @ts-ignore - autoTable attaches lastAutoTable to the doc
    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      `Amount Paid: ${currencySymbol}${transaction.amount} ${transaction.currency}`,
      14,
      finalY + 15,
    );

    // 6. Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Thank you for choosing Phixl AI to preserve your memories.",
      14,
      finalY + 30,
    );

    // Trigger the download
    doc.save(`Phixl_Invoice_${transaction.razorpay_order_id}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white bg-[#0a0a0a] border border-gray-700 hover:border-red-brand px-3 py-1.5 rounded-lg transition-all"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Download</span>
    </button>
  );
}
