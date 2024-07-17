import React, { useEffect, useState } from 'react'
import { FaLocationPin } from 'react-icons/fa6';
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';

function MyListing() {

    const { currentUser, loading } = useSelector(state => state.user)
    const [listingData, setListingData] = useState([]);
    const [errorDeletingListing, setErrorDeletingListing] = useState(false);
    const [deletingListing, setDeletingListing] = useState(false);
    const [error , setError] = useState(null);

    const {userId} = useParams();

    console.log(listingData)
    useEffect(() => {

        const myList = async () => {
            setError(null);
            if(userId !== currentUser._id){
                setError('Invalid request');
                return
            }
            try {
                    const response = await fetch(`/api/user/listing/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json();
                if (data.success === false) {
                    setError(data.message);
                    return;
                }
                if(data.length === 0){
                    setError("No Listing Found");
                    return;
                }
                setListingData(data)
            } catch (err) {
                setError(err);

                console.log(err)
            }
        }
        myList();

    }, []);

    const handleListingDelete = async (id) => {
        setErrorDeletingListing(false);
        setDeletingListing(true);
        try {
            const response = await fetch(`/api/listing/delete/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success === false) {
                setDeletingListing(false);
                setErrorDeletingListing(data.message);
                return;
            }
            setListingData((data) => {
                data.filter(listing => listing._id !== id);
            })
            setDeletingListing(false);

        } catch (error) {
            setDeletingListing(false);
            setErrorDeletingListing(error.message);
        }
    }

    return (
        <div className='flex flex-col flex-wrap gap-6 place-content-center m-4'>

            {!listingData &&
                <p>No listing found</p>
            }

            {errorDeletingListing &&
                <p className='text-red-700 text-center bg-red-100 py-2 max-w-5xl mx-auto border border-red-600 rounded-xl'>{errorDeletingListing}</p>}
            {
                error && 
                <p className='text-red-500 text-center py-2 max-w-5xl mx-auto text-2xl'>{error}</p>
            }
            {listingData &&
                listingData.map((item, index) => (
                    <div key={item._id} className='cursor-pointer flex sm:max-w-3xl bg-sky-50 overflow-auto text-xs sm:text-sm gap-2 sm:gap-5 rounded-lg border-sky-200 border-2'>
                        <Link to={`/listing/${item._id}`}>
                            <img className='w-32 h-full sm:w-40 md:w-56 border rounded-md' src={item?.imageUrls[0]} alt="" />
                        </Link>
                        <div className='flex flex-col flex-wrap my-2 sm:my-6 gap-3 justify-evenly mx-2 sm:mx-6'>

                            <h3 className='font-semibold'>{`${item.title}`}</h3>
                            <div className='items-center'>
                                <FaLocationPin className='text-sky-700 inline mx-1 sm:mx-2 mb-1.5' />
                                <p className='inline'>{`${item.streetAddress}, ${item.city}, ${item.state} ${item.country}`}</p>
                            </div>
                            <p>{`Posted by ${currentUser.username}`}</p>
                            <p className='bg-gray-600 text-white border rounded-lg p-2 w-32 sm:w-40 '> {`Regular Price : ${item.regularPrice}$`}</p>
                            {
                                item.discount &&
                                <p className='bg-green-500 text-white p-2 border rounded-lg w-32 sm:w-40'> {`Discount : ${item.discountedPrice}$`}</p>
                            }
                            <div className='flex gap-14'>
                                <button onClick={() => handleListingDelete(item._id)} className='text-red-600 hover:text-red-400 font-semibold'>{deletingListing ? 'DELETING' : 'DELETE'}</button>
                                <Link to={`/updateListing/${item._id}`}>
                                    <button className='text-blue-700 hover:text-blue-500 font-semibold'>EDIT</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MyListing