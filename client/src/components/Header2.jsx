import { FaSearch } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import {useSelector} from 'react-redux';
import { useState } from "react";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function Header2() {
  const navigate = useNavigate();
  const user = useSelector(state=>state.user);
  const [searchValue , setSearchValue] = useState('');
  const handleSearchChange = (e)=>{
    setSearchValue(e.target.value);
  }
  const dispatch = useDispatch();
  const [openProfile, setOpenProfile] = useState(false);

  const handleProfile = ()=>{
    setOpenProfile((openProfile)=>!openProfile);
  } 
  
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/sign-out');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

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
              <img onClick={handleProfile} className="w-7 h-7 rounded-full object-cover" src={user.currentUser.avatar} alt="image" />
              :<Link to='/sign-in'>
              <li className="text-blue-800 list-none font-semibold hover:underline">SignIn</li>
              </Link>
              }
        </div>
        {openProfile && 
                <ul className="absolute top-14 right-20 flex flex-col gap-2 transform ease-in-out duration-1000 bg-blue-200 text-blue-800 p-2 font-semibold border border-none rounded-lg z-30 outline-none">
                  <Link to={'/profile'}>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">My Profile</li>
                  </Link>
                  <Link to={`/myListing/${user.currentUser._id}`} >
                    <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">My Listings</li>
                  </Link>
                  <Link>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">Wishlist</li>
                  </Link>
                  <Link to={'/sign-in'} >
                  <li onClick={handleSignOut} className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">logOut</li> 
                  </Link>

              </ul>
              }
    </header>
  )
}

export default Header2