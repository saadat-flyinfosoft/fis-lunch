"use client"
import React, { useContext, useMemo ,useState, useEffect} from 'react';
import BookingButton from '../BookingButton/BookingButton';
import useBookings from '../../../Hooks/useBookings';
import Priority from '../Priority/Priority';
import SelectMenu from '../SelectMenu/SelectMenu';
import useUsers from '../../../Hooks/useUsers';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useMenu from '../../../Hooks/useMenu';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import AudioPlayer from '../Audio/AudioPlay';

const Hero = () => {
    const { lunches, refetch } = useBookings();
    const { users,  } = useUsers();
    const {menu, refetch: menuRefetch} = useMenu();
    const { user } = useContext(AuthContext);
    const [selectUser, setSelectUser] = useState({ selectedMenu: null });
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuper, setIsSuper] = useState(false);

    useEffect(() => {
        // Check if the current user is an admin
        const adminUser = users.some(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');
        const isSuper = users.some(currentUser => currentUser.email === user?.email && currentUser?.super === 'yes');
        setIsAdmin(adminUser);
        setIsSuper(isSuper);
        refetch()
        // console.log('clg')
    }, [users, user]);

    // console.log( isSuper)

    const memoizedLunches = useMemo(() => {
        return lunches?.data?.map((lunch, index) => (
            <div key={index} className={`border p-2 text-sm rounded-md shadow ${lunch?.bookBy === 'admin' ? 'border border-white text-yellow-200' : ''}`}>
                <div onClick={ isSuper? () => handleUpdateMenuModal(lunch) : undefined   } >
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

        console.log(data)

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
                data: { email: email }
            });
            refetch();

            if (response.data.message === 'Booking cancelled successfully') {
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to cancel booking.",
                icon: "error",
                timer: 5000
            });
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
            {/* <Priority /> */}
            <div className='z-10'>
                { Object.keys(menuCounts).length > 0 &&
                    <button
                        className="border rounded-md px-3 text-xl"
                        onClick={() => {
                        refetch(); 
                        document.getElementById('my_modal_3').showModal(); 
                    }}
                  >
                    ℹ️
                  </button>
                  
                }
            </div>
            <div className='z-10 mt-4'>
                {
                isAdmin &&
                    <SelectMenu/> 
                }
            </div>

            <h1 className="text-2xl font-bold z-10 pl">FlyInfoSoft Lunch Manager</h1>
            {/* <AudioPlayer/> */}

            <div className="mt-4 z-10 flex flex-col items-center">
                <BookingButton loadedLunches={lunches} onRefresh={refetch} />

                <div className="mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {memoizedLunches}
                </div>
                

                
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
                                                        {isAdmin && <span className='hover:cursor-pointer hover:bg-slate-200 m-1' onClick={()=>handleCancel(user.email)}>❌</span>}
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
                                <p>Force update menu for </p> 
                                <p className="text-red-500">{selectUser?.name}</p>
                                <small className="text-gray-200 font-light">( Currently selected - {selectUser?.selectedMenu} )</small>
                            </div>
                            <select
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
