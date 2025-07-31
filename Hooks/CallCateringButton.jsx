// components/CallCateringButton.jsx

import React from 'react';
import { IoMdCall } from 'react-icons/io';

const CallCateringButton = () => {
  return (
    <a href="tel:+8801623850068">
      <button className="px-4 py-1 mt-4 bg-blue-800 text-white rounded hover:bg-blue-700 border">
        <div className='flex items-center gap-1'>
            <IoMdCall></IoMdCall>
            <small>Call Catering</small>
        </div>
      </button>
    </a>
  );
};

export default CallCateringButton;
