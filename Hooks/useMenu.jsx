// useMenu.js
import useStore from "@/app/store";
import { useEffect } from "react";

const useMenu = () => {
    const menu = useStore((state) => state.menu);
    const fetchMenu = useStore((state) => state.fetchMenu);

    // useEffect(() => {
    //     if (menu.length === 0) {
    //         fetchMenu();
    //     }
    // }, [menu, fetchMenu]);

    return { menu, refetch: fetchMenu };
};

export default useMenu;

// import { useEffect, useState } from "react";
// import useAxiosPublic from "./useAxiosPublic";

// const useMenu = () => {
//     const [menu, setMenu] = useState([]);
//     const axiosPublic = useAxiosPublic();

//     const fetchMenu = () => {
//         axiosPublic.get('/menu')
//             .then(res => {
//                 setMenu(res.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching menu:', error);
//             });
//     };

//     useEffect(() => {
//         fetchMenu();
//     }, [axiosPublic]);

//     // Refetch function
//     const refetch = () => {
//         fetchMenu();
//     };

//     return { menu, refetch };
// };

// export default useMenu;
