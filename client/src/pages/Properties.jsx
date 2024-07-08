import { useEffect, useState } from 'react'
import { GiSofa } from 'react-icons/gi';
import { BiDownArrow, BiHeart, BiSolidBath, BiSolidBed, BiSolidHeart } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { FaLocationPin, FaShare } from 'react-icons/fa6';

function Properties() {

  const navigate = useNavigate();
  const [filterListings, setFilterListings] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    searchData: '',
    discount: 'false',
    furnished: 'false',
    type: 'both',
    minPrice: 0,
    maxPrice: Infinity,
    sort: 'createdAt',
    order: 'desc',
  });

  useEffect(() => {

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
        maxPrice : maxPrice || Infinity,
        sort: sort || 'created_At',
        order: order || 'desc',
      });
    }

    const filterListings = async (req, res, next) => {

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
          console.log(data.message);
          return;
        }
        setFilterListings(data);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    filterListings();
  
  }, [location.search]);

  const handleShare = (id) => {
    const url = `${window.location.origin}/listing/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000)
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
    if(e.target.name === 'sort'){
      setFilterData(()=>({
        ...filterData,
        sort: e.target.id.split('_')[0] || 'createdAt',
        order: e.target.id.split('_')[1] || 'desc'
      }))
    }
  }

  const handleFilters = (e)=>{
    e.preventDefault();
    setShowFilter(false);
    const url = new URLSearchParams();
    url.set('discount', filterData.discount);
    url.set('furnished',filterData.furnished);
    url.set('type' , filterData.type);
    url.set('minPrice',filterData.minPrice);
    url.set('maxPrice', filterData.maxPrice);
    url.set('sort', filterData.sort);
    url.set('order', filterData.order);
    url.set('searchData', filterData.searchData);
    const url_updated = url.toString();
    navigate(`/properties?${url_updated}`)
  }

  return (
    <div className='relative mt-24 mx-24 h-[1000px]'>
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
                  <input onChange={handleChange} type="checkbox" id='discount' /> discount
                </label>
                <label>
                  <input onChange={handleChange} type="checkbox" id='furnished' /> furnished
                </label>
                <span className='font-semibold'>Type: </span>
                <div onChange={handleChange} className='flex item-center gap-4'>

                  <label className='flex item-center gap-2'>
                    <input type="radio" checked={filterData.type === 'all'} name='type' id='all' /> both
                  </label>
                  <label className='flex item-center gap-2'>
                    <input checked={filterData.type === 'sell'}  type="radio" name='type' id='sell' /> sell
                  </label>
                  <label className='flex item-center gap-2'>
                    <input checked={filterData.type === 'rent'}  type="radio" name='type' id='rent' /> rent
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
                    <input checked={filterData.sort === 'createdAt' && filterData.order === 'asc'} type="radio" name="sort" id='createdAt_asc' /> Newest
                  </label>
                  <label>
                    <input checked={filterData.sort === 'createdAt' && filterData.order === 'desc'} type="radio" name="sort" id='createdAt_desc' /> Oldest
                  </label>
                </div>

              </div>


              <button onClick={handleFilters} className="mt-4 p-2 bg-blue-500 hover:bg-blue-400 text-white rounded">Apply Filters</button>
            </div>
          )}
        </div>
      </header>




      <div className=' flex flex-wrap gap-4 justify-center'>
        {filterListings &&
          filterListings.map((item, index) => (
            <div key={item._id} className='flex flex-col border rounded-lg border-slate-300 bg-white gap-1 xs:w-64 relative hover:bg-slate-50 shadow-lg overflow-hidden'>
              <Link to={`/listing/${item._id}`}>
                <img className='w-full xxs:h-36 xs:h-60 border rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-700' src={item.imageUrls[0]} alt="" />
              </Link>
              <div className='absolute top-2 right-2 flex gap-2'>
                <BiHeart className='text-red-500 cursor-pointer text-lg' />
                <FaShare onClick={() => handleShare(item._id)} className='text-blue-500 cursor-pointer' />
              </div>
              <div className='flex flex-col gap-3 px-1'>

                <div className='flex justify-between items-center'>
                  <span className='truncate xxs:text-xs xs:text-sm font-semibold xxs:w-24 xs:w-40'>{item.title}</span>
                  <span className='truncate xxs:text-sm xs:text-lg font-semibold xxs:mr-1 sm:mr-4 text-yellow-600'>${item.regularPrice}</span>
                </div>
                <ul className='flex flex-wrap gap-3 items-center '>
                  <li className='flex gap-1 items-center '>
                    <BiSolidBath className='text-blue-600' />
                    <span className='text-xs xs:text-sm'>{`${item.bathrooms} baths`}</span>
                  </li>
                  <li className='flex gap-1 items-center'>
                    <BiSolidBed className='text-blue-600' />
                    <span className='text-xs xs:text-sm'>{`${item.bedrooms} baths`}</span>
                  </li>
                  <li className='flex gap-1 items-center'>
                    <GiSofa className='text-blue-600' />
                    <span className='text-xs xs:text-sm'>{item.furnished ? 'furnished' : 'Not furnished'}</span>
                  </li>
                </ul>
                <div className='flex justify-between pb-1'>
                <ul className='flex gap-0.5 items-center mb-1'>
                  <FaLocationPin className='text-blue-600' />
                  <li className='truncate text-xs xs:text-sm w-20 xs:w-40'>{`${item.city},${item.state}, ${item.country}`}</li>
                </ul>
                  <span className='text-xs xs:bg-red-500 text-red-500 xs:p-1 xs:text-white xs:border xs:rounded-lg text-center'>{`For ${item.type}`}</span>
                  </div>
              </div>
            </div>
          ))}
      </div>
      {
        copied &&
        <span className='fixed left-1/2 bottom-6 transform transition-shadow ease-in-out duration-500 bg-gray-700 opacity-60 text-white transform -translate-x-1/2 p-3 border rounded-md'>Link Copied</span>
      }
    </div>
  )
}

export default Properties