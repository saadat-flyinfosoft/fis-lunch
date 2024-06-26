"use client"
import React, { useContext, useMemo } from 'react';
import BookingButton from '../BookingButton/BookingButton';
import useBookings from '../../../Hooks/useBookings';
import Priority from '../Priority/Priority';

const Hero = () => {
    const { lunches, refetch } = useBookings();

    const memoizedLunches = useMemo(() => {
        return lunches?.data?.map((lunch, index) => (
            <div key={index} className={`border p-2 text-sm rounded-md shadow ${lunch?.bookBy === 'admin' ? 'border border-white text-yellow-200' : ''}`}>
                {lunch?.name}
                {lunch?.type === 'guest' && (
                    <span className='rounded-full border px-1 ml-1'>{lunch?.lunchQuantity}</span>
                )}
            </div>
        ));
    }, [lunches]);

    console.log(lunches?.data);

    return (
        <div
            className="relative h-[100vh] flex flex-col justify-center items-center text-white text-center"
            style={{
                backgroundImage: 'url("https://i.ibb.co/sFPBJqp/FIS-BG.jpg")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center-center',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <Priority />
            <h1 className="text-2xl font-bold z-10 pl">FlyInfoSoft Lunch Manager</h1>

            <div className="mt-4 z-10 flex flex-col items-center">
                <BookingButton loadedLunches={lunches} onRefresh={refetch} />

                <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {memoizedLunches}
                </div>
            </div>
        </div>
    );
};

export default Hero;
