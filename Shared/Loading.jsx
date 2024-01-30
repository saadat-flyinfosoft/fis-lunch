import Image from 'next/image'

const Loading = () => {
    return (
        <div className='w-full h-screen flex gap-4 justify-center items-center text-center absolute bg-white'>
            <div className='m-2'>
                <Image width="180" height="100" src={"https://i.ibb.co/9Tp3Wd4/FISLM.png"} alt="" />
            </div>
            <span className="loading text-blue-300 loading-bars loading-md"></span>
            <span className="loading text-blue-400 loading-bars loading-lg"></span>
        </div>
    );
};

export default Loading;