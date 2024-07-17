import React from 'react'

function About() {
  return (
    <main className='p-6'>
      <h1 className='text-center text-2xl font-semibold mb-3'>About</h1>
      <div className='p-3 sm:px-14'>Welcome to HEAVENNEST, your one-stop destination for all things real estate. Whether you're looking to buy, sell, rent, or lease a home, HEAVENNEST connects you with a vibrant community of homeowners, buyers, and renters. Our platform simplifies the process of finding your dream home or the perfect tenant, making real estate transactions seamless and stress-free.

        At HEAVENNEST, we believe that finding a place to call home should be a joyous and hassle-free experience. Our user-friendly interface allows you to easily browse listings, filter by your specific needs, and connect directly with sellers or landlords. For sellers and landlords, our platform offers a wide audience of potential buyers and tenants, ensuring your property gets the attention it deserves.

        Join the HEAVENNEST community today and discover a better way to navigate the real estate market. Whether you're moving across town or across the country, HEAVENNEST is here to help you find your perfect nest
      </div>

      <div className='flex flex-wrap justify-evenly sm:mt-16 mb-10 '>
        <div className='p-3 lg:p-4 sm:max-w-sm md:max-w-md lg:max-w-xl'>
          <h1 className='font-semibold text-2xl mb-6 text-center'>Meet The Creator</h1>
          <p className='text-wrap'>
            <span>I'm Sanskar, the developer behind HEAVENNEST. As a 4th-year B.Tech student at IIT Jammu, 
            I dedicated a month to building this website from the ground up. Leveraging a robust tech 
            stack that includes Tailwind CSS, ReactJS, NodeJS, ExpressJS, Redux Toolkit, Firebase, MongoDB, 
            and Socket.io, I aimed to create a seamless and efficient platform for real estate transactions. </span>
            <span className='hidden md:inline'>   
            My dedication to combining cutting-edge technology with user-friendly design has resulted in a dynamic 
            space where buying, selling, renting, and leasing homes is simplified and accessible to all.</span>
             
          </p>
        </div>
        <img className='hidden sm:inline w-1/3 rounded-md lg:mr-14 object-cover' src="/myImage.jpg" alt="" />
      </div>


    </main>
  )
}

export default About;