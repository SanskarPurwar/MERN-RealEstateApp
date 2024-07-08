import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {  FaLocationPin, FaShare } from 'react-icons/fa6';
import {  GiSofa } from 'react-icons/gi';
import { BiHeart,  BiSolidBath, BiSolidBed, BiSolidHeart } from 'react-icons/bi';

function Listing() {

    const [loading, setLoading] = useState(false);

    SwiperCore.use([Navigation]);
    const params = useParams();
    const listingId = params.listingId;
    const [like, setLike ]= useState(false); 
    const [copied , setCopied] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        bedrooms: 1,
        bathrooms: 1,
        type: 'rent',
        furnished: false,
        selectedPerks: [],
        imageUrls: [],
        regularPrice: 30,
        discountedPrice: 30,
        discount: false,
    })

    useEffect(() => {
        const getPost = async (req, res, next) => {
            setLoading(true);
            const listingId = params.listingId;
            try {
                setLoading(true);
                const response = await fetch(`/api/listing/getListing/${listingId}`);
                const data = await response.json();
                console.log(data);
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setFormData(data);
                setLoading(false);
                return;
            } catch (error) {
                console.log(error);
            }
        }
        getPost();
    }, [])

    const handleShare = ()=>{
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        } , 1000)
    }

    const handleLike = ()=>{
        console.log('clisked');
        setLike((like)=>(like = !like)
    )}
    console.log(formData)
    console.log(like);
    return (
        <main className='m-4'>
            {!loading && formData && (
                <>
                    <div className='border rounded-lg'>
                        <Swiper navigation>
                            {
                                formData.imageUrls.map((url, index) => (
                                    <SwiperSlide key={url}>
                                        <div className='border rounded-lg relative h-[300px] sm:h-[450px] md:h-[600px] lg:h-[650px] w-full'>
                                            <img src={url} className='rounded-lg absolute top-0 left-0 w-full h-full' alt="" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                    <div className='flex flex-wrap m-5 gap-20 justify-center'>
                        <div className='flex flex-col max-w-2xl gap-4'>
                            <div className='flex flex-wrap gap-16 sm:gap-28'>
                                <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-14'>
                                    <p className='text-xl font-semibold'>{formData.title}</p>
                                    <div className='flex gap-3 items-center text-xl  hover:cursor-pointer'>
                                        <FaShare className='text-blue-500' onClick={handleShare}  />
                                        
                                        <div className='text-red-500' onClick={handleLike}>
                                            {like ? <BiSolidHeart/>: <BiHeart/>}
                                        </div>    
                                    </div>
                                </div>
                                {copied && <p className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md opacity-80 transition-opacity duration-500 ease-in-out'>Link Copied</p> }
                                    <div className='flex gap-3 items-center'>
                                        <FaLocationPin className='text-blue-600' />
                                        <p>{`${formData.streetAddress}, ${formData.city}, ${formData.state}, ${formData.country}`}</p>
                                    </div>
                                    <div className='flex gap-5'>
                                        <div className='flex gap-2 items-center'>
                                            <GiSofa className='text-blue-600 text-xl' />
                                            <p className='pb-1'>{formData.furnished ? 'furnished' : 'Not furnished'}</p>
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            <BiSolidBed className='text-blue-600 text-xl' />
                                            <p className='pb-1'>{formData.bedrooms} beds</p>
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            <BiSolidBath className='text-blue-600 text-xl' />
                                            <p className='pb-1'>{formData.bathrooms} baths</p>
                                        </div>
                                    </div>
                                </div>                                
                                <div className='border border-slate-600 py-2 px-4 rounded-xl bg-blue-500 text-gray-100'>
                                    <span className='text-4xl font-semibold'>{`$${formData.regularPrice} `}</span> <span>{formData.type === 'rent' ? '/month' : ''}</span>
                                    {
                                        formData.discount &&
                                        <p>{`offer $${formData.regularPrice - formData.discountedPrice} off`}</p>
                                    }
                                    <p className='bg-red-600 text-center border border-none rounded-lg p-1 mt-2'>{`For ${formData.type === 'sell' ? 'Sale' : 'Rent'}`}</p>
                                </div>
                            </div>

                            <div className='flex border border-slate-300 p-5 rounded-xl'>
                                <div className='flex flex-col'>
                                    <p className='text-xl pl-2 font-semibold'>Description</p>
                                    <p className='m-2'>{formData.description}</p>
                                </div>
                            </div>

                            <div className='border border-slate-500 rounded-xl p-4'>
                                <h1 className='text-center font-semibold text-blue-950 text-2xl'>Amneties</h1>
                                <div className='grid grid-cols-3 gap-6 mt-4 content-center'>
                                    {formData.selectedPerks.map((item, index) => (
                                        <div className='bg-white py-2 px-4 border rounded-lg text-center text-purple-600'>
                                            <p>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className='flex flex-col gap-5 border rounded-md border-red-600 p-6 my-6 text-center sticky top-12 h-fit'>
                            <h1 className='font-semibold mb-4'>Contact Owner</h1>
                            <button className='bg-green-500 hover:bg-green-400 p-2 border rounded-md text-white font-semibold w-80 '>Schedule tour</button>
                            <button className='bg-blue-500 hover:bg-blue-400 p-2 border rounded-md text-white font-semibold w-80'>Chat with Owner</button>

                            <p className='font-thin'>9 a.m - 6 p.m (Weekdays)</p>
                        </div>

                    </div>
                </>
            )}
        </main>
    )
}

export default Listing;