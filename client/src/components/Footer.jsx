import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaX, FaYoutube } from 'react-icons/fa6'
import { PiTwitterLogo } from 'react-icons/pi'
import { useLocation } from 'react-router-dom';

function Footer() {

    const location = useLocation();
  const headerRoutes = [
    '/',  
    '/about',
    '/listing/:listingId',
    '/myWishlist',
    '/myListing/:userId',
    '/properties/?'
  ];

  const showFooter = headerRoutes.some(route => 
    new RegExp(`^${route.replace(/:[^\s/]+/g, '[^/]+')}$`).test(location.pathname)
  );

  return (
      <>
      {
          showFooter &&
          
          <main className='bg-gray-500 text-white xxs:p-4 xs:p-6  sm:p-8 lg:p-10 lg:mt-10 w-screen'>
            <div className='flex justify-between font-semibold xxs:text-xs sm:text-sm md:text-lg'>

                <ul className='flex flex-col gap-0.5 xs:gap-2 w-28 xs:w-36 sm:w-52'>
                    <li>Email: abcd@heavennest.com</li>
                    <li>Call Us: +44 11 7654 7658</li>
                    <li>654 Shoreline Drive,</li>
                    <li>Coastal Haven, California, USA</li>
                </ul>

                <ul className='flex flex-col gap-2'>
                    <li className='text-center pb-2 sm:text-lg md:text-xl'>Follow us: </li>
                    <li className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 lg:gap-7 sm:text-xl'>
                        <FaFacebook className=''/>
                        <FaInstagram/>
                        <FaLinkedin/>
                        <PiTwitterLogo/>
                        <FaYoutube/>
                    </li>

                </ul>

                <ul className='flex flex-col sm:gap-1.5'>
                    <li className='sm:text-lg md:text-xl pb-1.5'>Download</li>
                    <li className='xxs:pl-1 sm:pl-4'>Mobile app</li>
                    <li className='xxs:pl-1 sm:pl-4'>Windows app</li>
                    <li className='xxs:pl-1 sm:pl-4'>Mac app</li>
                </ul>

                <ul className='hidden sm:flex flex-col xs:gap-1 sm:gap-3 md:gap-5'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Properties</li>
                </ul>
            </div>
          </main>
        }
    </>
  )
}

export default Footer