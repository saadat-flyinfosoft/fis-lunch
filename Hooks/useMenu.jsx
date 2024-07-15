import { useEffect, useState } from "react";
import useAxiosPublic from "./useAxiosPublic";

const useMenu = () => {
    const [menu, setMenu] = useState([]);
    const axiosPublic = useAxiosPublic();

    const fetchMenu = () => {
        axiosPublic.get('/menu')
            .then(res => {
                setMenu(res.data);
            })
            .catch(error => {
                console.error('Error fetching menu:', error);
            });
    };

    useEffect(() => {
        fetchMenu();
    }, [axiosPublic]);

    // Refetch function
    const refetch = () => {
        fetchMenu();
    };

    return { menu, refetch };
};

export default useMenu;
