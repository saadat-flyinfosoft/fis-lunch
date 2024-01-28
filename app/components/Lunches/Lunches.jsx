"use client"
import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useAxiosPublic from '../../../app/components//useAxiosPublic';
import Swal from 'sweetalert2'
import useUsers from '../../../app/components//useUsers';



const Lunches = ({onRefresh}) => {

    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const { users, } = useUsers();

    const currentUserData = users?.filter(currentUser => currentUser.email === user?.email);


    const handleBtnErr = () => {
        Swal.fire({
            title: "Please Login First!",
            icon: "warning"
        });
    }
    const handleBtnWait = () => {
        Swal.fire({
            title: "Wait for a while",
            text: "Admin will verify your Identity of FlyInfoSoft",
            icon: "warning"
        });
    }

    const handleBtn = () => {

        const data = {
            name: user?.displayName,
            email: user?.email,
            date: new Date().toLocaleString(),
        }

        // Allow booking only between 10 am and 12 pm
        if (currentHour < 10 || currentHour >= 19) {
            Swal.fire({
                title: "Can't Book Now",
                text: "You can only book Lunch between 10 am to 12 pm.",
                icon: "warning"
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Booking Time: 10AM to 12PM",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Book Lunch!"
        }).then((result) => {
            if (result.isConfirmed) {

                axiosPublic.post(`/lunch`, data)
                    .then(res => {
                        // console.log(res.data);

                        if (res.data.insertedId || res.data.modifiedCount) {
                            console.log('lunch data Inserted to DB');
                            onRefresh();
                            Swal.fire({
                                title: "Booked!",
                                text: "Your Lunch has been Booked.",
                                icon: "success"
                            });
                        }
                        else if (res.data.message) {

                            Swal.fire({
                                title: "Already Booked!",
                                icon: "warning"
                            });
                        }
                    })


            }
        });


    }
    return (
        <div>
            {
                user ?
                    currentUserData[0]?.status === 'approve' ?
                        <button className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' onClick={() => handleBtn()}>Book Now</button>
                        :
                        <button className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' onClick={() => handleBtnWait()}>Book Now</button>


                    :
                    <button className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' onClick={() => handleBtnErr()}>Book Now</button>
            }
        </div>
    );
};

export default Lunches;