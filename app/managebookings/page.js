import Manage from '../manage/page';
import React from 'react';


const managebookings = () => {
    return (
        <div className='flex'>
            <div className='bg-transparent'>
                <Manage></Manage>

            </div>
            <div className='bg-blue-500 p-4 w-full'>
                <h2>Manage All Bookings</h2>
            </div>
        </div>
    );
};

export default managebookings;