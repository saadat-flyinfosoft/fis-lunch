import React from 'react';
import useUsers from '../../../Hooks/useUsers';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';

const MonthlyDataView = ({ data,date }) => {
  const { users } = useUsers();

  // Filter approved users
  const approvedUsers = users.filter(user => user?.status === 'approve');
  const axiosPublic = useAxiosPublic()



  const userTotalLunchQuantity = (email) => {
    return data.reduce((totalQuantity, item) => {
        const emailData = item.data.filter(itemData => itemData.email === email);
        const sum = emailData.reduce((itemSum, itemData) => itemSum + (itemData.lunchQuantity || 0), 0);
        return totalQuantity + sum;
    }, 0);
};


  const totalLunchCount = data.reduce((count, item) => {
    const sum = item.data.reduce((itemSum, itemData) => itemSum + (itemData.lunchQuantity || 0), 0);
    return count + sum;
  }, 0);

  const handleDownload = async (email) => {

    try {
        const response = await axiosPublic.get(`/download-user-excel`, {
            params: { 
              date: date,
              email: email
          },
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
    <div className="container mx-auto p-1 mt-0">
      <h2 className='font-bold mt-2'>Monthly Data View ({approvedUsers.length})</h2>

      <table className="min-w-full border text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Lunch Summary</th>
          </tr>
        </thead>
        <tbody>
          {approvedUsers.map((user, i) => (
            <tr className='hover:bg-blue-400 ' key={i}>
              <td className="borders p-2 capitalize flex justify-between">
                <span>{user.name}</span>
                <span className='cursor-pointer hover:font-semibold p-1'>
                  <span className='flex gap-1' onClick={() => handleDownload(user.email)}><span className='text-sm rounded-md '>⏬</span> xlsx</span>
                </span>
                </td>
              <td className="border-x-2 p-2">
                {`Lunch: ${userTotalLunchQuantity(user.email)} (${userTotalLunchQuantity(user.email) * 110} BDT)`}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border p-2 font-bold">Total Lunches</td>
            <td className="border p-2 font-bold">{totalLunchCount} - (110TK)</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Total Cost</td>
            {/* <td className="border p-2 font-bold">{(totalEmailCount + guestLunchQuantity) * 100}.00 BDT</td> */}
            <td className="border p-2 font-bold">{(totalLunchCount) * 110} BDT</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MonthlyDataView;
