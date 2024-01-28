"use client"
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { useContext } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link'
import Image from 'next/image'
import { AuthContext } from '../AuthProvider/AuthProvider';
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useUsers from "../../../Hooks/useUsers";



const Header = () => {

    const { user, loading, googleLogin, logOut } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { users } = useUsers();

    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');
    // console.log('admin', isAdmin);


    const handleGoogleLogIn = () => {
        if (!user) {
            googleLogin()

                .then(result => {
                    const user = result.user;
                    console.log('user:', user);

                    const data = {
                        name: user.displayName,
                        email: user.email,
                        date: new Date().toLocaleString(),
                        status: 'pending',
                        role: 'user'
                    }
                    console.log('data==', data);
                    if (user) {
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "Logged-In",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // post req to save data to DB 
                    axiosPublic.post(`/users`, data)
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

                <Image width="140" height="100" src={"https://i.ibb.co/9Tp3Wd4/FISLM.png"} alt="Logo" className="mr-1 md:mr-4" />
                {/* <h1 className="text-white text-lg font-bold">TS Blood Donation</h1> */}
            </div>
            <nav className="flex items-center gap-6">
                {
                    isAdmin.length > 0 ?


                        <div className="flex items-center gap-2 md:gap-6">
                            <Link
                                href="/"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><TiHomeOutline className="text-blue-700 text-2xl hover:text-red-500"></TiHomeOutline>

                            </Link>

                            <Link
                                href="/dashboard"
                                className="text-blue-700 flex items-center font-semibold mr-1 md:mr-4 hover:text-gray-600"
                                activeClassName="text-gray-300"
                            ><IoSettingsOutline className="text-blue-700 text-2xl hover:text-red-500"></IoSettingsOutline>

                            </Link>
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
                        <Image className='rounded-xl ' width="50" height="100" src={user ? user?.photoURL : 'https://i.ibb.co/X5pYtby/FISLM-i.png'} alt=''></Image>

                    </div>
                    <div className='flex flex-col justify-center'>
                        {user ?
                            (
                                <div>
                                    <p className='text-blue-700 font-semibold text-xs'>{user?.displayName.slice(0, 7)}</p>
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
                                        }`}
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
