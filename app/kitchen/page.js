"use client"
import React, { useContext } from 'react';
import { IoMdMenu } from "react-icons/io";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../components/AuthProvider/AuthProvider';
import useStore from '../store';


const Page = () => {

    const user = useStore((state) => state.user);
    const users = useStore((state) => state.users);
    const refetch = useStore((state) => state.fetchUsers);
    const router = useRouter();


    const currentUserData = users?.filter(currentUser => currentUser.email === user?.email);

    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');

    const activeRouteColor = {
        backgroundColor: router.pathname === '/manageusers' ? 'bg-black' : 'bg-blue-700',
        color: router.pathname === '/manageusers' ? '#fff' : '',
    };
    return (

        isAdmin ?
            <div className="drawer lg:drawer-open bg-white w-full">

                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-end p-2 justify-center lg:hidden">
                    {/* Page content here */}

                    <label htmlFor="my-drawer-2" className="drawer-button">

                        <IoMdMenu className='text-xl m-2 text-black hover:cursor-pointer hover:text-red-500 mr-2'></IoMdMenu></label>

                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
                        <h1 className="text-xl text-center font-bold">Kitchen Dashboard
                            <span className='text-xs font-normal'>
                                <p>Email: {currentUserData[0]?.email}
                                </p>
                            </span>
                        </h1>


                        {/* Sidebar content here */}
                        <Link href="/kitchen/dashboard" className={`bg-blue-700 mr-1 border rounded border-transparent hover:border-white text-white font-bold py-2 px-4 `}>
                            <p className='text-center'>
                                Dashboard
                            </p>
                        </Link>

                        <Link href="/kitchen/profile" className={`bg-blue-700 mr-1 border rounded border-transparent hover:border-white text-white font-bold py-2 px-4 `}>
                            <p className='text-center'>
                                Kitchen Profile
                            </p>
                        </Link>
                        <Link href="/kitchen/updateprofile" className={`bg-blue-700 mr-1 border rounded border-transparent hover:border-white text-white font-bold py-2 px-4 `}>
                            <p className='text-center'>
                                Update Profile
                            </p>
                        </Link>
                       
                        <Link href="/kitchen/addfood" className={`bg-blue-700 mr-1 border rounded border-transparent hover:border-white text-white font-bold py-2 px-4 `}>
                            <p className='text-center'>
                                Add Food
                            </p>
                        </Link>

                        <Link href="/kitchen/editfood" className={`bg-blue-700 mr-1 border rounded border-transparent hover:border-white text-white font-bold py-2 px-4 `}>
                            <p className='text-center'>
                                Edit Food
                            </p>
                        </Link>



                    </ul>

                </div>
            </div>
            :
            <div className='flex justify-center items-center'>
                <h2>You are not and admin</h2>
            </div>


    );
};

export default Page;