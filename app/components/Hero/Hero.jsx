"use client"
import React from 'react';
import BookingButton from '../BookingButton/BookingButton';
import useBookings from '../hooks/useBookings';

const Hero = () => {
    const { lunches, refetch } = useBookings()

    // console.log(lunches?.data);

    return (
        <div
            className="relative h-[600px] flex flex-col justify-center items-center text-white text-center"
            style={{
                backgroundImage: 'url("https://i.ibb.co/sFPBJqp/FIS-BG.jpg")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center-center',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <h1 className="text-3xl font-bold z-10 pl">FlyInfoSoft Lunch Manager</h1>

            <div className="mt-4 z-10 flex flex-col items-center">

                <BookingButton loadedLunches={lunches} onRefresh={refetch} />

                <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {lunches &&
                        lunches?.data?.map((lunch, index) => (
                            <div key={index} className=" border p-2 text-sm rounded-md shadow">
                                {lunch?.name}
                            </div>
                        ))}
                </div>
            </div>





        </div>
    );
};

export default Hero;