import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import useUsers from '../../../Hooks/useUsers';
import moment from 'moment';


const Lunches = ({ onRefresh, lunches }) => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { users, refetch } = useUsers();
    const [selectedItem, setSelectedItem] = useState('');

    const currentUserData = users?.filter(currentUser => currentUser.email === user?.email);
    const isBooked = lunches?.data?.find(lunch => lunch.email === user?.email);

    const handleBtnErr = () => {
        Swal.fire({
            title: "Please Login First!",
            icon: "warning",
            timer: 1000
        });
    };

    const handleBtnWait = () => {
        refetch();
        Swal.fire({
            title: "Wait for a while",
            text: "Admin will verify your Identity of FlyInfoSoft",
            icon: "warning",
            timer: 3000
        });
    };
    // const dbDate = new Date().toLocaleString()
    // console.log(dbDate)

    // const formattedDate = moment().format('M/D/YYYY, h:mm:ss A');
    // console.log(formattedDate)

    const handleBtn = async () => {
        onRefresh();
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        const data = {
            name: user?.displayName,
            email: user?.email,
            date: moment().format('M/D/YYYY, h:mm:ss A'),
            bookBy: 'user',
            type: 'user',
            lunchQuantity: 1,
            selectedMenu: selectedItem
        };
        console.log(data)

        const startHour = 8;
        const endHour = 11;
        const startMinutes = 0;
        const endMinutes = 59;

        if (
            currentHour < startHour || 
            (currentHour === startHour && currentMinutes < startMinutes) ||
            currentHour > endHour ||
            (currentHour === endHour && currentMinutes > endMinutes)
        ) {
            Swal.fire({
                title: "Can't Book Now",
                text: "You can only book Lunch between 8 AM to 12 PM.",
                icon: "warning",
                timer: 3000
            });
            return;
        }

        const { value: selectedMenuItem } = await Swal.fire({
            title: "Booking Time: 8 AM to 12 PM",
            text: "Booking Time: 8 AM to 12 PM",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Book Lunch!",
            // timer: 10000,
            html: `
            <div>
                <select id="menuSelect">
                    ${
                        lunches?.menu?.length > 0 ?
                        `<option value="">Select Item</option>` +
                        lunches.menu.map((item, index) => (
                            `<option key=${index} value="${item}">${item}</option>`
                        )).join('') 
                        // +
                        // `<option value="Common Item">Any Common Item</option>`
                        :
                        `<option value="" disabled selected>Wait, Updating Items...</option>` 
                        // <option value="Common Item">Any Common Item</option>
                    }
                </select>

            </div>

            `,
            customClass: {
                validationMessage: 'small-validation-message'
            },
            preConfirm: () => {
                const selectedOption = document.getElementById('menuSelect');
                const selectedMenuItem = selectedOption.value;
                
                if (!selectedMenuItem) {
                    Swal.showValidationMessage('Please select an item');
                    setTimeout(() => {
                        const validationMessage = document.querySelector('.swal2-validation-message');
                        if (validationMessage) {
                            validationMessage.style.display = 'none';
                        }
                    }, 3000);
                    return false;
                }
                
                setSelectedItem(selectedMenuItem.trim()); // Set selected item here
                return selectedMenuItem.trim();
            },
        
        });
        
        

        if (selectedMenuItem) {
            console.log(selectedMenuItem)
            setSelectedItem(selectedMenuItem); // Set selected item
            data.selectedMenu = selectedMenuItem;
            // console.log(data)
            await axiosPublic.post(`/lunch`, data)
                .then(res => {
                    if (res.data.insertedId || res.data.modifiedCount) {
                        onRefresh();
                        Swal.fire({
                            title: "Booked!!",
                            text: "Your Lunch has been Booked.",
                            icon: "success",
                            position: "top-center",
                            showConfirmButton: false,
                            timer: 1000
                        });
                    } else if (res.data.message) {
                        Swal.fire({
                            title: "Already Booked!",
                            icon: "warning",
                            timer: 2000
                        });
                    }
                });
        }
    };

    return (
        <div>
            {currentUserData[0]?.status === 'approve' &&
                <button disabled={isBooked} className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' 
                onClick={() => handleBtn()}>
                    {isBooked? 'Lunch Confirmed' : 'Book Now'}
                </button>
            }
            {currentUserData[0]?.status === 'pending' &&
                <button className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' onClick={() => handleBtnWait()}>
                    Book Now⏳
                </button>
            }
            {!user &&
                <button className='bg-blue-700 mr-1 border rounded border-white hover:border-transparent text-white font-bold py-2 px-4' onClick={() => handleBtnErr()}>
                    Book Now
                </button>
            }
        </div>
    );
};

export default Lunches;
