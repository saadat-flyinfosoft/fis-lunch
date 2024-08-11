import React from 'react';
import axios from 'axios';
import useAxiosPublic from '@/Hooks/useAxiosPublic';

const XlsxDownloadButton = ({date}) => {

    const axiosPublic = useAxiosPublic()


    const handleDownload = async () => {

        try {
            const response = await axiosPublic.get(`/download-excel/?date=${date}`, {
                responseType: 'blob' 
                //  set response type to blob
            });

            console.log(response)

            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <button className="btn btn-sm btn-danger my-2 mb-4" onClick={handleDownload}>
            Download Excel File
        </button>
    );
};

export default XlsxDownloadButton;