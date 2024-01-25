"use client"
import React from 'react';
import Lunches from '../Lunches/Lunches';


const BookingButton = ({ onRefresh, loadedLunches }) => {

    console.log(loadedLunches?.data?.length);

    return (
        <div className='flex'>
            <span>
                <Lunches onRefresh={onRefresh} />
            </span>

            <button className="bg-red-500 border rounded border-white hover:border-red-500 text-white font-bold py-2 px-4">
                {new Date().toLocaleDateString()} :
                <span className=''> {loadedLunches ? loadedLunches?.data?.length : 0} {loadedLunches?.data?.length > 1 ? 'Lunches' : 'Lunch'}</span>
            </button>
        </div>
    );
};

export default BookingButton;