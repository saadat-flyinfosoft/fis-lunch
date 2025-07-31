"use client"
import React, { useContext, useMemo ,useState, useEffect} from 'react';
import BookingButton from '../BookingButton/BookingButton';
import SelectMenu from '../SelectMenu/SelectMenu';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { MdOutlineNotificationsActive } from "react-icons/md";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import AudioPlayer from '../Audio/AudioPlay';
import CallCateringButton from '@/Hooks/CallCateringButton';
import useStore from '@/app/store';

const Hero = () => {
    const refetch = useStore((state) => state.fetchLunches);
    const lunches = useStore((state) => state.lunches);
    const users = useStore((state) => state.users);
    const fetchUsers = useStore((state) => state.fetchUsers);
    const menu = useStore((state) => state.menu);
    const menuRefetch = useStore((state) => state.fetchMenu);
    const user = useStore((state) => state.user);
    const [selectUser, setSelectUser] = useState({ selectedMenu: null });
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // const [isSuper, setIsSuper] = useState(false);
    const [isCatering, setIsCatering] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);

    const currentUser = users?.find(u => u.email === user?.email);


    const sendNotification = async () => {
        if(!user?.displayName){
            return;
        }
          const confirmed = await Swal.fire({
            title: 'Send Lunch Notification?',
            text: "Do you want to send notification to all users?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, send it!',
            cancelButtonText: 'No',
            position: 'top-center',
        });

        if (!confirmed.isConfirmed) {
            return;
        }

        try {
            setNotifLoading(true);
            const res = await axiosPublic.post("/fire-notification", { message: `আপনার লাঞ্চ কনফার্ম করুন, (${user.displayName})`});
            if (res.data.message === 'Lunch notification sent successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Notification Sent Just Now!',
                    timer: 2000,
                    showConfirmButton: true,
                    position: 'top-center',
                });
            }
        } 
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Notification Failed',
                text: error?.message || 'Something went wrong.',
                showConfirmButton: true,
                position: 'top-center',
            });
            console.error("Notification send failed:", error);
            }
        finally {
        setNotifLoading(false);
        }
    };


    useEffect(() => {
        if (!user) return;

        const matchedUser = users.find(currentUser => currentUser.email === user.email);

        const isAdmin = matchedUser?.role === 'admin';
        const isCatering = matchedUser?.role === 'catering';
        // const isSuper = matchedUser?.super === 'yes';

        setIsAdmin(isAdmin);
        setIsCatering(isCatering);
        // setIsSuper(isSuper);
    }, [users, user]);

    useEffect(() => {
        refetch();
    }, []);



    // console.log( isSuper)


    const memoizedLunches = useMemo(() => {
        return lunches?.data?.map((lunch, index) => (
            <div key={index} className={`border p-2 text-sm rounded-md shadow ${lunch?.bookBy === 'admin' ? 'border border-white text-yellow-200' : ''}`}>
                <div onClick={ isAdmin? () => handleUpdateMenuModal(lunch) : undefined   } >
                    {lunch?.name}
                    {lunch?.type === 'guest' && (
                        <span className='rounded-full border px-1 ml-1'>{lunch?.lunchQuantity}</span>
                    )}
                </div>
                {isAdmin[0]?.role}
            </div>
        ));
    }, [lunches]);

    // console.log(lunches);

    // console.log(menu)

    // Function to count selectedMenu occurrences
    const countSelectedMenu = (lunches) => {
        const menuCounts = {};
      
        lunches?.data?.forEach(user => {
          const { selectedMenu, lunchQuantity } = user;
          if (selectedMenu) {
            const quantity = lunchQuantity || 1; // Use lunchQuantity || default to 1
            if (menuCounts[selectedMenu]) {
              menuCounts[selectedMenu] += quantity;
            } else {
              menuCounts[selectedMenu] = quantity;
            }
          }
        });
      
        return menuCounts;
      };

      const menuCounts = countSelectedMenu(lunches);

   
    
      const handleUpdateMenuModal =  (lunch) => {
        console.log(lunch)
        setSelectUser(lunch);
        handleModalOpen();
      };

      const handleModalOpen =  () => {
        refetch();
        menuRefetch();
         document.getElementById("my_modal_select_update_menu").showModal();
      };
      const handleModalClose =  () => {
         document.getElementById("my_modal_select_update_menu").close();
      };

      const handleMenuChange = (e) => {
        const selectedMenu = e.target.value;
    
        // Update the selectUser state with the selected menu
        setSelectUser(prevUser => ({
            ...prevUser,
            selectedMenu: selectedMenu
        }));
    };

      const handleUpdateMenu = (e) => {
        e.preventDefault(); 
        setLoading(true);
        
        const data = {
            email: selectUser.email,
            selectedMenu: selectUser.selectedMenu,
            forceUpdateMenu : 'true'
        };

        // console.log(data)

        axiosPublic.post(`/lunch`, data)
                .then(res => {
                    // console.log(res.data)
                    if (res.data.matchedCount && res.data.modifiedCount) {
                        refetch();
                        setTimeout(() => {
                            setLoading(false);
                        }, 2000);
                        setTimeout(() => {
                            handleModalClose();
                        }, 1000);
                        setTimeout(() => {
                            Swal.fire({
                                text: "Lunch has been Updated.",
                                icon: "success",
                                position: "top-center",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }, 1000);
                        
    
                    } 
                    else if (res.data.message) {
                        Swal.fire({
                            title: "Error",
                            text: `${res.data.message}`,
                            icon: "warning",
                        });
                        setLoading(false);
                    }
                    setLoading(false);
                });

    };

    const handleCancel = async (email) => {
        setLoading(true);
        if (!email) {
            return;
        }

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
    
        try {
            const response = await axiosPublic.delete(`/lunch/cancel`, {
                data: { email: email, adminEmail: user?.email }
            });
            refetch();

            if (response.data.message === 'Booking cancelled successfully') {
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
            // Swal.fire({
            //     title: "Error",
            //     text: error.response?.data?.message || "Failed to cancel booking.",
            //     icon: "error",
            //     timer: 5000
            // });
        }
        
    };
      
  
//   console.log(menuCounts);
//   console.log(lunches)
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
                <div className="flex items-center gap-4 z-10">
                {Object.keys(menuCounts).length > 0 && (
                    <button
                    className="border rounded-md px-1 text-xl animate-slide-in delay-100"
                    onClick={() => {
                        refetch();
                        document.getElementById('my_modal_3').showModal();
                    }}
                    >
                    ℹ️
                    </button>
                )}

                {(isAdmin || isCatering) && (
                    <div className="mb-1 animate-slide-in delay-400">
                    <SelectMenu />
                    </div>
                )}

                {(isAdmin || isCatering) && (
                    <button
                    onClick={sendNotification}
                    className="animate-slide-in delay-600"
                    >
                    {notifLoading ? (
                        <ImSpinner2 className="text-[30px] text-white animate-spin" />
                    ) : (
                        <MdOutlineNotificationsActive className="text-[30px] text-white hover:text-red-500 cursor-pointer transition-colors duration-300" />
                    )}
                    </button>
                )}
                </div>


            <h1 className="text-2xl font-bold z-10 pl">FlyInfoSoft Lunch Manager</h1>
            {/* <AudioPlayer/> */}

            <div className="mt-4 z-10 flex flex-col items-center">
                <BookingButton loadedLunches={lunches} onRefresh={refetch} />

                <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {memoizedLunches}
                </div>
                {currentUser?.status === 'approve' && <CallCateringButton />}

                

                
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box h-auto">
                            <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 "><span className='text-red-300'>✕</span></button>
                            </form>
                                {/*  Start selected Menu Items  */}
                            <div className='grid grid-cols-2 gap-1 items-center'>

                                {
                                    Object.entries(menuCounts).map(([menuItem, count]) => (
                                        <p className='border text-gray-50 mt-1 uppercas bg-blue-800 gap-2 mx-2 md:mx-2 text-xs md:text-sm rounded-md px-2 md:px-4 ' key={menuItem}>
                                            {menuItem} : {count}
                                        </p>
                                    ))
                                }
                                
                                {/* End selected Menu Items  */}
                            </div>
                            <div className='mt-12'>
                                {
                                        lunches.data?.map((user, i) => (
                                            <p
                                                className={`px-2 rounded-md flex justify-center text-gray-400 mt-1 ${loading ? 'bg-red-800 text-white' : 'border'}`}
                                                key={i}
                                            >
                                                <div className='flex flex-col items-center text-lg'>
                                                    <small>
                                                        <span className='text-xs md:text-sm'>({i+1}). {user.name}</span>{user.type === 'guest'&& <>({user.lunchQuantity})</> } <span className='font-bold'>:</span> <span className='uppercas'>{user.selectedMenu} </span> 
                                                        {isAdmin && <span data-tip="Click to Cancel Booking" className='tooltip hover:cursor-pointer hover:bg-slate-200 m-1' onClick={()=>handleCancel(user.email)}>❌</span>}
                                                    </small>
                                                </div>
                                            </p>
                                        ))
                                }
                            </div>
                        </div>
                    </dialog>

                    {/* update user lunch item  */}
                    <div>
                
                <dialog id="my_modal_select_update_menu" className="modal modal-center sm:modal-middle">
                    <div className="modal-box ">
                        <form className="block ">
                        <div className="block md:flex m-2">
                            
                            <div className="block   items-center mx-auto">
                            <div className=" mx-auto">
                                <p className='text-gray-400'>Force update menu for </p> 
                                <p className="text-red-500">{selectUser?.name}</p>
                                <small className="text-gray-400 font-light">( Currently selected - {selectUser?.selectedMenu} )</small>
                            </div>
                            <select
                            value={selectUser?.selectedMenu || ''}
                            onChange={handleMenuChange} 
                                className="w-full md:w-56 p-1 rounded block text-center my-2 bg-slate-200 text-black border border-white focus:outline-none"
                            >
                                <option value="">Select Menu </option>
                                {menu.map((item, index) => (
                                <option key={index} value={item?.menu}>
                                    {item?.menu}
                                </option>
                                ))}
                            </select>
                            <button
                                disabled={!selectUser?.selectedMenu}
                                type="button"
                                onClick={(e) => handleUpdateMenu(e)}
                                className="border w-16 shadow border-red-500 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2"
                                >
                                {
                                    loading ? '🫘' : '✓'
                                    }
                            </button>
                                </div>

                            
                            {/* {errors.menu && (
                            <span className="text-red-400">*Field is required</span>
                            )} */}
                            
                        </div>

                        </form>
                        <button onClick={() => handleModalClose()}  className="btn btn-sm  btn-circle btn-ghost absolute right-2 top-2"><span className='text-red-200'>✕</span></button>
                        

                    </div>
            </dialog>
            </div>
            </div>
            
        </div>
    );
};

export default Hero;
