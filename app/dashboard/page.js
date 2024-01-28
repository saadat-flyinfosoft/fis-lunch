"use client"
import { BsCalendarDate } from "react-icons/bs";
import React, { useContext, useEffect, useState } from 'react';
import Manage from '../manage/page';
import DatePicker from 'react-datepicker';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import moment from 'moment';
import useUsers from "../../Hooks/useUsers";
import { AuthContext } from "../components/AuthProvider/AuthProvider";
import MonthlyDataView from "../components/MonthlyDataView/MonthlyDataView";
import "react-datepicker/dist/react-datepicker.css";





const Page = () => {

    const axiosPublic = useAxiosPublic();
    const [selectedDate, setSelectedDate] = useState(null);
    const { user } = useContext(AuthContext);
    const { users, } = useUsers();
    const [days, setDays] = useState([]);

    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // setDays(date);

        const formattedDate = date ? moment(date).format('M/YYYY') : null;

        axiosPublic.get(`/monthly/?date=${formattedDate}`)
            .then(res => {
                setDays(res.data)
                console.log(res.data);

            })
            .catch(error => {
                console.error('Error fetching selected date data:', error);
            });

    };
    useEffect(() => {
        console.log('days', days);
    }, [days])
    // console.log(days);




    return (
        isAdmin.length ?
            <div className='flex flex-col md:flex-row'>
                <div className='bg-transparent md:w-1/4'>
                    <Manage></Manage>
                </div>
                <div className='bg-blue-500 p-4 w-full md:w-3/4'>
                    <h2 className=' text-xl font-bold my-4'>Dashboard</h2>

                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center  pointer-events-none">

                            <BsCalendarDate className="text-xl m-2"></BsCalendarDate>
                        </div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Select a month"
                            className="outline-none pl-10 p-1 rounded hover:cursor-pointer"

                        />
                    </div>
                    <div>
                        {
                            days.length > 0 ? <MonthlyDataView data={days} />
                                :
                                <div className='my-8'>
                                    <h2>No data found or Select a month first</h2>
                                </div>
                        }

                        {days && days.map((item) => (
                            <div className="" key={item._id}>
                                <div className="block bg-blue-500 m-1 gap-1 border md:flex items-center">
                                    <p className="bg-blue-700 rounded p-1 m-1 gap-1 flex">{item.date}
                                        <span className="px-2 bg-blue-500 rounded-full">{item.data.length}</span>
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-1 ">
                                        {item.data.map((names, i) => (
                                            <div key={i} className="bg-slate-0 text-center bg-green-600 rounded text-xs p-1 m-1">
                                                {names.name}
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            :
            <div className='flex justify-center items-center'>
                <h2>You are not an admin</h2>
            </div>

    );
};

export default Page;