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
import Loading from "../../Shared/Loading";





const Page = () => {

    const axiosPublic = useAxiosPublic();
    const [selectedDate, setSelectedDate] = useState(null);
    const { user } = useContext(AuthContext);
    const { users, } = useUsers();
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);


    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setLoading(true);
        const formattedDate = date ? moment(date).format('M/YYYY') : null;

        axiosPublic.get(`/monthly/?date=${formattedDate}`)
            .then(res => {
                setDays(res.data)
                // console.log(res.data);

            })
            .catch(error => {
                console.error('Error fetching selected date data:', error);
            });
        setLoading(false);

    };
    useEffect(() => {
        console.log('days', days);
    }, [days])

    useEffect(() => {
        console.log('days', days);
        handleDateChange(new Date());
    }, [])


    const guestLunchQuantity = days?.find(day =>
        day?.data?.some(guest => guest.email === 'guest@gmail.com')
    )?.data.find(guest => guest.email === 'guest@gmail.com')?.lunchQuantity - 1 || 0;

    // console.log('guestLunchQuantity', guestLunchQuantity);



    const getGuestCount = (data) => {
        let count = data.reduce((acc, item) => {
            if (item?.type === 'guest') {
                console.log('item::', item);
                acc += item.lunchQuantity
            }
            return acc;
        }, 0)
        console.log('count::', count);
        return count;
    }

    const getUserCount = (data) => {
        let count = data.reduce((acc, item) => {
            if (item?.type === 'user') {
                console.log('item::', item);
                acc += item.lunchQuantity
            }
            return acc;
        }, 0)
        console.log('count::', count);
        return count;
    }




    return (
        loading ?
            <Loading></Loading>
            :
            isAdmin.length ?
                <div className='flex flex-col md:flex-row'>
                    <div className='bg-transparent z-10'>
                        <Manage></Manage>
                    </div>
                    <div className='bg-blue-500  px-1 md:px-12 p-4 w-full'>
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
                                days.length > 0 ? <MonthlyDataView guestLunchQuantity={guestLunchQuantity} data={days} />
                                    :
                                    <div className='my-8'>
                                        <h2>No data found or Select a month first</h2>
                                    </div>
                            }

                            {
                                days && days.map((item) => (
                                    <div className="" key={item._id}>
                                        <div className="block bg-blue-500 m-1 gap-1 border md:flex items-center">
                                            <p className="bg-blue-700 rounded p-1 m-1 gap-1 flex">{item.date}
                                                <span className="px-2 bg-blue-500 rounded-full">{getGuestCount(item.data) + getUserCount(item.data)}</span>
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-6 gap-1 ">
                                                {item.data.map((names, i) => (
                                                    <div key={i} className={`bg-slate-0 text-center bg-gray-100 text-black rounded text-xs p-1 m-1 ${names?.bookBy === 'admin' ? 'bg-yellow-100' : ''}`}>
                                                        <div>
                                                            {names.name}
                                                            {
                                                                names?.type === 'guest' &&
                                                                <span className='rounded-full border px-1 ml-1'>{names?.lunchQuantity}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>
                :
                <></>

    );
};

export default Page;