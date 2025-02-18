// useBookings.js
import useStore from "@/app/store";
import { useEffect } from "react";

const useBookings = () => {
    const lunches = useStore((state) => state.lunches);
    const fetchLunches = useStore((state) => state.fetchLunches);

    // useEffect(() => {
    //     if (lunches.length === 0) {
    //         fetchLunches();
    //     }
    // }, [lunches, fetchLunches]);

    return { lunches, refetch: fetchLunches };
};

export default useBookings;

// import { useEffect, useState } from "react";
// import useAxiosPublic from "./useAxiosPublic";

// const useBookings = () => {
//     const [lunches, setLunches] = useState([]);
//     const axiosPublic = useAxiosPublic();

//     const fetchLunches = () => {
//         axiosPublic.get('/lunch')
//             .then(res => {
//                 setLunches(res.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching lunches:', error);
//             });
//     };

//     useEffect(() => {
//         fetchLunches();
//     }, [axiosPublic]);

//     // Refetch function
//     const refetch = () => {
//         fetchLunches();
//     };

//     return { lunches, refetch };
// };

// export default useBookings;
