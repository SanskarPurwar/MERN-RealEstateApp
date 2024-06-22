import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import {useSelector} from 'react-redux';


function Header() {
  const user = useSelector(state=>state.user)
  return (
    <header className='bg-blue-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3' >
            <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>HEAVEN</span >
                <span className='text-slate-700'>NEST</span>
            </h1>
            </Link>
            <form className='bg-blue-100 p-2 rounded-lg flex items-center'>
                <input className='bg-transparent focus:outline-none w-24 sm:w-64' type="text" placeholder='search city' />
                <FaSearch className="text-slate-700 hover:cursor-pointer"/>
            </form>
            <ul className="flex gap-4 ">
              <Link to='/'>
              <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
              </Link>
              <Link to='/about'>
              <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
              </Link>
              {user.currentUser ?
              <Link to='/profile'>
              <img className="w-7 h-7 rounded-full object-cover" src={user.currentUser.avatar} alt="image" />
              </Link> 
              :<Link to='/sign-in'>
              <li className="text-slate-700 hover:underline">SignIn</li>
              </Link>
              }
            </ul>
        </div>
    </header>
  )
}

export default Header