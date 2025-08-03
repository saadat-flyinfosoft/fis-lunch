"use client"
import { useContext, useMemo, useState } from 'react';
import Manage from '../manage/page';
import { AuthContext } from '../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'
import Loading from '../../Shared/Loading';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import useStore from '../store';



const Page = () => {

    const user = useStore((state) => state.user);
    const users = useStore((state) => state.users);
    const refetch = useStore((state) => state.fetchUsers);
    const refetchLunches = useStore((state) => state.fetchLunches);
    const lunches = useStore((state) => state.lunches);
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [selectedItem, setSelectedItem] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, users]);


    const isAdmin = users.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');
    const guestData = lunches?.data?.filter(lunch => lunch.type === 'guest');
    // console.log("guest", guestData)

    // const currentUserData = users?.filter(currentUser => currentUser.email === user?.email);

    // console.log(isAdmin?.[0]?.name);


    const handleBookForUser = async (name, email) => {

        const now = new Date();
        const startHour = 6, 
        startMinutes = 0;
        const endHour = 12, 
        endMinutes = 0;

        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        const isWithinBookingTime =
            (currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes)) &&
            (currentHour < endHour || (currentHour === endHour && currentMinutes <= endMinutes));

        // ⛔ Show warning if outside time window
        if (!isWithinBookingTime) {
            Swal.fire({
            icon: "warning",
            title: "Booking Closed",
            text: "Booking is allowed max 12 PM for admin",
            timer: 3000
            });
            return;
        }


        refetchLunches();

        const data = {
            name: name,
            email:  email,
            date: moment().format('M/D/YYYY, h:mm:ss A'),
            bookBy: 'admin',
            adminName: isAdmin?.[0]?.name,
            type: 'user',
            lunchQuantity: 1,
            selectedMenu: selectedItem
        };
        // console.log(data)


        const { value: selectedMenuItem } = await Swal.fire({
            title: "Booking Time: 6 AM to 11: 30 AM",
            text: "Booking Time: 6 AM to 11: 30 AM",
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
                        `<option value="" disabled selected>Wait, Updating Items...</option> 
                        `
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
            axiosPublic.post(`/lunch`, data)
                .then(res => {
                    if (res.data.insertedId || res.data.modifiedCount) {
                        refetchLunches();
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
    

    const handleBookForGuest = (formData) => {

        const now = new Date();
        const startHour = 6, 
        startMinutes = 0;
        const endHour = 12, 
        endMinutes = 0;

        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        const isWithinBookingTime =
            (currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes)) &&
            (currentHour < endHour || (currentHour === endHour && currentMinutes <= endMinutes));

        // ⛔ Show warning if outside time window
        if (!isWithinBookingTime) {
            Swal.fire({
            icon: "warning",
            title: "Booking Closed",
            text: "Booking is allowed max 12 PM for admin",
            timer: 3000
            });
            return;
        }

        const data = {
            name: formData.name,
            note: formData.note,
            email: 'guest@gmail.com',
            lunchQuantity: parseInt(formData.lunchQuantity),
            date: moment().format('M/D/YYYY, h:mm:ss A'),
            adminName: isAdmin?.[0]?.name,
            selectedMenu: 'Common Item',
            bookBy: 'admin',
            type: 'guest'
        };
        // console.log(data);


        Swal.fire({
            title: "Booking From Admin Panel!",
            text: `Book Lunch for Guest ${name} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Book Now!"
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(data);

                axiosPublic.post(`/lunch`, data)
                    .then(res => {
                        // console.log(res.data);

                        if (res.data.insertedId || res.data.modifiedCount) {
                            console.log('lunch data Inserted to DB');
                            refetchLunches();
                            reset();

                            Swal.fire({
                                title: "Booked!!",
                                text: "Guest Lunch has been Booked.",
                                icon: "success",
                                position: "top-center",
                                showConfirmButton: false,
                                timer: 2000
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

        user && isAdmin.length ?
            <div className='flex flex-col md:flex-row'>
                <div className='bg-transparent  '>
                    <Manage></Manage>
                </div>
                <div className='bg-slate-500 px-1 md:px-12 p-4 w-full'>
                    <h2 className='font-bold mb-4'>Manage Bookings ({users.length})</h2>
                    <div className='border border-slate-600 bg-slate-600 my-1 p-2'>
                        {/* Form for handling bookings for guests */}
                        <form className='block' onSubmit={handleSubmit(handleBookForGuest)}>
                            <div className='block md:flex mb-2'>
                                <div className='block md:flex'>
                                    <p className='w-32'>
                                        Ref:
                                    </p>
                                    <input
                                        placeholder='Ref Name'
                                        defaultValue={guestData?.[0]?.name || 'Guest'}
                                        type="text"
                                        className='w-full md:w-96 p-1 rounded text-center bg-slate-200 text-black border border-white focus:outline-none'
                                        {...register('name', { required: true })}
                                    />
                                </div>
                                {errors.name && <span className='text-red-400'>*Update field is required</span>}
                            </div>
                            <div className='block md:flex mb-2'>
                                <div className='block md:flex'>
                                    <p className='w-32'>
                                        Note:
                                    </p>
                                    <textarea
                                        placeholder='Write note here'
                                        defaultValue={guestData?.[0]?.note || ''}
                                        className='w-full md:w-96 p-1 rounded text-center bg-slate-200 text-black border border-white focus:outline-none'
                                        {...register('note', { required: true })}
                                    />
                                </div>
                                {errors.note && <span className='text-red-400'>*Update field is required</span>}
                            </div>

                            <div className='block md:flex'>
                                <div className='block md:flex'>
                                    <p className='w-32'>
                                        Lunch Quantity:

                                    </p>
                                    <input
                                    placeholder='Quantity'
                                        defaultValue={guestData?.[0]?.lunchQuantity || ''}
                                        type="number"
                                        min="1"
                                        className='w-full md:w-96 p-1 rounded text-center bg-slate-200 text-black border border-slate-500 focus:outline-none'
                                        {...register('lunchQuantity', { required: true, min: 1 })}
                                    />
                                </div>
                                {errors.lunchQuantity && <span className='text-red-400'>*At least 1</span>}
                            </div>
                            {
                                guestData?.length ?
                                    <button
                                        type="submit"
                                        className="border border-slate-500  bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded my-2"
                                    >
                                        Update Lunch
                                    </button>
                                    :
                                    <button
                                        type="submit"
                                        className="border border-slate-500 bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded my-2"
                                    >
                                        Book Lunch
                                    </button>
                            }

                        </form>
                        
                    </div>

                    <div className='border border-slate-600 bg-slate-600 my-1 p-2'>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name / email..."
                        className="w-[220px] p-2 rounded bg-white text-black border border-slate-500 focus:outline-none"
                    />
                    </div>

                    {filteredUsers.map((user, j) => (
                        <div className='block md:flex border border-slate-600 bg-slate-600 my-1 p-2' key={j}>
                            <div>
                                <div className='my-2'>
                                    <h2>Name: {user?.name}</h2>
                                    <p>Email: {user?.email}</p>
                                </div>

                                {
                                    user?.role === 'guest' ?
                                        <button

                                            className="border border-slate-600 bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                                        >
                                            Book Lunch
                                        </button>
                                        :
                                        <button
                                            onClick={() => handleBookForUser(user.name, user.email)}
                                            className="border border-slate-600   bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                                        >
                                            Book Lunch
                                        </button>
                                }
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            :
            <Loading></Loading>

    );
};

export default Page;