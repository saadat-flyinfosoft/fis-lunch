import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useBookings from '../../../Hooks/useBookings';
import useMenu from '../../../Hooks/useMenu';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const SelectMenu = () => {

    const {menu, refetch} = useMenu();
    const { lunches, refetch: refetchLunch } = useBookings();
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);
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
        refetch();
         document.getElementById("my_modal_select_menu").showModal();
      };
    const handleModalClose =  () => {
         document.getElementById("my_modal_select_menu").close();
      };

    const handleMenuSubmit =  async(menu) => {
        setLoading(true);

        await axiosPublic.patch(`/menutoday`, menu).then((res) => {

            refetchLunch()
            if(res.data){
              setTimeout(() => {
                setLoading(false)
              }, 2000);
            }
          });

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
                type="submit" disabled={loading}
                className="border w-16 shadow border-white bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2"
              >
                {

                  loading ? '🫘' : '✓'
                }
              </button>
                {/* {errors.menu && (
                  <span className="text-red-400">*Field is required</span>
                )} */}
                
              </div>

            </form>
              <button onClick={() => handleModalClose()}  className="btn btn-sm  btn-circle btn-ghost absolute right-2 top-2"><span className='text-red-200'>✕</span></button>
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