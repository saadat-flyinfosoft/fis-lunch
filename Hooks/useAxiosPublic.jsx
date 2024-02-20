import axios from "axios";


const axiosPublic = axios.create({
    baseURL: 'https://fis-lunch-manager-server.vercel.app'
})
// https://fis-lunch-manager-server.vercel.app 
// http://localhost:5000
const useAxiosPublic = () => {
    
    return axiosPublic;
};

export default useAxiosPublic;