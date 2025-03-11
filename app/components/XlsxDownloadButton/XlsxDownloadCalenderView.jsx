import React from "react";
import * as XLSX from "xlsx";

const ExcelDownloadCalenderView = ({ transactions, fileName = "Transactions.xlsx" }) => {
  const exportToExcel = () => {
    if (!transactions || transactions.length === 0) {
      alert("No data available for export!");
      return;
    }

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
            staffId: user.email, // Replace with actual Staff ID if available
            bookings: Array(31).fill(""), // Initialize all days with empty strings
          });
        }

        // Get Booking Day and add the quantity
        const day = new Date(user.date).getDate();
        userMap.get(userKey).bookings[day - 1] = user.lunchQuantity; // Add quantity instead of 0
      });
    });

    // Convert userMap to rows
    const rows = Array.from(userMap.values()).map(({ sl, name, staffId, bookings }) => {
      const totalLunch = bookings.reduce((sum, q) => sum + (q || 0), 0); // Sum only non-empty values
      const totalCost = totalLunch > 0 ? totalLunch * 110 : ""; // Keep empty if no booking

      return [sl, name, staffId, ...bookings, totalLunch || "", totalCost]; // Keep empty if totalLunch is 0
    });

    // Convert Data to Worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

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
//   button: {
//     padding: "10px 20px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
};

export default ExcelDownloadCalenderView;
