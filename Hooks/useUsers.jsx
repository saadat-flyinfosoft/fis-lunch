// useUsers
import useStore from "@/app/store";
import { useEffect } from "react";

const useUsers = () => {
    const users = useStore((state) => state.users);
    const fetchUsers = useStore((state) => state.fetchUsers);

    // useEffect(() => {
    //     if (users.length === 0) {
    //         fetchUsers();
    //     }
    // }, [users, fetchUsers]);

    return { users, refetch: fetchUsers };
};
export default useUsers;





// import { useEffect, useState } from "react";
// import useAxiosPublic from "./useAxiosPublic";


// const useUsers = () => {

//     const [users, setUsers] = useState([]);
//     const axiosPublic = useAxiosPublic();

//     const fetchUsers = () => {
//         axiosPublic.get('/users')
//             .then(res => {
//                 setUsers(res.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching users:', error);
//             });
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, [axiosPublic]);

//     // Refetch function
//     const refetch = () => {
//         fetchUsers();
//     };

//     return { users, refetch };
// };

// export default useUsers;


