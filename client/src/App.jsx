import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Properties from './pages/Properties';
import Layout from './components/Layout';
import MyListing from './pages/MyListing';
import MyWishlist from './pages/MyWishlist';
import Footer from './components/Footer';


function App() {
  return (
    <BrowserRouter>
    <div className='flex flex-col justify-between min-h-lvh'>
      <Layout/>
      <div className=''>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About/>} />
        <Route element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/myWishlist" element={<MyWishlist/>} />
          <Route path="/createListing" element={<CreateListing/>} />
          <Route path="/updateListing/:listingId" element={<UpdateListing/>} />
          <Route path='/myListing/:userId' element={<MyListing/>}/>
        </Route>
        <Route path="/listing/:listingId" element={<Listing/>}/>
        <Route path='/properties' element={<Properties/>}/>
      </Routes>
      </div>
      <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App