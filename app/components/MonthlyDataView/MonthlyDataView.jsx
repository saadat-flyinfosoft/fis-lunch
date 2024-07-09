import React from 'react';
import useUsers from '../../../Hooks/useUsers';

const MonthlyDataView = ({ data }) => {
  const { users } = useUsers();

  // Filter approved users
  const approvedUsers = users.filter(user => user?.status === 'approve');



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
                {`Lunch: ${userTotalLunchQuantity(user.email)} (${userTotalLunchQuantity(user.email) * 110} BDT)`}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border p-2 font-bold">Total Lunches</td>
            <td className="border p-2 font-bold">{totalLunchCount} || (110TK)</td>
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
