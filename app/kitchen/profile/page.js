"use client"
import { useContext } from 'react';
import useUsers from '../../../Hooks/useUsers';
import Kitchen from '../../kitchen/page'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'

import Loading from '../../../Shared/Loading';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';



const Page = () => {

    const { user } = useContext(AuthContext);
    const { users, refetch } = useUsers();
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    // const isAdmin = users.find(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');

    const currentUserData = users?.find(currentUser => currentUser.email === user?.email);
    const isAdmin = currentUserData?.email === user?.email && currentUserData?.role === 'admin' ? true : false;


    console.log('currentUserData', currentUserData);
    isAdmin && console.log('admin true', isAdmin)





    return (

        user && isAdmin ?
            <div className='flex flex-col md:flex-row'>
                <div className='bg-transparent md:w-1/4'>
                    <Kitchen></Kitchen>
                </div>
                <div className='bg-blue-500 px-1 md:px-12 p-4 w-full'>

                    <h2 className='font-bold mb-4'>Kitchen Profile</h2>

                    <div className="mx-auto bg-slate-200 p-8 shadow-lg rounded-md mt-10">
                        <Image
                            width={150} height={150}
                            src="https://placekitten.com/150/150" // Replace with your profile picture URL
                            alt="Profile"
                            className="rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentUserData?.orgName}</h2>
                        <p className="text-gray-600 text-xl">Kitchen Manager,</p>
                        <p className="text-gray-600  mb-4">Type: {currentUserData?.orgType}</p>
                        <div className="flex items-center mt-4 ">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px] ">Name:</span>
                            <span className="text-gray-800">{currentUserData?.managerName}</span>
                        </div>

                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">Location:</span>
                            <span className="text-gray-800">{currentUserData?.location}</span>
                        </div>


                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">Phone:</span>
                            <Link href="tel:01303033418" className="text-blue-500 hover:underline">
                            {currentUserData?.contactNumber}
                            </Link>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">Email:</span>
                            <Link href="mailto:saadat.flyinfosoft@gmail.com" className="text-blue-500 hover:underline">
                            {currentUserData?.email}
                            </Link>
                        </div>

                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">UserID:</span>
                            <span className="text-gray-800">{currentUserData?.username}</span>
                        </div>


                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">Map:</span>
                            <Link
                                href={currentUserData?.map}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Google map
                            </Link>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-gray-800 font-semibold mr-2 w-[66px]">Website:</span>
                            <Link
                                href={currentUserData?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {currentUserData?.website}
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            :
            <Loading></Loading>

    );
};

export default Page;