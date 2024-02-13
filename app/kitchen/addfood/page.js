"use client"
import { useContext, useState } from 'react';
import useUsers from '../../../Hooks/useUsers';
import Kitchen from '../../kitchen/page'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'
import useBookings from '../../../Hooks/useBookings';
import Loading from '../../../Shared/Loading';
import { useForm } from 'react-hook-form';
import axios from "axios"



const Page = () => {

    const { user } = useContext(AuthContext);
    const { users, refetch } = useUsers();
    const { lunches } = useBookings()
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();
    const [image, setImage] = useState();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    const currentUserData = users?.find(currentUser => currentUser.email === user?.email);
    const isAdmin = currentUserData?.email === user?.email && currentUserData?.role === 'admin' ? true : false;


    console.log('currentUserData', currentUserData);
    isAdmin && console.log('admin true', isAdmin)


    const handleAddProduct = (formData) => {


        try {
            Swal.fire({
                title: "Add Item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Add Now!"
            }).then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {

                    const formDataObject = new FormData();
                    formDataObject.append('image', formData.image[0]);

                    console.log('formData.image', formData.image);


                    console.log('formData.image', formData.image);
                    await axios.post(`https://api.imgbb.com/1/upload?key=22df347b4bca457e281cced937799c71`, formDataObject)
                        .then(async (res) => {
                            console.log(res.data.data.display_url);
                            const imgURL = (res.data.data.display_url);
                            setImage(res.data.data.display_url)

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
                                image: imgURL,
                                date: new Date().toLocaleString(),

                            };
                            console.log('hiiiiiiiiii', data);

                            await axiosPublic.post(`/items`, data)
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
                                        setLoading(false);
                                    }
                                    else if (res.data.message) {

                                        Swal.fire({
                                            text: `${res.data.message}`,
                                            icon: "warning"
                                        });
                                    }

                                })
                        })
                        .catch(error => {
                            console.error("Error uploading image:", error);
                        });

                }
            });
        }
        catch (error) {
            console.error("Error during the process:", error);
            setLoading(false);
        }
    }

    setTimeout(() => {
        setLoading(false)
    }, 5000);



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


                            {
                                !loading ?
                                    <button
                                        type="submit"
                                        className="w-full border bg-black hover:bg-blue-800 text-black hover:text-white text-sm font-semibold py-2 rounded"
                                    >
                                        Add Item
                                    </button>
                                    :
                                    <p
                                        className="w-full border text-center border-blue-400 bg-gray-200 hover:bg-blue-800 text-blue-700 hover:text-white text-sm font-semibold py-2 rounded"
                                    >
                                        Uploading...
                                    </p>
                            }
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