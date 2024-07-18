import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';

function Home() {

  const navigate = useNavigate();
  const [searchData, setSearchData] = useState('');
  const [affordableListSell, setAffordableListSell] = useState([]);
  const [affordableListRent, setAffordableListRent] = useState([]);
  const [latestList, setLatestList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const rentCarouselRef = useRef(null);
  const saleCarouselRef = useRef(null);
  const dealCarouselRef = useRef(null);
  const latestCarouselRef = useRef(null);
  const [loading, setLoading] = useState(false);


  const scrollSaleLeft = () => {
    if (saleCarouselRef.current) {
      saleCarouselRef.current.scrollBy({
        left: -saleCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollSaleRight = () => {
    if (saleCarouselRef.current) {
      saleCarouselRef.current.scrollBy({
        left: saleCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };
  const scrollRentLeft = () => {
    if (rentCarouselRef.current) {
      rentCarouselRef.current.scrollBy({
        left: -rentCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRentRight = () => {
    if (rentCarouselRef.current) {
      rentCarouselRef.current.scrollBy({
        left: rentCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };
  const scrollDealLeft = () => {
    if (dealCarouselRef.current) {
      dealCarouselRef.current.scrollBy({
        left: -dealCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollDealRight = () => {
    if (dealCarouselRef.current) {
      dealCarouselRef.current.scrollBy({
        left: dealCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };


  const scrollLatestLeft = () => {
    if (latestCarouselRef.current) {
      latestCarouselRef.current.scrollBy({
        left: -latestCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollLatestRight = () => {
    if (latestCarouselRef.current) {
      latestCarouselRef.current.scrollBy({
        left: latestCarouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const lists = async () => {
      const response1 = await fetch(`/api/listing/filterLists/?sort=regularPrice&order=asc&type=sell`);
      const response2 = await fetch(`/api/listing/filterLists/?sort=regularPrice&order=asc&type=rent`);
      const response3 = await fetch('/api/listing/filterLists/?discount=true');
      const response4 = await fetch('/api/listing/filterLists/?sort=createdAt');
      const data1 = await response1.json();
      const data2 = await response2.json();
      const data3 = await response3.json();
      const data4 = await response4.json();
      console.log(data1)
      if (data1.success === false) {
        setErrorAscPriceSell(data1.message);
      } else {
        setAffordableListSell(data1);
      }


      if (data1.success === false) {
        setErrorAscPriceRent(data2.message);
      } else {
        setAffordableListRent(data2);
      }

      if (data1.success === false) {
        setErrorDiscount(data3.message);
      } else {
        setDiscountList(data3);
      }

      if (data1.success === false) {
        setErrorLatest(data4.message);
      } else {
        setLatestList(data4);
      }
      setLoading(false);
    }

    lists();
  }, [])


  const handleChange = (e) => {
    setSearchData(e.target.value);
  }

  const handleSearch = () => {
    navigate(`/properties?searchData=${searchData}`);
  }

  return (
    <main className='relative mx-0'>

      {
        loading && 
        <div className='text-red-500 text-3xl text-center'>Loading...</div>
      }

      {!loading &&
        <div>

          <img className='w-full object-cover' src="/front.jpg" alt="" />
          <div className='absolute top-2 left-8 xs:left-16 xs:top-6 sm:top-16 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl'>

            <span className='xxs:text-xl  sm:text-3xl md:text-4xl lg:text-5xl text-white text-center'>Experience</span>
            <span className='xxs:text-xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 max-w-xl text-center'> Heaven </span>
            <span className='xxs:text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center'>on Earth: </span>
            <span className='xxs:text-xl sm:text-4xl md:text-5xl lg:text-6xl text-green-300 text-center'>Own or Rent</span>
            <span className='xxs:text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center'> Your Dream Home at </span>
            <span className='xxs:text-xl sm:text-4xl md:text-5xl lg:text-6xl text-red-400 text-center'> HEAVENNEST </span>
            <span className='xxs:text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center'> Today!</span>
            <div className='absolute flex gap-0 top-32 xs:top-40 sm:top-52 md:top-64 lg:top-96'>
              <input onChange={handleChange} className='w-44 p-1 sm:p-2 rounded-lg rounded-r-none sm:w-72 outline-none' type="text" placeholder='Search' />
              <button onClick={handleSearch} className='bg-blue-500 hover:text-gray-800 p-1 sm:p-2 text-center rounded-md rounded-l-none'> search </button>
            </div>
          </div>
          <h1 className='mt-10 mx-8 text-lg sm:text-2xl font-bold'>Top affordable Homes for Sale</h1>

          <div className='relative mx-8'>
            <button
              onClick={scrollSaleLeft}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowLeft />
            </button>
            <div
              ref={saleCarouselRef}
              className='flex overflow-x-auto gap-4 mx-8 my-4 scrollbar-hide'
            >
              {affordableListSell.map((item, index) => (
                <div key={index} className='flex-none'>
                  <Card item={item} key={index} />
                </div>
              ))}
            </div>
            <button
              onClick={scrollSaleRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowRight />
            </button>
          </div>

          <h1 className='mt-10 mx-8 text-lg sm:text-2xl font-bold'>Top affordable Homes for Rent</h1>

          <div className='relative mx-8'>
            <button
              onClick={scrollRentLeft}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowLeft />
            </button>
            <div
              ref={rentCarouselRef}
              className='flex overflow-x-auto gap-4 mx-8 my-4 scrollbar-hide'
            >
              {affordableListRent.map((item, index) => (
                <div key={index} className='flex-none'>
                  <Card item={item} key={index} />
                </div>
              ))}
            </div>
            <button
              onClick={scrollRentRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowRight />
            </button>
          </div>

          <h1 className='mt-10 mx-8 text-lg sm:text-2xl font-bold'>Top Deals</h1>
          {/* Cards Carousel showing top deals  */}
          <div className='relative mx-8'>
            <button
              onClick={scrollDealLeft}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowLeft />
            </button>
            <div
              ref={dealCarouselRef}
              className='flex overflow-x-auto gap-4 mx-8 my-4 scrollbar-hide'
            >
              {discountList.map((item, index) => (
                <div key={index} className='flex-none'>
                  <Card item={item} key={index} />
                </div>
              ))}
            </div>
            <button
              onClick={scrollDealRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowRight />
            </button>
          </div>

          <h1 className='mt-10 mx-8 text-lg sm:text-2xl font-bold'>Latest :</h1>
          {/* Cards Carousel showing top deals  */}
          <div className='relative mx-8'>
            <button
              onClick={scrollLatestLeft}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowLeft />
            </button>
            <div
              ref={latestCarouselRef}
              className='flex overflow-x-auto gap-4 mx-8 my-4 scrollbar-hide'
            >
              {latestList.map((item, index) => (
                <div key={index} className='flex-none'>
                  <Card item={item} key={index} />
                </div>
              ))}
            </div>
            <button
              onClick={scrollLatestRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full shadow-lg'
            >
              <PiArrowRight />
            </button>
          </div>
        </div>
      }

    </main>
  )
}

export default Home;