import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import {useSelector} from 'react-redux';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

function Header() {
  const user = useSelector(state=>state.user)
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useDispatch();

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

  return (
    <header className=' relative bg-blue-200 shadow-md'>
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
              <img onClick={handleProfile} className="w-7 h-7 rounded-full object-cover cursor-pointer" src={user.currentUser.avatar} alt="image" />
              :
              <Link to={'sign-in'} >
              <li className="text-blue-800 list-none font-semibold cursor-pointer hover:underline">SignIn</li>
              </Link>
              }

        </div>
              {openProfile && 
                <ul className="absolute top-16 right-20 flex flex-col gap-2 transform ease-in-out duration-1000 bg-blue-200 text-blue-800 p-2 font-semibold border border-none rounded-lg z-30 outline-none">
                  <Link to={'/profile'}>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">My Profile</li>
                  </Link>
                  <Link to={`/myListing/${user.currentUser._id}`} >
                    <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">My Listings</li>
                  </Link>
                  <Link>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">Wishlist</li>
                  </Link>
                  <Link to={'/sign-in'}>
                  <li onClick={handleSignOut} className="cursor-pointer w-full hover:bg-blue-100 px-16 py-2 border border-none rounded-lg">logOut</li> 
                  </Link>
              </ul>
              }
    </header>
  )
}

export default Header