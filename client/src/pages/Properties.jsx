import { useEffect, useState } from 'react'
import { GiSofa } from 'react-icons/gi';
import { BiDownArrow, BiHeart, BiSolidBath, BiSolidBed, BiSolidHeart } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { FaLocationPin, FaShare } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice';
import Card from '../components/Card';

function Properties() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const [filterListings, setFilterListings] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [needLogIn, setNeedLogin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);


  const [filterData, setFilterData] = useState({
    searchData: '',
    discount: 'true',
    furnished: 'true',
    type: 'all',
    minPrice: 0,
    maxPrice: Infinity,
    sort: 'createdAt',
    order: 'desc',
  });

  useEffect(() => {
    setLoading(true);
    const url = new URLSearchParams(location.search);
    const searchData = url.get('searchData');
    const type = url.get('type');
    const furnished = url.get('furnished');
    const discount = url.get('discount');
    const minPrice = url.get('minPrice');
    const maxPrice = url.get('maxPrice');
    const sort = url.get('sort');
    const order = url.get('order');

    if (searchData || type || furnished || discount || sort || order || maxPrice || minPrice) {
      setFilterData({
        searchData: searchData || '',
        type: type || 'all',
        furnished: furnished === 'true' ? true : false,
        discount: discount === 'true' ? true : false,
        minPrice: minPrice || 0,
        maxPrice: maxPrice || Infinity,
        sort: sort || 'created_At',
        order: order || 'desc',
      });
    }

    const filterListingsFunction = async () => {
      
      try {
        const url_updated = url.toString();
        const response = await fetch(`/api/listing/filterLists?${url_updated}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        if (data.success === false) {
          setLoading(false)
          return;
        }
        if (data.length >= 9) {
          setShowMore(true);
          
        } else {
          setShowMore(false);
          
        }
        setLoading(false)
        setFilterListings(data);
      } catch (error) {
        console.log(error);
        setLoading(false)
        return;
      }
    }

    filterListingsFunction();

  }, [location.search]);

  const handleShare = (id) => {
    const url = `${window.location.origin}/listing/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000)
  }
  const handleWishlist = async (listingId) => {
    setNeedLogin(false);
    if (!currentUser) {
      setTimeout(() => {
        setNeedLogin(false);
      }, 1000);
      setNeedLogin(true);
      return;
    }
    try {
      const response = await fetch(`/api/user/updateWishlist/${listingId}/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      dispatch(updateUserSuccess(data));
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }

  }

  const handleChange = (e) => {

    if (e.target.type === 'checkbox') {
      setFilterData(() => ({
        ...filterData,
        [e.target.id]: e.target.checked
      }))
    }

    if (e.target.name === 'type') {
      setFilterData(() => ({
        ...filterData,
        [e.target.name]: e.target.id
      }))
    }
    if (e.target.type === 'number') {
      setFilterData(() => ({
        ...filterData,
        [e.target.id]: e.target.value
      }))
    }
    if (e.target.name === 'sort') {
      setFilterData(() => ({
        ...filterData,
        sort: e.target.id.split('_')[0] || 'createdAt',
        order: e.target.id.split('_')[1] || 'desc'
      }))
    }
  }

  const handleFilters = (e) => {
    e.preventDefault();
    setShowFilter(false);
    const url = new URLSearchParams();
    url.set('discount', filterData.discount);
    url.set('furnished', filterData.furnished);
    url.set('type', filterData.type);
    url.set('minPrice', filterData.minPrice);
    url.set('maxPrice', filterData.maxPrice);
    url.set('sort', filterData.sort);
    url.set('order', filterData.order);
    url.set('searchData', filterData.searchData);
    const url_updated = url.toString();
    navigate(`/properties?${url_updated}`)
  }

  const showMoreClicked = async () => {
    setShowMore(false);
    const startIndex = filterListings.length;
    const url = new URLSearchParams(location.search);
    url.set('startIndex', startIndex);
    const updatedUrl = url.toString();
    const response = await fetch(`/api/listing/filterLists/?${updatedUrl}`);
    const data = await response.json();
    if (data.success === false) {
      return;
    }
    console.log(data);
    if (data.length >= 5) setShowMore(true);
    else { setShowMore(false) };
    setFilterListings((filterListings) => [...filterListings, ...data]);
  }

  return (
    <div className='relative my-32 w-screen'>
      <header className={`fixed ${showFilter ? 'top-16 left-0' : 'xxs:top-20 xxs:left-1 xs:left-6 sm:top-24 sm:left-10 md:left-16 md:top-20'} flex gap-10 z-10 bg-white`}>
        <div className='flex flex-col'>
          <div onClick={() => setShowFilter(!showFilter)} className='flex gap-2 items-center border border-black py-1 px-3 cursor-pointer bg-inherit hover:bg-slate-100'>
            <span className=''>Filters</span>
            <BiDownArrow className='text-sm pt-1' />
          </div>
          {showFilter && (
            <div className="p-4 border rounded">
              <div className="flex flex-col gap-2">
                <label>
                  <input onChange={handleChange} checked={filterData.discount} type="checkbox" id='discount' /> discount
                </label>
                <label>
                  <input onChange={handleChange} checked={filterData.furnished} type="checkbox" id='furnished' /> furnished
                </label>
                <span className='font-semibold'>Type: </span>
                <div onChange={handleChange} className='flex item-center gap-4'>

                  <label className='flex item-center gap-2'>
                    <input type="radio" checked={filterData.type === 'all'} name='type' id='all' /> both
                  </label>
                  <label className='flex item-center gap-2'>
                    <input checked={filterData.type === 'sell'} type="radio" name='type' id='sell' /> sell
                  </label>
                  <label className='flex item-center gap-2'>
                    <input checked={filterData.type === 'rent'} type="radio" name='type' id='rent' /> rent
                  </label>

                </div>
                <label className='flex item-center gap-2'>
                  <input onChange={handleChange} value={filterData.minPrice} className='bg-gray-100 py-1 px-2 w-16 border rounded-lg outline-none' type="number" id='minPrice' /> minPrice
                  <input onChange={handleChange} value={filterData.maxPrice} className='bg-gray-100 py-1 px-2 w-16 border rounded-lg outline-none' type="number" id='maxPrice' /> maxPrice
                </label>
                <p>Sort By</p>
                <div onChange={handleChange} className="flex flex-col gap-2 p-4 border rounded">
                  <label>
                    <input checked={filterData.sort === 'regularPrice' && filterData.order === 'asc'} type="radio" name="sort" id='regularPrice_asc' /> Price: Low to High
                  </label>
                  <label>
                    <input checked={filterData.sort === 'regularPrice' && filterData.order === 'desc'} type="radio" name="sort" id='regularPrice_desc' /> Price: High to Low
                  </label>
                  <label>
                    <input checked={filterData.sort === 'createdAt' && filterData.order === 'asc'} type="radio" name="sort" id='createdAt_asc' /> Oldest
                  </label>
                  <label>
                    <input checked={filterData.sort === 'createdAt' && filterData.order === 'desc'} type="radio" name="sort" id='createdAt_desc' /> Latest
                  </label>
                </div>

              </div>


              <button onClick={handleFilters} className="mt-4 p-2 bg-blue-500 hover:bg-blue-400 text-white rounded">Apply Filters</button>
            </div>
          )}
        </div>
      </header>

      {
        loading &&
        <p className='text-center text-2xl text-red-500'>Loading...</p>

      }
      {
        (!loading && filterListings.length === 0) &&
        <p className='text-center text-2xl text-red-500'>No properties exist related to this search</p>
      }

      {filterListings && (
        <div className='flex flex-wrap gap-4 justify-center mb-10'>
          {filterListings.map((item, index) => (
            <div key={index} className='relative'>
              <Card item={item} />
              <div className='absolute top-2 right-2 flex gap-2'>
                {currentUser?.wishlist.includes(item._id) ? (
                  <BiSolidHeart
                    onClick={() => handleWishlist(item._id)}
                    className='text-red-500 cursor-pointer text-lg'
                  />
                ) : (
                  <BiHeart
                    onClick={() => handleWishlist(item._id)}
                    className='text-red-500 cursor-pointer text-lg'
                  />
                )}
                <FaShare
                  onClick={() => handleShare(item._id)}
                  className='text-blue-500 cursor-pointer'
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showMore &&
        <p onClick={showMoreClicked} className='text-blue-500 text-center p-4 cursor-pointer hover:text-blue-400'> show more</p>
      }
      {
        copied &&
        <span className='fixed left-1/2 bottom-6 transform transition-shadow ease-in-out duration-500 bg-gray-700 opacity-60 text-white transform -translate-x-1/2 p-3 border rounded-md'>Link Copied</span>
      }
      {
        needLogIn &&
        <span className='fixed left-1/2 bottom-6 transform transition-shadow ease-in-out duration-500 bg-gray-700 opacity-60 text-white transform -translate-x-1/2 p-3 border rounded-md'>Please Sign-up</span>
      }
    </div>
  )
}

export default Properties