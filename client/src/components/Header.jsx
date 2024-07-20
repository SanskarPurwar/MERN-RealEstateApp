import { FaSearch } from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice";

function Header() {
  const user = useSelector(state=>state.user)
  const navigate = useNavigate();
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
      setOpenProfile(false);
      navigate('/sign-in')
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const location = useLocation();
  const fixedRoute = ['/myWishlist','/myListing/:userId'];

  const isFixed = fixedRoute.includes(location.pathname);
  return (
    <header className={`${isFixed ? 'fixed top-0 left-0 w-full' : ''} ${location.pathname === '/' ? 'bg-gray-200' :'bg-blue-200 '} w-full shadow-md z-50`}>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-5' >
            <Link to='/'>
            <h1 className='font-bold xxs:text-xs xs:text-sm sm:text-lg md:text-xl flex flex-wrap'>
                <span className='text-slate-500'>HEAVEN</span >
                <span className='text-slate-700'>NEST</span>
            </h1>
            </Link>
            <ul className={`flex gap-3 xxs:text-xs ${location.pathname === '/' ? 'text-blue-800': 'text-blue-800'} xs:text-sm sm:text-lg md:gap-6`}>  
              <Link to='/'>
              <li className="hidden sm:inline font-semibold  hover:underline">Home</li>
              </Link>
              <Link to='/about'>
              <li className="hidden xs:inline font-semibold hover:underline">About</li>
              </Link>
              <Link to={'/createListing'}>
                <li className="sm:inline font-semibold hover:underline">Add Property</li>
              </Link> 
              <Link to={'/properties'}>
              <li className="sm:inline font-semibold hover:underline">Buy/Rent</li>              
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
                <ul className="absolute xxs:right-0 top-12 sm:right-0 flex flex-col gap-2 transform ease-in-out duration-1000 bg-blue-200 text-blue-800 p-2 font-semibold border border-none rounded-lg z-50 outline-none">
                  <Link to={'/profile'}>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-8 sm:px-12 md:px-16 py-2 border border-none rounded-lg">My Profile</li>
                  </Link>
                  <Link to={`/myListing/${user.currentUser._id}`} >
                    <li className="cursor-pointer w-full hover:bg-blue-100 px-8 sm:px-12 md:px-16 py-2 border border-none rounded-lg">My Listings</li>
                  </Link>
                  <Link to={'/myWishlist'}>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-8 sm:px-12 md:px-16 py-2 border border-none rounded-lg">Wishlist</li>
                  </Link>
                  <Link to={'/myChats'}>
                  <li className="cursor-pointer w-full hover:bg-blue-100 px-8 sm:px-12 md:px-16 py-2 border border-none rounded-lg">Chats</li>
                  </Link>
                  <Link to={'/sign-in'} >
                  <li onClick={handleSignOut} className="cursor-pointer w-full hover:bg-blue-100 px-8 sm:px-12 md:px-16 py-2 border border-none rounded-lg">logOut</li> 
                  </Link>

              </ul>
              }
    </header>
  )
}

export default Header