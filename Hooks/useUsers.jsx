import { useEffect, useState } from "react";
import useAxiosPublic from "./useAxiosPublic";


const useUsers = () => {

    const [users, setUsers] = useState([]);
    const axiosPublic = useAxiosPublic();

    const fetchUsers = () => {
        axiosPublic.get('/users')
            .then(res => {
                setUsers(res.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [axiosPublic]);

    // Refetch function
    const refetch = () => {
        fetchUsers();
    };

    return { users, refetch };
};

export default useUsers;




// const useUsers = async () => {

//     const result = await fetch('http://localhost:5000/users', {
//         next: {
//             revalidate: 10,
//         }
//     });

//     if (!result.ok) {
//         throw new Error('Error on fetching data..')
//     }

//     return result.json();



// };

// export default useUsers;