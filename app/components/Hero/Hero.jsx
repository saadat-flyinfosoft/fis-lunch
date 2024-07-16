"use client"
import React, { useContext, useMemo } from 'react';
import BookingButton from '../BookingButton/BookingButton';
import useBookings from '../../../Hooks/useBookings';
import Priority from '../Priority/Priority';
import SelectMenu from '../SelectMenu/SelectMenu';
import useUsers from '../../../Hooks/useUsers';
import { AuthContext } from '../AuthProvider/AuthProvider';

const Hero = () => {
    const { lunches, refetch } = useBookings();
    const { users,  } = useUsers();
    const { user } = useContext(AuthContext);
    
    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');



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

    console.log(lunches);



    // Function to count selectedMenu occurrences
const countSelectedMenu = (lunches) => {
    const menuCounts = {};
  
    lunches?.data?.forEach(user => {
      const { selectedMenu } = user;
      if (selectedMenu) {
        if (menuCounts[selectedMenu]) {
          menuCounts[selectedMenu]++;
        } else {
          menuCounts[selectedMenu] = 1;
        }
      }
    });
  
    return menuCounts;
  };
  
  const menuCounts = countSelectedMenu(lunches);
  
  console.log(menuCounts);
  console.log(lunches)
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
            {/* <Priority /> */}
            <div className='z-10'>
                { Object.keys(menuCounts).length > 0 &&
                    <button className="border rounded-md px-3 text-xl" onClick={()=>document.getElementById('my_modal_3').showModal()}>ℹ️</button>
                }
            </div>
            <div className='z-10 mt-4'>
                {
                isAdmin.length ?
                <SelectMenu/> 
                :
                <></>
                }
            </div>

            <h1 className="text-2xl font-bold z-10 pl">FlyInfoSoft Lunch Manager</h1>

            <div className="mt-4 z-10 flex flex-col items-center">
                <BookingButton loadedLunches={lunches} onRefresh={refetch} />

                <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {memoizedLunches}
                </div>
                

                
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box h-auto">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 md:right-2 md:top-2"><span className='text-red-300'>✕</span></button>
                            </form>
                                {/*  Start selected Menu Items  */}
                            <div className='grid grid-cols-2 md:flex justify-center gap-1 items-center'>

                                {
                                    Object.entries(menuCounts).map(([menuItem, count]) => (
                                        <p className='border text-gray-50 uppercas bg-blue-800 gap-2 mx-2 md:mx-2 text-sm rounded-md px-2 md:px-4 ' key={menuItem}>
                                            {menuItem} : {count}
                                        </p>
                                    ))
                                }
                                
                                {/* End selected Menu Items  */}
                            </div>
                            <div className='mt-12'>
                                {
                                        lunches.data?.map((user, i) => (
                                            <p className='border px-2 rounded-md flex justify-center text-gray-400 mt-1' key={i}>
                                                <div className='flex flex-col items-center text-lg'>
                                                    <small>
                                                        ({i+1}). {user.name} <span className='font-bold'>:</span> <span className='uppercas'>{user.selectedMenu}</span>
                                                    </small>
                                                </div>
                                            </p>
                                        ))
                                }
                            </div>
                        </div>
                    </dialog>
            </div>
        </div>
    );
};

export default Hero;
