import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';

const IDLE_BLUR_MS = 3000;      // ← 3-second inactivity timeout
const CLOSE_DELAY  = 500;       // ← 0.5 s before returning to main view

export default function SelectMenu() {
  const menu         = useStore(s => s.menu);
  const lunches      = useStore(s => s.lunches);
  const refetchMenu  = useStore(s => s.fetchMenu);
  const refetchLunch = useStore(s => s.fetchLunches);
  const axiosPublic  = useAxiosPublic();

  const [open, setOpen]             = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState('');

  const dlgRef   = useRef(null);
  const inputRef = useRef(null);
  const idle     = useRef(null);

  const { register, handleSubmit, setValue } = useForm();

  const filtered = useMemo(
    () => menu.filter(m => m.menu.toLowerCase().includes(search.toLowerCase())),
    [menu, search]
  );

  /* open / close dialog */
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;
    open ? dlg.showModal() : dlg.open && dlg.close();
  }, [open]);

  const openDialog  = () => { setSearch(''); setShowSearch(false); setOpen(true); };
  const closeDialog = () => setOpen(false);

  /* idle blur logic (2 s) */
  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
      idle.current = setTimeout(() => inputRef.current?.blur(), IDLE_BLUR_MS);
    }
    return () => clearTimeout(idle.current);
  }, [showSearch]);

  const restartIdle = () => {
    clearTimeout(idle.current);
    idle.current = setTimeout(() => inputRef.current?.blur(), IDLE_BLUR_MS);
  };

  /* pick menu: blur immediately, hide search after 0.5 s */
  const pickMenu = val => {
    // 1. Blur input to close keyboard immediately
    inputRef.current?.blur();
    clearTimeout(idle.current);

    // 2. Immediately update selected menu and hide search view
    setSelected(val);
    setValue('menu', val);
    setShowSearch(false);

    // 3. After a short delay (keyboard closing time),
    //    force modal reposition by closing & reopening it
    setTimeout(() => {
      const dlg = dlgRef.current;
      if (!dlg) return;

      // Close and reopen dialog to force center reposition
      if (dlg.open) {
        dlg.close();
        setTimeout(() => dlg.showModal(), 0);
      }
    }, );
  };


  const deleteMenu = async m => {
    try {
      setLoading(true);
      await axiosPublic.delete('/menutoday', { data: { menu: m } });
      await Promise.all([refetchLunch(), refetchMenu()]);
    } finally {
      setLoading(false);
    }
  };

  const submitMenu = async data => {
    try {
      setLoading(true);
      await axiosPublic.patch('/menutoday', data);
      refetchLunch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={openDialog} className="text-white text-3xl">🍔</button>

      <dialog ref={dlgRef} className="modal modal-middle" onCancel={closeDialog}>
        <div className="modal-box w-80 max-w-full relative">
          <button onClick={closeDialog}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          {/* MAIN FORM */}
          {!showSearch && (
            <>
              <form onSubmit={handleSubmit(submitMenu)} className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-gray-400">Menu:</span>

                  <input
                    readOnly
                    value={selected}
                    placeholder="Select menu…"
                    onClick={() => setShowSearch(true)}
                    className="flex-1 p-1 text-center rounded bg-slate-200 text-gray-600 border cursor-pointer"
                  />
                  <input type="hidden" {...register('menu', { required: true })} value={selected} />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading
                        ? 'border w-16 shadow border-red-500 bg-blue-900 text-blue-300 rounded'
                        : 'border w-16 shadow border-gray-300 bg-blue-900 text-blue-300 rounded'
                    }`}
                  >
                    {loading ? '🫘' : '✓'}
                  </button>
                </div>
              </form>

              {/* day menus */}
              <div className="flex flex-wrap justify-center gap-1 mt-4">
                {lunches.menu?.map((m,i) => (
                  <span key={i} className="flex items-center gap-1">
                    <small className="border rounded px-2 text-gray-400">{m}</small>
                    <span onClick={() => deleteMenu(m)} className="text-red-500 cursor-pointer">❌</span>
                  </span>
                ))}
              </div>
            </>
          )}

          {/* SEARCH SCREEN */}
          {showSearch && (
            <>
              <input
                ref={inputRef}
                value={search}
                onChange={e => { setSearch(e.target.value); restartIdle(); }}
                onFocus={restartIdle}
                placeholder="Search menu…"
                className="w-full p-2 mt-6 mb-2 rounded bg-gray-800 text-gray-300 border placeholder-gray-500"
              />

              <div className="h-[36rem] sm:max-h-60 overflow-auto border rounded">
                {filtered.length ? (
                  filtered.map((m,i) => (
                    <div
                      key={i}
                      onClick={() => pickMenu(m.menu)}
                      className="px-4 py-2 border cursor-pointer hover:bg-gray-700 text-gray-400 text-center"
                    >
                      {i + 1}. {m.menu}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-center text-gray-500">No items found</div>
                )}
              </div>

              <button onClick={() => { setShowSearch(false); setSearch(''); }}
                      className="btn btn-sm bg-blue-800 text-white mt-3">
                Back
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}



// import useAxiosPublic from '../../../Hooks/useAxiosPublic';
// import useBookings from '../../../Hooks/useBookings';
// import useMenu from '../../../Hooks/useMenu';
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';

// const SelectMenu = () => {

//     const {menu, refetch} = useMenu();
//     const { lunches, refetch: refetchLunch } = useBookings();
//     const axiosPublic = useAxiosPublic();
//     const [loading, setLoading] = useState(false);
//     // console.log(menu)
//     // console.log(lunches.menu)

//     const {
//         register ,
//         handleSubmit ,
//         setValue,
//         reset ,
//         formState: { errors },
//       } = useForm();

//     const handleModalOpen =  () => {
//         refetch();
//          document.getElementById("my_modal_select_menu").showModal();
//       };
//     const handleModalClose =  () => {
//          document.getElementById("my_modal_select_menu").close();
//       };

//       const handleDeleteMenu = async (menuItem) => {
//         if (menuItem) {
//           try {
//             setLoading(true);
//             await axiosPublic.delete('/menutoday', {
//               data: { menu: menuItem },
//             });
//             refetchLunch();
//             refetch();

//             setTimeout(() => {
//               setLoading(false)
//             }, 2000);

//           } 
//           catch (error) {
//             console.error('Error deleting menu item:', error);
//             setLoading(false);
//           }
//         }
//       };

//     const handleMenuSubmit =  async(menu) => {
//         setLoading(true);

//         await axiosPublic.patch(`/menutoday`, menu).then((res) => {

//             refetchLunch()
//             if(res.data){
//               setTimeout(() => {
//                 setLoading(false)
//               }, 2000);
//             }
//           });

//       };



//     return (
//         <div>
//             <button
//                 onClick={() => handleModalOpen()}
//                 className=" w-auto  text-white text-3xl font-semibold py-1 px-2 rounded"
//               >
//                 {/* ☐ */}
//                 🍔
//               </button>
//             <dialog id="my_modal_select_menu" className="modal modal-center sm:modal-middle">
//           <div className="modal-box ">
//             <form className="block " onSubmit={handleSubmit(handleMenuSubmit)}>
//               <div className="block md:flex m-2">
                
//                 <div className="block md:flex items-center">
//                   <div className="flex justify-center">
//                     <p className="mr-1 w-12">Menu:</p>
//                   </div>
//                   <select
//                     className="w-full md:w-72 p-1 rounded block text-center my-2 bg-slate-200 text-black border border-white focus:outline-none"
//                     {...register('menu', { required: true })}
//                   >
//                     <option value="">Select an item</option>
//                     {menu.map((item, index) => (
//                       <option key={index} value={item.menu}>
//                         {item.menu}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button
//                 type="submit" disabled={loading}
//                 className={`${loading? 'border w-16 shadow border-red-500 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2' : 'border w-16 shadow border-white bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2'}`}
//               >
//                 {

//                   loading ? '🫘' : '✓'
//                 }
//               </button>
//                 {/* {errors.menu && (
//                   <span className="text-red-400">*Field is required</span>
//                 )} */}
                
//               </div>

//             </form>
//               <button onClick={() => handleModalClose()}  className="btn btn-sm  btn-circle btn-ghost absolute right-2 top-2"><span className='text-red-200'>✕</span></button>
            
//               <div className="flex flex-wrap justify-center text-center items-center gap-0">
             
//               {lunches.menu?.map((menuName, i) => (
                
//                 <p className="flex items-center my-2" key={i}>
                  
//                     <small className={`${loading? 'border border-red-500 w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center' : 'border w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center'}`}>
//                       {menuName}
//                     </small>
                 
//                   <span
//                     onClick={() => handleDeleteMenu(menuName)}
//                     className="text-red-500 cursor-pointer"
//                   >
//                     ❌
                  
//                   </span>
//                 </p>
//               ))}
//             </div>


//           </div>
//         </dialog>
//         </div>
//     );
// };

// export default SelectMenu;

