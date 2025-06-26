"use client"
import { useContext } from 'react';
import Kitchen from '../../kitchen/page'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2'
import Loading from '../../../Shared/Loading';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import useStore from '@/app/store';



const Page = () => {

    const user = useStore((state) => state.user);
    const users = useStore((state) => state.users);
    const refetch = useStore((state) => state.fetchUsers);
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    const currentUserData = users?.find(currentUser => currentUser.email === user?.email);
    const isAdmin = currentUserData?.email === user?.email && currentUserData?.role === 'admin' ? true : false;

    const id = currentUserData?._id;
    console.log(id)

    console.log('currentUserData', currentUserData);
    isAdmin && console.log('admin true', isAdmin);

    // const { name, email } = currentUserData;


    const handleAddProduct = (formData) => {


        const data = {
            managerName: formData.managerName,
            orgType: formData.orgType,
            orgName: formData.orgName,
            contactNumber: formData.contactNumber,
            username: formData.username,
            map: formData.map,
            website: formData.website,
            location: formData.location,
            date: new Date().toLocaleString(),
        };
        console.log(data);


        Swal.fire({
            title: "update & save?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update Now!"
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(data);

                axiosPublic.patch(`/users/${id}`, data)
                    .then(res => {
                        // console.log(res.data);

                        if (res.data.insertedId || res.data.modifiedCount) {

                            refetch();
                            Swal.fire({
                                title: "Updated!!!!",
                                icon: "success",
                                position: "top-center",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                        else if (res.data.message) {

                            Swal.fire({
                                title: "Change not matched!",
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
            {
                currentUserData ?
                <div className='bg-blue-500 px-1 md:px-12 p-4 w-full'>

                    <h2 className='font-bold mb-4'>Manage Info ({users.length})</h2>
                    <div className=''>
                        <div className=' border my-1 p-2'>

                            <form className='block max-w-lg p-4 bg-gray-100 shadow-md rounded-md' onSubmit={handleSubmit(handleAddProduct)}>
                                <Image
                                    width={150} height={150}
                                    src="https://placekitten.com/150/150" // Replace with your profile picture URL
                                    alt="Profile"
                                    className="rounded-full mx-auto mb-4"
                                />


                                <div className='mb-4'>
                                    <label htmlFor='managerName' className='block text-sm font-medium text-gray-700'>Manager Name:</label>
                                    <input
                                        id='managerName'
                                        defaultValue={currentUserData?.name}
                                        placeholder='Manager Name'
                                        type="text"
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('managerName', { required: true })}
                                    />
                                    {errors.managerName && <span className='text-red-400'>*This field is required</span>}
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='orgType' className='block text-sm font-medium text-gray-700'>Organization Type:</label>
                                    <select
                                        id='orgType'
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('orgType', { required: true })}
                                    >
                                        <option value='' >Select Type</option>
                                        <option value='consumer'>Consumer</option>
                                        <option value='provider'>Provider</option>
                                    </select>
                                    {errors.orgType && <span className='text-red-400'>*This field is required</span>}
                                </div>


                                <div className='mb-4'>
                                    <label htmlFor='orgName' className='block text-sm font-medium text-gray-700'>Organization Name:</label>
                                    <input
                                        id='orgName'
                                        placeholder='Organization Name'
                                        defaultValue={currentUserData?.orgName}
                                        type="text"
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('orgName', { required: true })}
                                    />
                                    {errors.orgName && <span className='text-red-400'>*This field is required</span>}
                                </div>



                                <div className='mb-4'>
                                    <label htmlFor='contactNumber' className='block text-sm font-medium text-gray-700'>Contact Number:</label>
                                    <input
                                        id='contactNumber'
                                        placeholder='Contact Number'
                                        type="number"
                                        defaultValue={currentUserData?.contactNumber}
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('contactNumber', { required: true })}
                                    />
                                    {errors.contactNumber && <span className='text-red-400'>*This field is required</span>}
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username:</label>
                                    <input
                                        id='username'
                                        placeholder='username'
                                        type="text"
                                        defaultValue={currentUserData?.username}
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('username', { required: true })}
                                    />
                                    {errors.username && <span className='text-red-400'>*This field is required</span>}
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email:</label>
                                    <input
                                        readOnly
                                        defaultValue={currentUserData?.email}
                                        id='email'
                                        placeholder='Email'
                                        type="email"
                                        className='w-full p-2 rounded-md bg-gray-200 text-gray-500 border border-white focus:outline-none'
                                    />
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='map' className='block text-sm font-medium text-gray-700'>map:</label>
                                    <input
                                        id='input'
                                        placeholder='google map link'
                                        type="url"
                                        defaultValue={currentUserData?.map}
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('map', { required: true })}
                                    />
                                    {errors.map && <span className='text-red-400'>*This field is required</span>}
                                </div>

                                <div className='mb-4'>
                                    <label htmlFor='location' className='block text-sm font-medium text-gray-700'>Location:</label>
                                    <input
                                        id='location'
                                        placeholder='Location'
                                        type="text"
                                        defaultValue={currentUserData?.location}
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('location', { required: true })}
                                    />
                                    {errors.location && <span className='text-red-400'>*This field is required</span>}
                                </div>
                                <div className='mb-4'>
                                    <label htmlFor='website' className='block text-sm font-medium text-gray-700'>Website:</label>
                                    <input
                                        id='website'
                                        placeholder='website'
                                        type="url"
                                        defaultValue={currentUserData?.website}
                                        className='w-full p-2 rounded-md bg-gray-200 text-black border border-white focus:outline-none'
                                        {...register('website', { required: true })}
                                    />
                                    {errors.website && <span className='text-red-400'>*This field is required</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full border bg-black hover:bg-blue-800 text-black hover:text-white text-sm font-semibold py-2 rounded"
                                >
                                    Save & Update
                                </button>
                            </form>

                        </div>

                        <div>
                            Load items...
                        </div>
                    </div>


                </div>
                :
                <Loading></Loading>
            }
        </div>


    );
};

export default Page;