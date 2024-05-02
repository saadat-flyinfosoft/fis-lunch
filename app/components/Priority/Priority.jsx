import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';

const Priority = () => {
    const { user } = useContext(AuthContext);
    const isSaadat = user?.email === 'saadat.flyinfosoft@gmail.com';

    const data = [
        { name: 'Golam Faroque', forbidden: 'Chicken', allowed: 'Beef' },
        { name: 'Khan Salam', forbidden: 'Beef', allowed: 'Chicken, Rui' },
        { name: 'Work Naim', forbidden: 'Beef', allowed: 'Chicken, Rui' },
        { name: 'Sirajul Islam', forbidden: 'Beef', allowed: 'Chicken, Rui' },
        { name: 'Shapan Das', forbidden: 'Beef', allowed: 'Chicken, Rui' },
      ];
    
      return (
        isSaadat &&
        
        <div className="overflow-x-auto mb-2">
          <table className="min-w-full bg-black border border-gray-300 text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b"><span className='text-red-500 font-bold'>Disallowed</span></th>
                <th className="px-4 py-2 border-b">Priority list</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{index+1}. {person.name}</td>
                  <td className="px-4 py-2 border-b"><span className='font-bold'>{person.forbidden}</span></td>
                  <td className="px-4 py-2 border-b">{person.allowed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
    

export default Priority;