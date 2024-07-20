import { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';
import { FaShare } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { updateCurrentUser } from 'firebase/auth';
import { updateUserSuccess } from '../redux/user/userSlice';


function MyWishlist() {

    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [listing, setListing] = useState([]);
    const [emptyWishList, setEmptyWishlist] = useState(false);
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleShare = (id) => {
        const url = `${window.location.origin}/listing/${id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000)
    }

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in')
        }
        if (!currentUser.wishlist || currentUser.wishlist.length === 0) {
            setEmptyWishlist(true);
        }
        const fetchListings = async () => {
            try {
                const responses = await Promise.all(
                    currentUser.wishlist.map((listingId) =>
                        fetch(`/api/listing/getListing/${listingId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                    )
                );
                const data = await Promise.all(responses.map((response) => response.json()));

                const successfulListings = data.filter((item) => item.success !== false);

                setListing(successfulListings);
            } catch (error) {
                console.error('Failed to fetch listings', error);
            }
        }
        fetchListings();
    }, [currentUser.wishlist])

    const deleteListing = async (listingId) => {
        try {
            const response = await fetch(`/api/user/updateWishlist/${listingId}/${currentUser._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json();
            if (data.success === false) {
                console.log(data);
                return;
            }
            console.log(data);
            dispatch(updateUserSuccess(data));
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <main className='my-24'>

            <h1 className='text-center text-2xl w-full p-3 m-4 font-semibold'>My Wishlist</h1>
            {
                emptyWishList &&
                <h1 className='text-center text-xl text-red-400'>
                    Empty Wishlist : Add your Favourite Properties
                </h1>
            }
            <div className='flex flex-wrap gap-4 justify-center'>


                {listing && (
                    <div className='flex flex-wrap gap-4 justify-center'>
                        {listing.map((item, index) => (
                            <div key={index} className='relative'>
                                <Card item={item} />
                                <div className='absolute top-2 right-2 flex gap-2'>
                                    <FaShare onClick={() => handleShare(item._id)} className='text-blue-500 cursor-pointer' />
                                    <BiTrash onClick={() => deleteListing(item._id)} className='text-red-500 cursor-pointer' />
                                </div>
                            </div>
                        ))}
                    </div>
                )}


            </div>
            {
                copied &&
                <span className='fixed left-1/2 bottom-6 transform transition-shadow ease-in-out duration-500 bg-gray-700 opacity-60 text-white transform -translate-x-1/2 p-3 border rounded-md'>Link Copied</span>
            }
        </main >
    )
}

export default MyWishlist