import axios from "axios";


const axiosPublic = axios.create({
    baseURL: 'https://fis-lunch-server.vercel.app'
})
// https://fis-lunch-manager-server.vercel.app 
// http://localhost:5000
// https://fis-lunch-server.vercel.app
const useAxiosPublic = () => {
    
    return axiosPublic;
};
export default useAxiosPublic;