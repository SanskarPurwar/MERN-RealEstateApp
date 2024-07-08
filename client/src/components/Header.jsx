import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import {useSelector} from 'react-redux';


function Header() {
  const user = useSelector(state=>state.user)
  return (
    <header className='bg-blue-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-5' >
            <Link to='/'>
            <h1 className='font-bold xxs:text-xs xs:text-sm sm:text-lg md:text-xl flex flex-wrap'>
                <span className='text-slate-500'>HEAVEN</span >
                <span className='text-slate-700'>NEST</span>
            </h1>
            </Link>
            {/* <form className='bg-blue-100 p-1 sm:p-2 rounded-lg flex items-center'>
                <input className='bg-transparent focus:outline-none w-24 sm:w-48 md:w-60 lg:w-80' type="text" placeholder='search city' />
                <FaSearch className="text-slate-700 hover:cursor-pointer"/>
            </form> */}
            <ul className="flex gap-3 xxs:text-xs xs:text-sm sm:text-lg md:gap-6">  
              <Link to='/'>
              <li className="hidden sm:inline font-semibold text-blue-800 hover:underline">Home</li>
              </Link>
              <Link to='/about'>
              <li className="hidden xs:inline font-semibold text-blue-800 hover:underline">About</li>
              </Link>
              <Link to={'/createListing'}>
                <li className="sm:inline font-semibold text-blue-800 hover:underline">Add Property</li>
              </Link> 
              <Link to={'/properties'}>
              <li className="sm:inline font-semibold text-blue-800 hover:underline">Buy/Rent</li>              
              </Link>
            </ul>

            {user.currentUser ?
              <Link to='/profile'>
              <img className="w-7 h-7 rounded-full object-cover" src={user.currentUser.avatar} alt="image" />
              </Link> 
              :<Link to='/sign-in'>
              <li className="text-blue-800 list-none font-semibold hover:underline">SignIn</li>
              </Link>
              }
        </div>
    </header>
  )
}

export default Header