import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import {useSelector} from 'react-redux';
import { useState } from "react";


function Header2() {
  const navigate = useNavigate();
  const user = useSelector(state=>state.user);
  const [searchValue , setSearchValue] = useState('');
  const handleSearchChange = (e)=>{
    setSearchValue(e.target.value);
  }
  

  const handleSearchSubmit = ()=>{
    const url = new URLSearchParams(location.search);
    url.set('searchData' , searchValue);
    console.log(url)
    const url_updated = url.toString();
    navigate(`/properties?${url_updated}`);
  }

  return (
    <header className='fixed top-0 left-0 w-full bg-blue-200 shadow-md z-10'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3' >
            <Link to='/'>
            <h1 className='font-bold xxs:text-xs xs:text-sm sm:text-lg md:text-xl flex flex-wrap'>
                <span className='text-slate-500'>HEAVEN</span >
                <span className='text-slate-700'>NEST</span>
            </h1>
            </Link>
            <form className='bg-blue-100 p-1 sm:p-2 rounded-lg flex items-center'>
                <input className='bg-transparent focus:outline-none w-24 sm:w-48 md:w-60 lg:w-80' type="text" placeholder='search city' 
                onChange={handleSearchChange}/>
                <FaSearch onClick={handleSearchSubmit} className="text-slate-700 hover:cursor-pointer"/>
            </form>

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

export default Header2