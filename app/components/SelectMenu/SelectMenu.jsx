import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useBookings from '../../../Hooks/useBookings';
import useMenu from '../../../Hooks/useMenu';
import React from 'react';
import { useForm } from 'react-hook-form';

const SelectMenu = () => {

    const {menu, refetch} = useMenu();
    const { lunches, refetch: refetchLunch } = useBookings();
    const axiosPublic = useAxiosPublic();
    console.log(menu)
    console.log(lunches.menu)

    const {
        register ,
        handleSubmit ,
        setValue,
        reset ,
        formState: { errors },
      } = useForm();

    const handleModalOpen =  () => {
         document.getElementById("my_modal_select_menu").showModal();
      };
    const handleModalClose =  () => {
         document.getElementById("my_modal_select_menu").close();
      };

    const handleMenuSubmit =  (menu) => {
        console.log(menu)

        axiosPublic.patch(`/menutoday`, menu).then((res) => {
            console.log(res.data);
            refetchLunch()

            // if (res.data.insertedId || res.data.modifiedCount) {
              
            //   Swal.fire({
            //     title: "Added!!",
            //     icon: "success",
            //     position: "top-center",
            //     showConfirmButton: false,
            //     timer: 2000,
            //   });
            // } else if (res.data.message) {
            //   Swal.fire({
            //     title: "Already Booked!",
            //     icon: "warning",
            //     timer: 2000,
            //   });
            // }
          });

        // document.getElementById("my_modal_select_menu").close();

        // const data = {
        //     menu: menu.menu,
        //     date: new Date().toLocaleString(),
        //     addedByAdmin: isAdmin?.[0]?.name,
        //   };
      };



    return (
        <div>
            <button
                onClick={() => handleModalOpen()}
                className=" w-auto  text-white text-3xl font-semibold py-1 px-2 rounded"
              >
                {/* ☐ */}
                🍔
              </button>
            <dialog id="my_modal_select_menu" className="modal modal-center sm:modal-middle">
          <div className="modal-box ">
            <form className="block " onSubmit={handleSubmit(handleMenuSubmit)}>
              <div className="block md:flex m-2">
                
                <div className="block md:flex items-center">
                  <div className="flex justify-center">
                    <p className="mr-1 w-12">Menu:</p>
                  </div>
                  <select
                    className="w-full md:w-72 p-1 rounded block text-center my-2 bg-slate-200 text-black border border-white focus:outline-none"
                    {...register('menu', { required: true })}
                  >
                    <option value="">Select an item</option>
                    {menu.map((item, index) => (
                      <option key={index} value={item.menu}>
                        {item.menu}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                type="submit"
                className="border w-16 border-white bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2"
              >
                ✓
              </button>
                {/* {errors.menu && (
                  <span className="text-red-400">*Field is required</span>
                )} */}
                
              </div>

            </form>
              <button onClick={() => handleModalClose()}  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            {/* <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div> */}
            <div className='grid grid-cols-2 md:flex justify-center gap-2'>
                {
                    lunches.menu?.map((menuName, i) => (
                        <p className='border px-2 rounded-md flex justify-center text-gray-400' key={i}>
                            <small>
                                {menuName}
                            </small>
                        </p>
                    ))
                }
            </div>

          </div>
        </dialog>
        </div>
    );
};

export default SelectMenu;