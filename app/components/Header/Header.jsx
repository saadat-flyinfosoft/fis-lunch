"use client"
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link'
import Image from 'next/image'
import { AuthContext } from '../AuthProvider/AuthProvider';
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useUsers from "../../../Hooks/useUsers";
import useBookings from "../../../Hooks/useBookings";



const Header = () => {

    const { user, loading, googleLogin, logOut } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { users, refetch } = useUsers();
    const [localUser, setLocalUser] = useState(null);
    const { lunches, refetch: refetchLunches } = useBookings()

    console.log('localUser', localUser?.displayName, localUser?.email);

    useEffect(() => {
        // Check if the user is already available in the local state
        if (!localUser) {
            setLocalUser(user);
        }
    }, [user, localUser]);


    const isAdmin = users.filter(currentUser => currentUser.email === localUser?.email && currentUser.role === 'admin');
    // console.log('admin', isAdmin);
    // console.log(users)


    const handleGoogleLogIn = () => {
        if (!user) {
            googleLogin()

                .then(async(result) => {
                    const user = result.user;
                    setLocalUser(user);
                    console.log('user:', user);

                    const data = {
                        name: user.displayName,
                        email: user.email,
                        status: 'pending',
                        role: 'user',
                        date: new Date().toLocaleString()
                    }
                    console.log('data==', data);
                    if (user) {
                        refetch();
                        refetchLunches()
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "Logged-In",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // post req to save data to DB 
                    await axiosPublic.post(`/users`, data)
                    console.log('first')
                        .then(res => {
                            console.log(res.data);

                            if (res.data.insertedId) {
                                console.log('user Inserted to DB');
                            }
                        })

                })
        } else {
            logOut();
        }
    };

    return (
        <header className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="flex items-center">
                {/* Replace 'logo.svg' with your actual logo */}

                <Image width="130" height="100" src={"https://i.ibb.co/9Tp3Wd4/FISLM.png"} alt="Logo" className="mr-1 md:mr-4" />
                {/* <h1 className="text-white text-lg font-bold">TS Blood Donation</h1> */}
            </div>
            <nav className="flex items-center gap-2 md:gap-6">
                {
                    isAdmin.length > 0 ?


                        <div className="flex items-center gap-2 md:gap-6">
                            <Link
                                href="/"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><TiHomeOutline className="text-blue-700 text-2xl ml-2 hover:text-red-500"></TiHomeOutline>

                            </Link>

                            <Link
                                href="/dashboard"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><IoSettingsOutline className="text-blue-700 text-2xl hover:text-red-500"></IoSettingsOutline>

                            </Link>

                            {/* <Link
                                href="/kitchen/dashboard"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><IoSettingsOutline className="text-red-700 text-2xl hover:text-red-500"></IoSettingsOutline>

                            </Link> */}
                        </div>
                        :
                        <div className="flex mr-8 md:mr-0">
                            <Link
                                href="/"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><TiHomeOutline className="text-blue-700 text-2xl hover:text-red-500"></TiHomeOutline>

                            </Link>


                        </div>
                }


                <div className='flex gap-2'>

                    <div className='flex justify-center items-center gap-2'>
                        <Image className='rounded-xl ' width="50" height="100" src={localUser ? localUser?.photoURL : 'https://i.ibb.co/X5pYtby/FISLM-i.png'} alt=''></Image>

                    </div>
                    <div className='flex flex-col justify-center'>
                        {user ?
                            (
                                <div>
                                    <p className='text-blue-700 font-semibold text-xs'>{localUser?.displayName.slice(0, 9)}</p>
                                    <button
                                        onClick={handleGoogleLogIn}
                                        className={` border rounded px-2 text-white hover:text-gray-300 ${user ? 'bg-red-500' : 'bg-red-500'
                                            }`}
                                    >

                                        Logout
                                    </button>
                                </div>
                            )
                            :
                            (
                                <button
                                    onClick={handleGoogleLogIn}
                                    className={` border rounded px-2 text-white hover:text-gray-300 ${user ? 'bg-red-500' : 'bg-blue-700'
                                        }`} disabled={!users.length}
                                >
                                    Login
                                </button>
                            )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
