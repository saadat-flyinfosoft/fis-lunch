import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useStore from '@/app/store';

const SelectMenu = () => {

  const menu = useStore((state) => state.menu);
  const refetch = useStore((state) => state.fetchMenu);
  const lunches = useStore((state) => state.lunches);
  const refetchLunch = useStore((state) => state.fetchLunches);
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isDropdownModalOpen, setIsDropdownModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const filteredMenu = menu.filter((item) =>
    item.menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open main modal
  const openMainModal = () => {
    setIsMainModalOpen(true);
    setIsDropdownModalOpen(false);
    setSearchTerm('');
    setTimeout(() => {
      document.getElementById('my_modal_select_menu').showModal();
    }, 0);
  };

  // Close main modal
  const closeMainModal = () => {
    setIsMainModalOpen(false);
    const dialog = document.getElementById('my_modal_select_menu');
    if (dialog?.open) dialog.close();
  };

  // Open dropdown modal (close main modal first)
  const openDropdownModal = () => {
    closeMainModal();
    setIsDropdownModalOpen(true);
    setSearchTerm('');
    setTimeout(() => {
      document.getElementById('dropdown_modal').showModal();
    }, 0);
  };

  // Close dropdown modal and reopen main modal
  const closeDropdownModal = () => {
    setIsDropdownModalOpen(false);
    const dialog = document.getElementById('dropdown_modal');
    if (dialog?.open) dialog.close();
    // reopen main modal after closing dropdown modal
    openMainModal();
  };

  const handleSelectChange = (value) => {
    setSelectedMenu(value);
    setValue('menu', value); // update form value
    closeDropdownModal();
  };

  const handleDeleteMenu = async (menuItem) => {
    if (menuItem) {
      try {
        setLoading(true);
        await axiosPublic.delete('/menutoday', { data: { menu: menuItem } });
        refetchLunch();
        refetch();
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        setLoading(false);
      }
    }
  };

  const handleMenuSubmit = async (data) => {
    setLoading(true);
    await axiosPublic.patch(`/menutoday`, data).then((res) => {
      refetchLunch();
      if (res.data) {
        setTimeout(() => setLoading(false), 2000);
      }
    });
  };

  return (
    <>
      <button
        onClick={openMainModal}
        className="w-auto text-white text-3xl font-semibold py-1 px-2 rounded"
      >
        🍔
      </button>

      {/* Main Modal */}
      <dialog
        id="my_modal_select_menu"
        className="modal modal-center sm:modal-middle"
        style={{ zIndex: 50 }}
        onCancel={closeMainModal}
      >
        <div className="modal-box">
          <form className="block" onSubmit={handleSubmit(handleMenuSubmit)}>
            <div className="block md:flex m-2">
              <div className="block md:flex items-center relative w-full md:w-auto">
                <div className="flex justify-center">
                  <p className="mr-1 w-12 text-gray-400">Menu:</p>
                </div>

                <input
                  type="text"
                  readOnly
                  className="w-full md:w-72 p-1 rounded block text-center my-2 bg-slate-200 text-gray-600 border border-gray-300 focus:outline-none cursor-pointer"
                  placeholder="Select menu..."
                  value={selectedMenu}
                  onClick={openDropdownModal}
                />
                {/* <button
                  type="button"
                  onClick={openDropdownModal}
                  className="ml-2 p-1 rounded bg-gray-300 hover:bg-gray-400"
                  aria-label="Open menu dropdown"
                >
                  ▼
                </button> */}
                <input
                  type="hidden"
                  {...register('menu', { required: true })}
                  value={selectedMenu}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? 'border w-16 shadow border-red-500 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2'
                    : 'border w-16 shadow border-gray-300 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2'
                }`}
              >
                {loading ? '🫘' : '✓'}
              </button>
            </div>
          </form>

          <button
            onClick={closeMainModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <span className="text-red-200">✕</span>
          </button>

          <div className="flex flex-wrap justify-center text-center items-center gap-0">
            {lunches.menu?.map((menuName, i) => (
              <p className="flex items-center my-2" key={i}>
                <small
                  className={`${
                    loading
                      ? 'border border-red-500 w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center'
                      : 'border w-24 flex justify-center items-center rounded-md text-gray-400 mx-1 text-center'
                  }`}
                >
                  {menuName}
                </small>
                <span
                  onClick={() => handleDeleteMenu(menuName)}
                  className="text-red-500 cursor-pointer"
                >
                  ❌
                </span>
              </p>
            ))}
          </div>
        </div>
      </dialog>

      {/* Dropdown Modal */}
      <dialog
        id="dropdown_modal"
        className="modal sm:modal-middle modal-top"
        style={{ zIndex: 50 }}
        onCancel={closeDropdownModal}
      >
        <div className="modal-box w-80 max-w-full relative">
          <input
            type="text"
            className="w-full p-2 mb-2 mt-8 rounded border border-gray-300"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={isDropdownModalOpen}
          />
          
          <div className="h-[36rem] sm:max-h-60 overflow-auto border border-gray-300 rounded">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-center text-gray-400 border border-gray-300"
                  onClick={() => handleSelectChange(item.menu)}
                >
                  {index + 1}. {item.menu}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">No items found</div>
            )}
          </div>
          <button
            onClick={closeDropdownModal}
            className="btn btn-md btn-circle btn-ghost absolute right-0 top-0"
            aria-label="Close dropdown modal"
          >
             <span className="text-red-200">✕</span>
          </button>
        </div>
      </dialog>
    </>
  );
};

export default SelectMenu;
