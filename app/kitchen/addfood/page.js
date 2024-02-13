"use client"
import { useContext } from 'react';
import useUsers from '../../../Hooks/useUsers';
import Kitchen from '../../kitchen/page'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'
import useBookings from '../../../Hooks/useBookings';
import Loading from '../../../Shared/Loading';
import { useForm } from 'react-hook-form';



const Page = () => {

    const { user } = useContext(AuthContext);
    const { users, refetch } = useUsers();
    const { lunches } = useBookings()
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    const currentUserData = users?.find(currentUser => currentUser.email === user?.email);
    const isAdmin = currentUserData?.email === user?.email && currentUserData?.role === 'admin' ? true : false;


    console.log('currentUserData', currentUserData);
    isAdmin && console.log('admin true', isAdmin)


    const handleAddProduct = (formData) => {

        


        const data = {
            itemName: formData.itemName,
            description: formData.description,
            managerName: currentUserData?.managerName,
            orgType: currentUserData?.orgType,
            orgName: currentUserData?.orgName,
            contactNumber: currentUserData?.contactNumber,
            username: currentUserData?.username,
            map: currentUserData?.map,
            website: currentUserData?.website,
            location: currentUserData?.location,
            date: new Date().toLocaleString(),

        };
        console.log('hiiii',data);


        Swal.fire({
            title: "Add Item?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add Now!"
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(data);

                axiosPublic.post(`/kitchen`, data)
                    .then(res => {
                        // console.log(res.data);

                        if (res.data.insertedId || res.data.modifiedCount) {

                            reset();
                            // onRefresh();
                            Swal.fire({
                                title: "Added!!",
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


        <div className='flex flex-col md:flex-row'>
            <div className='bg-transparent md:w-1/4'>
                <Kitchen></Kitchen>
            </div>
            <div className='bg-blue-500 px-1 md:px-12 p-4 w-full'>

                <h2 className='font-bold mb-4'>Manage Items ({users.length})</h2>
                <div className=''>
                    <div className=' border my-1 p-2'>

                        <form className='block max-w-lg p-4 bg-gray-100 shadow-md rounded-md' onSubmit={handleSubmit(handleAddProduct)}>


                            <div className='mb-4'>
                                <label htmlFor='itemName' className='block text-sm font-medium text-gray-700'>Item Name:</label>
                                <input
                                    id='itemName'
                                    placeholder='Item Name'
                                    type="text"
                                    className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                    {...register('itemName', { required: true })}
                                />
                                {errors.itemName && <span className='text-red-400'>*This field is required</span>}
                            </div>


                            <div className='mb-4'>
                                <label htmlFor='description' className='block text-sm font-medium text-gray-700'>Description:</label>
                                <textarea
                                    id='description'
                                    placeholder='Food Description'
                                    type="text"
                                    className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                    {...register('description', { required: true })}
                                />
                                {errors.description && <span className='text-red-400'>*This field is required</span>}
                            </div>


                            <div className='mb-4'>
                                <label htmlFor='image' className='block text-sm font-medium text-gray-700'>Image:</label>
                                <input
                                    id='image'
                                    placeholder='Food image'
                                    type="file"
                                    className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                    {...register('image', { required: true })}
                                />
                                {errors.image && <span className='text-red-400'>*This field is required</span>}
                            </div>


                            <button
                                type="submit"
                                className="w-full border bg-black hover:bg-blue-800 text-black hover:text-white text-sm font-semibold py-2 rounded"
                            >
                                Add Item
                            </button>
                        </form>

                    </div>

                    <div>
                        Load items...
                    </div>
                </div>


            </div>
        </div>


    );
};

export default Page;