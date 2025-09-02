import { lunchPrice } from "@/app/utils";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ExcelDownloadCalenderView = ({ transactions, fileName = "Transactions.xlsx" }) => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [summaryList, setSummaryList] = useState([]);

  const [monthFirstDay, setMonthFirstDay] = useState("");
  const [monthLastDay, setMonthLastDay] = useState("");
  const [lunchPrice, setLunchPrice] = useState(100);


  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const firstMonthYear = transactions[0]?.date2; // e.g. "8/2025"
      if (firstMonthYear) {
        setMonthYear(firstMonthYear);

        const [month, year] = firstMonthYear.split("/");
        const lastDay = new Date(year, month, 0).getDate(); // last day of month

        setStartDate(`${year}-${month.padStart(2, "0")}-01`);
        setEndDate(`${year}-${month.padStart(2, "0")}-${lastDay}`);

        setMonthFirstDay(`${year}-${month.padStart(2, "0")}-01`);
        setMonthLastDay(`${year}-${month.padStart(2, "0")}-${lastDay}`);
      }
    }
  }, [transactions]);


  const handleDayChange = (setter) => (e) => {
    if (!monthYear) return;

    const [month, year] = monthYear.split("/");
    const day = e.target.value.split("-")[2]; // only day part
    const formatted = `${year}-${month.padStart(2, "0")}-${day}`;
    setter(formatted);
  };

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

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    function normalizeDate(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }


    const filteredTransactions = transactions.filter((record) => {
      const recordDate = normalizeDate(new Date(record.date));
      const start = startDate ? normalizeDate(new Date(startDate)) : null;
      const end = endDate ? normalizeDate(new Date(endDate)) : null;

      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    });



    if (filteredTransactions.length === 0) {
      alert("No data available for the selected date range!");
      return;
    }

    const reportMonth = filteredTransactions[0]?.date2 || "";

    // --- Calendar headers ---
    const headers = [
      "SL",
      "Name",
      "Staff ID",
      ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      "Total Lunch",
      "Total Cost",
    ];

    // --- Map users for calendar ---
    const userMap = new Map();
    let sl = 1;

    filteredTransactions.forEach((record) => {
      record.data.forEach((user) => {
        const userKey = user.email;

        if (!userMap.has(userKey)) {
          userMap.set(userKey, {
            sl: sl++,
            name: user.name,
            staffId: staffIDs[user.email] || "N/A",
            bookings: Array(31).fill(""),
          });
        }

        const day = new Date(user.date).getDate();
        userMap.get(userKey).bookings[day - 1] = user.lunchQuantity;
      });
    });

    // --- Calendar rows ---
    const rows = Array.from(userMap.values())
      .sort((a, b) => {
        const idA = a.staffId === "N/A" ? Infinity : parseInt(a.staffId, 10);
        const idB = b.staffId === "N/A" ? Infinity : parseInt(b.staffId, 10);
        return idA - idB;
      })
      .map(({ sl, name, staffId, bookings }) => {
        const totalLunch = bookings.reduce((sum, q) => sum + (q || 0), 0);
        const totalCost = totalLunch > 0 ? totalLunch * lunchPrice : "";
        return [sl, name, staffId, ...bookings, totalLunch || "", totalCost];
      });

    const titleRow = ["Monthly Lunch Booking Report"];
    const monthRow = [`Month: ${reportMonth}`];
    const rangeRow = [`Date Range: ${startDate || "All"} → ${endDate || "All"}`];

    const grandTotalLunch = rows.reduce((sum, row) => sum + (row[headers.length - 2] || 0), 0);
    const grandTotalCost = rows.reduce((sum, row) => sum + (row[headers.length - 1] || 0), 0);

    // --- Generate summary list ---
    const summaryListExcel = Array.from(userMap.values()).map(({ name, bookings }) => {
      const totalLunch = bookings.reduce((sum, q) => sum + (q || 0), 0);
      return {
        name,
        totalLunch,
        totalCost: totalLunch * lunchPrice,
        status: "Pending",
      };
    });

    const summaryHeader = ["Name", "Total Lunch", "Total Cost", "Status"];
    const summaryRows = summaryListExcel.map((item) => [
      item.name,
      item.totalLunch,
      item.totalCost,
      item.status,
    ]);

    const sheetData = [
      titleRow,
      monthRow,
      rangeRow,
      [],
      headers,
      ...rows,
      [],
      ["", "", "", ...Array(31).fill(""), grandTotalLunch, grandTotalCost],
      [],
      summaryHeader,
      ...summaryRows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } },
    ];

    ws["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 25 },
      ...Array(31).fill({ wch: 3 }),
      { wch: 12 },
      { wch: 12 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Bookings");
    XLSX.writeFile(wb, fileName);
  };

  // --- Summary list for UI ---
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setSummaryList([]);
      return;
    }

    function normalizeDate(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const start = startDate ? normalizeDate(new Date(startDate)) : null;
    const end = endDate ? normalizeDate(new Date(endDate)) : null;

    const filteredTransactions = transactions.filter((record) => {
      const recordDate = normalizeDate(new Date(record.date));
      if (start && recordDate < start) return false;
      if (end && recordDate > end) return false;
      return true;
    });


    const userMap = new Map();
    filteredTransactions.forEach((record) => {
      record.data.forEach((user) => {
        const key = user.email;
        if (!userMap.has(key)) {
          userMap.set(key, { name: user.name, bookings: Array(31).fill(0) });
        }
        const day = new Date(user.date).getDate();
        userMap.get(key).bookings[day - 1] = Number(user.lunchQuantity) || 0;
      });
    });

    const summary = Array.from(userMap.values()).map(({ name, bookings }) => {
      const totalLunch = bookings.reduce((sum, q) => sum + (Number(q) || 0), 0);
      const totalCost = totalLunch * (Number(lunchPrice) || 0);
      return { name, totalLunch, totalCost, status: "Pending" };
    });

    setSummaryList(summary);
  }, [transactions, startDate, endDate, lunchPrice]); // <- include lunchPrice


  const isDisabled = !startDate || !endDate;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <button
        className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded mt-2 w-[240px] shadow-md"
        onClick={exportToExcel}
        disabled={isDisabled}
      >
        Download Calendar View Excel
      </button>


      <div className="flex gap-2 items-center mb-1">
        <input
          type="date"
          value={startDate}
          onChange={handleDayChange(setStartDate)}
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          min={monthFirstDay}
          max={monthLastDay}
          className="
            border border-gray-400 
            rounded w-28 text-sm 
            cursor-pointer 
            bg-gray-100 text-gray-900 
            placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            "
        />

        <input
          type="date"
          value={endDate}
          onChange={handleDayChange(setEndDate)}
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          min={monthFirstDay}
          max={monthLastDay}
          className="
            border border-gray-400 
            rounded w-28 text-sm 
            cursor-pointer 
            bg-gray-100 text-gray-900 
            placeholder-gray-400
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
            "
        />
      </div>


      {/* ✅ Lunch price input */}
      <div className="flex items-center gap-1 mb-4">
        <label className="text-sm font-semibold">Lunch Price:</label>
        <input
          type="number"
          value={lunchPrice}
          onChange={(e) => setLunchPrice(Number(e.target.value) || 0)}
          className="border rounded  text-sm w-12"
          min="0"
        /> TK
      </div>

      {/* Summary List */}
      {/* Summary List */}
      <div className="border-t pt-2 mt-2">
        {summaryList.length === 0 ? (
          <p className="text-sm">No data for selected range</p>
        ) : (
          <>
            {/* Header row */}
            <div className="flex justify-between text-sm font-bold border-b py-1 bg-gray-400 p-1">
              <span className="w-1/12 ">SL.</span>
              <span className="w-4/12">Name</span>
              <span className="w-4/12 ">Total Lunch</span>
              <span className="w-2/12 ">Total Cost</span>
            </div>

            {/* User rows */}
            {summaryList.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b py-1">
                <span className="w-1/12 ">{idx + 1}</span>
                <span className="w-4/12">{item.name}</span>
                <span className="w-4/12 ">{item.totalLunch}</span>
                <span className="w-2/12 ">{item.totalCost}</span>
              </div>
            ))}

            {/* Grand total row */}
            {/* Grand total row */}
            <div className="flex justify-between text-sm font-bold border-t py-1 bg-gray-400">
              <span className="w-1/12">#</span>
              <span className="w-4/12">Grand Total</span>
              <span className="w-4/12">
                {summaryList.reduce((sum, item) => sum + (item.totalLunch || 0), 0)}
              </span>
              <span className="w-2/12">
                {summaryList.reduce((sum, item) => sum + (item.totalCost || 0), 0)}
              </span>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default ExcelDownloadCalenderView;
