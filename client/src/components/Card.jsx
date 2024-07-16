import { BiHeart, BiSolidBath, BiSolidBed, BiSolidHeart } from 'react-icons/bi';
import { FaLocationPin, FaShare } from 'react-icons/fa6';
import { GiSofa } from 'react-icons/gi';
import { Link } from 'react-router-dom';

function Card({ item }) {

    
      
    return (

        <div className='flex flex-col border rounded-lg border-slate-300 bg-white gap-1 xs:w-64 relative hover:bg-slate-50 shadow-lg overflow-hidden'>
            <Link to={`/listing/${item._id}`}>
                <img className='w-full xxs:h-36 xs:h-60 border rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-700' src={item.imageUrls[0]} alt="" />
            </Link>
            
            <div className='flex flex-col gap-3 px-1'>

                <div className='flex justify-between items-center'>
                    <span className='truncate xxs:text-xs xs:text-sm font-semibold xxs:w-24 xs:w-40'>{item.title}</span>
                    <span className='truncate xxs:text-sm xs:text-lg font-semibold xxs:mr-1 sm:mr-4 text-yellow-600'>${item.regularPrice}</span>
                </div>
                <ul className='flex flex-wrap gap-2 items-center '>
                    <li className='flex gap-0.5 items-center '>
                        <BiSolidBath className='text-blue-600' />
                        <span className='text-xs xs:text-sm'>{`${item.bathrooms} bath`}</span>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <BiSolidBed className='text-blue-600' />
                        <span className='text-xs xs:text-sm'>{`${item.bedrooms} bed`}</span>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <GiSofa className='text-blue-600' />
                        <span className='text-xs xs:text-sm'>{item.furnished ? 'furnished' : 'Not furnished'}</span>
                    </li>
                </ul>
                <div className='flex justify-between pb-1'>
                    <ul className='flex gap-0.5 items-center mb-1'>
                        <FaLocationPin className='text-blue-600' />
                        <li className='truncate text-xs xs:text-sm w-20 xs:w-40'>{`${item.city},${item.state}, ${item.country}`}</li>
                    </ul>
                    <span className='text-xs xs:bg-red-500 text-red-500 xs:p-1 xs:text-white xs:border xs:rounded-lg text-center'>{`For ${item.type}`}</span>
                </div>
            </div>
        </div>

    )
}

export default Card