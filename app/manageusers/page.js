"use client"
import { useContext } from 'react';
import Manage from '../manage/page';
import { AuthContext } from '../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'
import Loading from '../../Shared/Loading';
import useStore from '../store';

const Page = () => {

    const user = useStore((state) => state.user);
    const users = useStore((state) => state.users);
    const refetch = useStore((state) => state.fetchUsers);
    const axiosPublic = useAxiosPublic();

    const isAdmin = users?.filter(currentUser => currentUser.email === user?.email && currentUser.role === 'admin');


    const handleUser = (id) => {

        const user = users?.find(u => u._id === id);


        Swal.fire({
            title: "Make Admin to User?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, do it!"
        }).then((result) => {
            if (result.isConfirmed) {

                if (user.super === 'yes') {
                    Swal.fire({
                        icon: "warning",
                        title: "⚠️ Permission Denied.",
                        text: "You cannot remove a super admin."
                    });
                    return;
                }

                axiosPublic.patch(`/admintouser/${id}`)
                    .then(res => {
                        if (res.data) {


                            Swal.fire({
                                position: "top-center",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            refetch();

                        }
                        else {

                        }
                    })

            }
        });
    };
    const handleAdmin = (id) => {
        // console.log("Item ID to admin:", id);
        // Perform logic to approve the request using the id

        Swal.fire({
            title: "Make User to Admin?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approve!"
        }).then((result) => {
            if (result.isConfirmed) {

                axiosPublic.patch(`/usertoadmin/${id}`,{
                    isAdmin: isAdmin? isAdmin : ''
                })
                    .then(res => {
                        if (res.data) {

                            // console.log('User is admin now');
                            Swal.fire({
                                position: "top-center",
                                icon: "success",
                                title: "The User role changed to admin succeed!",
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            refetch();

                        }
                        else {
                            // console.log('user not updating..!');
                        }
                    })

            }
        });
    };
    const handlePending = (id) => {
        // console.log("Item ID to approve:", id);
        // Perform logic to approve the request using the id

        Swal.fire({
            title: "Approve To User?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Approve!"
        }).then((result) => {
            if (result.isConfirmed) {

                axiosPublic.patch(`/userapprove/${id}`)
                    .then(res => {
                        if (res.data) {

                            // console.log('User is approved now');
                            Swal.fire({
                                position: "top-center",
                                icon: "success",
                                title: "Approval Succeed!",
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            refetch();

                        }
                        else {
                            // console.log('user not updating..!');
                        }
                    })

            }
        });
    };

    const handleDelete = (id) => {
        
        const user = users?.find(u => u._id === id);
    
        Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! (${user.name})`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete user!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (user.super === 'yes') {
                    Swal.fire({
                        icon: "warning",
                        title: "⚠️ Permission Denied.",
                        text: "You cannot delete a super admin."
                    });
                    return;
                }
    
                axiosPublic.delete(`/users/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
    
                            Swal.fire({
                                position: "top-center",
                                icon: "success",
                                title: "User Deleted",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    });
            }
        });
    };    


    return (

        user && isAdmin.length ?
            <div className='flex flex-col md:flex-row'>
                <div className='bg-transparent'>
                    <Manage></Manage>
                </div>
                <div className='bg-slate-500 px-1 md:px-12 p-4 w-full'>
                    <h2 className='font-bold'>Manage Users ({users.length})</h2>
                    {users.map((user, j) => (
                        <div className=' border border-slate-600 bg-slate-600 my-1 p-2' key={j}>
                            <div className='my-2'>
                                <h2>Name: {user?.name}</h2>
                                <p>Email: {user?.email}</p>
                            </div>
                            {
                                user.role === 'admin' ?

                                    <button
                                        onClick={() => handleUser(user._id)}
                                        className={`border w-[80px] border-slate-500 bg-slate-500 hover:bg-blue-800 ${user.super? 'text-yellow-100' : ''} text-white text-sm font-semibold py-1 px-2 mr-2 rounded`}
                                    >
                                        Admin
                                    </button>
                                    :
                                    <button
                                        onClick={() => handleAdmin(user._id)}
                                        className="border w-[80px] border-slate-500 bg-slate-500 hover:bg-blue-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                                    >
                                        User
                                    </button>
                            }

                            {
                                user.status === 'pending' ?

                                    <button
                                        onClick={() => handlePending(user._id)}
                                        className="border w-[80px] border-slate-500 bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                                    >
                                        Pending
                                    </button>
                                    :
                                    <button

                                        className="border w-[80px] border-slate-500 bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                                    >
                                        Approved
                                    </button>
                            }

                            <button
                                onClick={() => handleDelete(user._id)}
                                className="border w-[70px] border-slate-500 bg-slate-500 hover:bg-red-700 text-white text-sm font-semibold py-1 px-2 mr-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            :
            <Loading></Loading>

    );
};

export default Page;