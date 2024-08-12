"use client";
import { useContext, useState } from "react";
import useUsers from "../../Hooks/useUsers";
import Manage from "../manage/page";
import { AuthContext } from "../components/AuthProvider/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useMenu from "../../Hooks/useMenu";
import Loading from "../../Shared/Loading";

const Page = () => {
  const { user } = useContext(AuthContext);
  const { users, refetch } = useUsers();
  const { menu, refetch: refetchMenu } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Separate useForm hooks for add and edit
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  const isAdmin = users.filter(
    (currentUser) =>
      currentUser.email === user?.email && currentUser.role === "admin"
  );

  const handleAddMenu = (menu) => {
    const data = {
      menu: menu.menu,
      date: new Date().toLocaleString(),
      addedByAdmin: isAdmin?.[0]?.name,
    };

    Swal.fire({
      text: `Add "${menu.menu}" to menu list ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add !!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.post(`/menu`, data).then((res) => {
          if (res.data.insertedId || res.data.modifiedCount) {
            resetAdd();
            refetchMenu();
            Swal.fire({
              title: "Added!!",
              icon: "success",
              position: "top-center",
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (res.data.message) {
            Swal.fire({
              title: "Already Booked!",
              icon: "warning",
              timer: 2000,
            });
          }
        });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      text: `Delete from list ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete !!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/menu/${id}`).then((res) => {
          if (res) {
            refetchMenu();
            Swal.fire({
              title: "Deleted !!",
              icon: "success",
              position: "top-center",
              showConfirmButton: false,
              timer: 2000,
            });
          } else if (res.data.message) {
            Swal.fire({
              title: "Something is wrong while deleting menu..!",
              icon: "warning",
              timer: 4000,
            });
          }
        });
      }
    });
  };

  const handleEdit = async (menu) => {
    setSelectedMenu(menu);
    setValue("menu", menu.menu);
    await document.getElementById("my_modal_5").showModal();
  };

  const handleUpdateMenu = (menu) => {
    const data = {
      menu: menu.menu,
      date: new Date().toLocaleString(),
      addedByAdmin: isAdmin?.[0]?.name,
    };

    axiosPublic.patch(`/menu/${selectedMenu._id}`, data).then((res) => {
        if (res.data.modifiedCount) {
          resetEdit();
          refetchMenu();
          setSelectedMenu(null);
          document.getElementById("my_modal_5").close();
          Swal.fire({
            title: "Updated!!",
            icon: "success",
            position: "top-center",
            showConfirmButton: false,
            timer: 2000,
          });
        } else if (res.data.message) {
          Swal.fire({
            title: "Update Failed!",
            icon: "warning",
            timer: 2000,
          });
        }
      });
  };

  return user && isAdmin.length ? (
    <div className="flex flex-col md:flex-row">
      <div className="bg-transparent md:w-1/4">
        <Manage />
      </div>
      <div className="bg-blue-500 px-1 md:px-12 p-4 w-full ">
        {/* Modal for editing menu */}
        <dialog id="my_modal_5" className="modal modal-center sm:modal-middle">
          <div className="modal-box ">
            <form className="block " onSubmit={handleSubmitEdit(handleUpdateMenu)}>
              <div className="block md:flex mb-2">
                <div className="block md:flex items-center">
                  <div className="flex justify-between">
                  <p className="mr-1 w-12">Menu:</p>
                  <p onClick={() => document.getElementById("my_modal_5").close()} className="cursor-pointer text-red-500 md:mx-2">X</p>
                  </div>
                  <input
                    placeholder="Menu Name"
                    type="text"
                    className="w-full md:w-72 p-1 rounded text-left my-2 bg-slate-200 text-black border border-white focus:outline-none"
                    {...registerEdit("menu", { required: true })}
                  />
                </div>
                {errorsEdit.menu && (
                  <span className="text-red-400">*Field is required</span>
                )}
                <button
                  type="submit"
                  className="border border-white bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold py-1 px-2 rounded my-2 md:mx-2"
                >
                  Update
                </button>
              </div>
            </form>
            {/* <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div> */}
          </div>
        </dialog>

        <h2 className="font-bold mb-4">Manage Menu ({menu?.length})</h2>
        <div className="border my-1 p-2">
          {/* Form for adding a new menu */}
          <form className="block" onSubmit={handleSubmitAdd(handleAddMenu)}>
            <div className="block md:flex mb-2">
              <div className="block md:flex items-center">
                <p className="mr-1 w-12 ">Menu:</p>
                <input
                  placeholder="Add menu"
                  type="text"
                  className="w-1/2 md:w-72 p-1 rounded text-center bg-slate-200 text-black border border-white focus:outline-none"
                  {...registerAdd("menu", { required: true })}
                />
              </div>
              {errorsAdd.menu && (
                <span className="text-red-400">*Field is required</span>
              )}
              <button
                type="submit"
                className="border w-16 border-white bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold md:mx-2 py-1 px-2 rounded my-2"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {menu.map((menuSingle, j) => (
          <div className="block md:flex border my-1 p-2" key={j}>
            <div>
              <div className="my-2 mr-1">
                <h2>
                  {j + 1}. {menuSingle?.menu}
                </h2>
              </div>
              <button
                onClick={() => handleEdit(menuSingle)}
                className="border w-[80px] border-green-700 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(menuSingle._id)}
                className="border w-[70px] border-red-700 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Page;
