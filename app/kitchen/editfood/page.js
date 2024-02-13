import React from 'react';
import Kitchen from '../../kitchen/page'

const page = () => {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='bg-transparent md:w-1/4'>
                <Kitchen></Kitchen>
            </div>
            <div className='bg-blue-500  px-1 md:px-12 p-4 w-full'>
                <h2 className=' text-xl font-bold my-4'>Kitchen Edit</h2>

                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center  pointer-events-none">

                    </div>

                </div>
                <div>



                </div>
            </div>

        </div>
    );
};

export default page;