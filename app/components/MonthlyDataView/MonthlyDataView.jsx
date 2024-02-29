import React from 'react';
import useUsers from '../../../Hooks/useUsers';

const MonthlyDataView = ({ data, guestLunchQuantity }) => {
  const { users } = useUsers();

  // Filter approved users
  const approvedUsers = users.filter(user => user?.status === 'approve');

  // console.log(data);

  // const userTotalLunch = (email) => {
  //   return data.reduce((count, item) => {
  //     return count + item.data.filter(itemData => itemData.email === email).length;
  //   }, 0);
  // };

  const userTotalLunchQuantity = (email) => {
    return data.reduce((totalQuantity, item) => {
        const emailData = item.data.filter(itemData => itemData.email === email);
        const sum = emailData.reduce((itemSum, itemData) => itemSum + (itemData.lunchQuantity || 0), 0);
        return totalQuantity + sum;
    }, 0);
};


  const totalEmailCount = data.reduce((count, item) => {
    const uniqueEmails = new Set(item.data.map(itemData => itemData.email));
    return count + uniqueEmails.size;
  }, 0);


  const totalLunchCount = data.reduce((count, item) => {
    const sum = item.data.reduce((itemSum, itemData) => itemSum + (itemData.lunchQuantity || 0), 0);
    return count + sum;
  }, 0);




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
            <tr key={i}>
              <td className="border p-2 capitalize">{user.name}</td>
              <td className="border p-2">
                {`Lunch: ${userTotalLunchQuantity(user.email)} (${userTotalLunchQuantity(user.email) * 100} BDT)`}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border p-2 font-bold">Total Lunches</td>
            <td className="border p-2 font-bold">{totalLunchCount}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Total Cost</td>
            {/* <td className="border p-2 font-bold">{(totalEmailCount + guestLunchQuantity) * 100}.00 BDT</td> */}
            <td className="border p-2 font-bold">{(totalLunchCount) * 100}.00 BDT</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MonthlyDataView;
