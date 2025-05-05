import React from "react";
import * as XLSX from "xlsx";

const ExcelDownloadCalenderView = ({ transactions, fileName = "Transactions.xlsx" }) => {

  const staffIDs = {
    "faroque.sust@gmail.com": "11",
    "rifat633@gmail.com": "12",
    "marufsm4@gmail.com": "13",
    "rajon.exe@gmail.com": "14",
    "sirajul.flyinfosoft@gmail.com": "15",
    "work.naim374@gmail.com": "16",
    "tanvirt073@gmail.com": "17",
    "saadat.flyinfosoft@gmail.com": "18",
    "mukhlesur99@gmail.com": "20",
    "durjoym20@gmail.com": "27",
    "ajax.rijom@gmail.com": "28",
    "shaifulislam3055@gmail.com": "",
    "nurul.islam86061907@gmail.com": "",
    "jubayer8221@gmail.com": "",
    "mehzabmotin2025@gmail.com": "",
    "guest@gmail.com": "", 
  };
  
  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) {
      alert("No data available for export!");
      return;
    }

    const reportMonth = transactions[0]?.date2 || "";

    console.log(transactions)

    // Define Headers: SL, Name, Staff ID, Days (1-31), Total Lunch, Total Cost
    const headers = [
      "SL",
      "Name",
      "Staff ID",
      ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      "Total Lunch",
      "Total Cost",
    ];

    // Map to store unique users
    const userMap = new Map();
    let sl = 1;

    transactions.forEach((record) => {
      const { data } = record;

      data.forEach((user) => {
        const userKey = user.email; // Use email as unique identifier (or staff ID if available)

        if (!userMap.has(userKey)) {
          userMap.set(userKey, {
            sl: sl++,
            name: user.name,
            // staffId: user.email, // Replace with actual Staff ID if available
            staffId: staffIDs[user.email] || "N/A", // Look up staff ID by email
            bookings: Array(31).fill(""), // Initialize all days with empty strings
          });
        }

        // Get Booking Day and add the quantity
        const day = new Date(user.date).getDate();
        userMap.get(userKey).bookings[day - 1] = user.lunchQuantity; // Add quantity instead of 0
      });
    });

    // Convert userMap to rows
      const rows = Array.from(userMap.values())
      .sort((a, b) => {
        const idA = a.staffId === "N/A" ? Infinity : parseInt(a.staffId, 10);
        const idB = b.staffId === "N/A" ? Infinity : parseInt(b.staffId, 10);
        return idA - idB;
      })
      .map(({ sl, name, staffId, bookings }) => {
        const totalLunch = bookings.reduce((sum, q) => sum + (q || 0), 0);
        const totalCost = totalLunch > 0 ? totalLunch * 110 : "";
        return [sl, name, staffId, ...bookings, totalLunch || "", totalCost];
      });


    // Convert Data to Worksheet
      const titleRow = ["Monthly Lunch Booking Report"];
      const monthRow = [`Month: ${reportMonth}`];
      const emptyRow = [];

       // Calculate grand totals
      const grandTotalLunch = rows.reduce((sum, row) => sum + (row[headers.length - 2] || 0), 0);
      const grandTotalCost = rows.reduce((sum, row) => sum + (row[headers.length - 1] || 0), 0);

      const sheetData = [
        titleRow,
        monthRow,
        emptyRow,
        headers,
        ...rows,
        [], // Empty row before totals
        ["", "", "", ...Array(31).fill(""),  grandTotalLunch, grandTotalCost],
      ];
      

      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Title row
        { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }, // Month row
      ];      


    // Set Column Widths for better visibility
    ws["!cols"] = [
      { wch: 5 },  // SL
      { wch: 20 }, // Name
      { wch: 25 }, // Staff ID
      ...Array(31).fill({ wch: 3 }), // Days 1-31
      { wch: 12 }, // Total Lunch
      { wch: 12 }, // Total Cost
    ];

    // Create Workbook & Append Worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Bookings");

    // Download the File
    XLSX.writeFile(wb, fileName);
  };

  return (
    <button className="btn btn-sm btn-danger my-1 mb-4 w-[240px]"  onClick={exportToExcel} style={styles.button}>
      Download Calender View Excel
    </button>
  );
};

// Basic Button Styles
const styles = {

};

export default ExcelDownloadCalenderView;
