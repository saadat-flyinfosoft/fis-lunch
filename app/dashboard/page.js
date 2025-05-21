"use client";
import { BsCalendarDate } from "react-icons/bs";
import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import Manage from "../manage/page";
import DatePicker from "react-datepicker";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import moment from "moment";
import useUsers from "../../Hooks/useUsers";
import { AuthContext } from "../components/AuthProvider/AuthProvider";
import MonthlyDataView from "../components/MonthlyDataView/MonthlyDataView";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../Shared/Loading";
import XlsxDownloadButton from "../components/XlsxDownloadButton/XlsxDownloadButton";
import ExcelDownloadCalenderView from "../components/XlsxDownloadButton/XlsxDownloadCalenderView";

const Page = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useContext(AuthContext);
  const { users } = useUsers();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [downloadByDate, setDownloadByDate] = useState(null);
  const memoizeDays = useMemo(() => days, [days]);

  console.log(memoizeDays);

  const isAdmin = useMemo(() => {
    return users.filter(
      (currentUser) =>
        currentUser.email === user?.email && currentUser.role === "admin"
    );
  }, [users, user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setLoading(true); // Set loading to true before fetching data
    const formattedDate = date ? moment(date).format("M/YYYY") : null;

    axiosPublic
      .get(`/monthly/?date=${formattedDate}`)
      .then((res) => {
        setDays(res.data);
        setDownloadByDate(formattedDate);
      })
      .catch((error) => {
        console.error("Error fetching selected date data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data (success or failure)
      });
};

  // console.log(formattedDate)
  // console.log(downloadByDate)

  useEffect(() => {
    handleDateChange(new Date());
  }, []);

  const getGuestCount = useMemo(() => {
    return (data) => {
      return data.reduce((acc, item) => {
        if (item?.type === "guest") {
          acc += item.lunchQuantity;
        }
        return acc;
      }, 0);
    };
  }, []);

  const getUserCount = useMemo(() => {
    return (data) => {
      return data.reduce((acc, item) => {
        if (item?.type === "user") {
          acc += item.lunchQuantity;
        }
        return acc;
      }, 0);
    };
  }, []);

  const handleOpenModal = (day) => {
    setActiveDay(day);
    document.getElementById("my_modal_2").showModal();
  };

  const handleCloseModal = () => {
    setActiveDay(null);
    document.getElementById("my_modal_2").close();
  };

  const memoizedDays = useMemo(() => {
    return memoizeDays.map((item) => (
      <div className="" key={item._id}>
        
        <div className="block bg-slate-600 m-1 gap-1 border mt-2 p-2 border-slate-500 md:flex items-center hover:bg-slate-100 hover:p-2 hover:cursor-pointer">
          <div className="tooltip" data-tip="view detail">
            <p
              className="bg-slate-700 w-auto justify-center rounded p-1 m-1 gap-1 flex  cursor-pointer hover:bg-blue-600 " 
              onClick={() => handleOpenModal(item)}
            >
              <button className=" text-xs">🗨️</button>
              {item.date}
              <span className="px-2 text-sm flex items-center bg-slate-500 rounded-full">
                {getGuestCount(item.data) + getUserCount(item.data)}
              </span>
            </p>

            {/* menu  */}
            {showMenu && <p>{item.menu?.map((todaysMenu,i)=> <p className="m-1 text-sm text-slate-400 flex" key={i}>{i+1}. {todaysMenu}</p>)}</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 bg-slate-00 w-full ">
            {item.data.map((names, i) => (
              <div
                key={i}
                className={`bg-slate-0 text-center bg-slate-300 text-black rounded text-xs p-1 m-1 ${
                  names?.bookBy === "admin" ? "bg-yellow-200" : ""
                }`}
              >
                <div className="">
                  {names.name}
                  {names?.type === "guest" && (
                    <span className="rounded-full border px-1 ml-1">
                      {names?.lunchQuantity}
                    </span>
                  )}
                  <br />
                  {
                    showMenu &&
                    <span className="text-10px text-slate-500">
                    {names?.selectedMenu}
                  </span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [memoizeDays, getGuestCount, getUserCount, showMenu]);

  return isAdmin.length ? (
    <div className="flex flex-col md:flex-row">
      <div className="bg-transparent z-10">
        <Manage />
      </div>
      <div className="bg-slate-600 px-1 md:px-12 p-4 w-full">
        <h2 className="text-xl font-bold my-4">Dashboard</h2>
        
        <div className=" flex flex-col ">
          <XlsxDownloadButton date ={downloadByDate}/>
          <ExcelDownloadCalenderView transactions={memoizeDays} fileName="Monthly_Lunch.xlsx" />
        </div>

        
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
            <BsCalendarDate className="text-xl m-2" />
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            placeholderText="Select a month"
            className="outline-none pl-10 p-1 rounded hover:cursor-pointer"
          />
          {
            loading && 
            <span>
              <span className="loading text-blue-300 loading-bars loading-md mt-2 h-5 ml-1"></span>
              <span className="loading text-blue-300 loading-bars loading-md mt-2 h-5 ml-1"></span>
            </span>
          }
        </div>
        <div>
          {memoizeDays.length > 0 ? (
            <MonthlyDataView  date ={downloadByDate} data={memoizeDays} />
          ) : (
            <div className="my-8">
              <h2>No data found or Select a month first</h2>
            </div>
          )}
        {/* show hide menu button  */}
        <input onChange={() => setShowMenu((prev) => !prev)} type="checkbox" className="toggle toggle-info mt-8" />
          {memoizedDays}
        </div>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box text-gray-400">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">Menu for {activeDay?.date}</h3>
            <h3 className="font-bold text-lg cursor-pointer text-red-200 hover:text-red-300" onClick={handleCloseModal}>X</h3>
          </div>
          <ul className="py- list-disc list-inside">
            {activeDay?.menu && activeDay.menu.map((menuItem, index) => (
              <p key={index}>👉 {menuItem}</p>
            ))}
          </ul>
          <ul className="list-disc list-inside">
            {activeDay?.data.map((menu, index) => (
              <div className="mt-4" key={index}>
                <p className="font-bold">{index + 1}.</p>
                <p>Name : {menu.name}</p>
                <p>Eaten : {menu.selectedMenu}</p>
                {menu?.type === "guest" && (
                  <span className="text-yellow-100">
                    <p>Lunch Quantity : {menu.lunchQuantity}</p>
                    <p>Note : {menu.note}</p>
                    <p>Modified : {menu?.modifiedCount? menu.modifiedCount : 0} time</p>
                  </span>
                )}
                <p>Booked By : <span>{menu?.bookBy}</span></p>
                {
                  menu?.forceUpdateMenu &&
                  <p>Force Update Menu : {menu.forceUpdateMenu}</p>
                }
                { menu?.adminName &&
                  <p><span>Admin name: {menu?.adminName}</span></p>
                }
                <p><span>{menu?.date}</span></p>
              </div>
            ))}
          </ul>
          <form method="dialog" className="modal-backdrop" onClick={handleCloseModal}>
            <button className="btn mt-4">Close</button>
          </form>
        </div>
      </dialog>
    </div>
  ) : <Loading></Loading>;
};

export default Page;
