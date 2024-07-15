"use client"
import React from 'react';
import Lunches from '../Lunches/Lunches';


const BookingButton = ({ onRefresh, loadedLunches }) => {

    // console.log(loadedLunches?.data);

    const guestLunch = loadedLunches?.data?.find(lunch => lunch.email === 'guest@gmail.com');

    const guestQuantity = guestLunch?.lunchQuantity || 0;
    const guestCount = guestQuantity > 0 ? guestQuantity - 1 : 0;

    const lunchLen = loadedLunches?.data?.length || 0;


    // console.log((guestQuantity));

    return (
        <div className='flex'>
            <span>
                <Lunches onRefresh={onRefresh} lunches={loadedLunches} />
            </span>

            {
                loadedLunches?.data?.length >= 0 || 'undefined' ?
                    <button className="bg-red-500 border rounded border-white hover:border-red-500 text-white font-bold py-2 px-4">
                        {new Date().toLocaleDateString()} :
                        <span className=''> {loadedLunches ? lunchLen + guestCount : 0} {loadedLunches?.data?.length > 1 ? 'Lunches' : 'Lunch'}</span>
                    </button>
                    :
                    <button className="bg-red-500 border rounded border-white hover:border-red-500 text-white font-bold py-2 px-4">
                        {new Date().toLocaleDateString()} :
                        <span className='mx-2'>
                            <span className="loading loading-spinner loading-xs"></span> Lunch
                        </span>
                    </button>

            }
        </div>
    );
};

export default BookingButton;