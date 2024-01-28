import React from 'react';
import useUsers from '../../../Hooks/useUsers';

const MonthlyDataView = ({ data }) => {
    const { users } = useUsers();

    // Filter approved users
    const approvedUsers = users.filter(user => user?.status === 'approve');

    const userTotalLunch = (email) => {
        return data.reduce((count, item) => {
            return count + item.data.filter(itemData => itemData.email === email).length;
        }, 0);
    };

    const totalEmailCount = data.reduce((count, item) => {
        const uniqueEmails = new Set(item.data.map(itemData => itemData.email));
        return count + uniqueEmails.size;
      }, 0);
      
      console.log("Total Email Count:", totalEmailCount);
      

    

    return (
        <div className="container mx-auto p-1 mt-0">
                <h2 className='font-bold mt-2'>Monthly Data View</h2>

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
                      {`Lunch: ${userTotalLunch(user.email)} (${userTotalLunch(user.email) * 100} BDT)`}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
          <tr>
            <td className="border p-2 font-bold">Total Lunches</td>
            <td className="border p-2 font-bold">{totalEmailCount}</td>
          </tr>
          <tr>
            <td className="border p-2 font-bold">Total Cost</td>
            <td className="border p-2 font-bold">{totalEmailCount*100}.00 BDT</td>
          </tr>
        </tfoot>
            </table>
          </div>
    );
};

export default MonthlyDataView;
