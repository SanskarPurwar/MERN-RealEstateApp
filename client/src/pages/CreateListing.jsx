import { useEffect, useRef, useState } from 'react'
import { FaFireExtinguisher, FaKitchenSet } from 'react-icons/fa6';
import { PiBathtubFill, PiTelevisionFill } from 'react-icons/pi';
import { BiSolidWasher, BiImageAdd, BiSolidFirstAid, BiWifi, BiSolidFridge, BiSolidDryer } from 'react-icons/bi';
import { TbIroning3, TbMicrowave } from 'react-icons/tb'
import { GiHeatHaze, GiCctvCamera, GiBarbecue } from 'react-icons/gi'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';  

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from 'react-modal';
import { FaParking } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');

function CreateListing() {
    const fileRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loadingimage, setLoadingImage] = useState(false);
    const [uploadImageError, setUploadImageError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const {currentUser} = useSelector(state=>state.user)
    const navigate = useNavigate();

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

    const perks = [
        { icon: <FaFireExtinguisher className='w-7 h-7 my-2' />, name: 'Fire Extinguisher' },
        { icon: <PiBathtubFill className='w-7 h-7 my-2' />, name: 'Bath tub' },
        { icon: <BiSolidWasher className='w-7 h-7 my-2' />, name: 'Washer' },
        { icon: <BiSolidDryer className='w-7 h-7 my-2' />, name: 'Dryer' },
        { icon: <TbIroning3 className='w-7 h-7 my-2' />, name: 'Iron' },
        { icon: <PiTelevisionFill className='w-7 h-7 my-2' />, name: 'Television' },
        { icon: <FaParking className='w-7 h-7 my-2' />, name: 'Free Parking' },
        { icon: <GiHeatHaze className='w-7 h-7 my-2' />, name: 'Heating' },
        { icon: <GiCctvCamera className='w-7 h-7 my-2' />, name: 'CCTV Camera' },
        { icon: <BiSolidFirstAid className='w-7 h-7 my-2' />, name: 'First Aid' },
        { icon: <BiWifi className='w-7 h-7 my-2' />, name: 'Free Wifi' },
        { icon: <FaKitchenSet className='w-7 h-7 my-2' />, name: 'Kitchen Set' },
        { icon: <BiSolidFridge className='w-7 h-7 my-2' />, name: 'Refrigerator' },
        { icon: <TbMicrowave className='w-7 h-7 my-2' />, name: 'Microwave' },
        { icon: <GiBarbecue className='w-7 h-7 my-2' />, name: 'Barbecue' },
    ];

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

    const handleFileChanges = async (e) => {
        setLoadingImage(true);
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        if (selectedFiles.length > 0 && selectedFiles.length + formData.imageUrls.length < 8) {
            setUploadImageError(false);
            const imgUrls = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                imgUrls.push(uploadFile(selectedFiles[i]))
            }
            Promise.all(imgUrls)
                .then((imageUrl) => {
                    setFormData({
                        ...formData, imageUrls: formData.imageUrls.concat(imageUrl),
                    });
                    console.log(`here is urls length:  ${formData.imageUrls},   ${formData.imageUrls.length}`)
                    setUploadImageError(false);
                    setLoadingImage(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoadingImage(false);
                    setUploadImageError(`Image should be less than 4 mb`)
                });
        }
        else {
            setUploadImageError("A maximum of 7 images can be uploaded");
            setLoadingImage(false);
        }
    };

    const uploadFile = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.log(`reject - ${error}`);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    })
                }
            )
        })


    }

    const handleDelete = (urlToDelete)=>{
        setFormData((formData)=>({
            ...formData,
            imageUrls:formData.imageUrls.filter( url=> url!=urlToDelete )
        }))
    }

    const handlePerks = (index)=>{
        if(formData.selectedPerks.includes(index)){
            console.log("selected Perks",formData.selectedPerks)
            setFormData({
                ...formData,
                selectedPerks:formData.selectedPerks.filter( (item)=>item!==index)
            });
        }else{
            setFormData({
                ...formData,
                selectedPerks:[...formData.selectedPerks, index]
            });
            console.log("formData", formData.selectedPerks)
        }
    }
    
    

    const handleChange = (e)=>{

        if(e.target.id === "title" || e.target.id === "description" || e.target.id === "streetAddress" || e.target.id === "country" 
            || e.target.id === "city" || e.target.id === "state"){
                setFormData({
                    ...formData,
                    [e.target.id] : e.target.value  
                })
            }
            
            else if(e.target.id === "sell" || e.target.id=="rent"){
                setFormData({
                    ...formData,
                    type : e.target.id
                })
            }
            else if(e.target.id === "furnished" || e.target.id === "discount"){
                setFormData({
                    ...formData,
                    [e.target.id] : e.target.checked
                })
            }
            else if(e.target.type == "number"){
                console.log(e.target.id);
                setFormData({
                    ...formData,
                    [e.target.id]: e.target.value
                })
            }
    } 

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(false);
        try {
            if(formData.imageUrls.length < 1){
                return setError('Upload atleast one image');
            }
            
            if(formData.discount && formData.regularPrice < formData.discountedPrice){
                return setError('Discounted Price Should be less than Regular Price')
            }
            if(!currentUser){
                return setError('User Not Logged In');
            }
            
            setLoading(true);
            setError(false); 
            const response = await fetch('/api/listing/create', {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });
            const data = await response.json();
            if(response.success === false){
                setLoading(false);
                return setError(data.message);
            }
            setLoading(false);
            navigate(`/listing/${data._id}`);
            setError(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <main className='max-w-7xl mx-auto my-6' >

            <h1 className='text-center font-semibold text-3xl my-5'>Publish Your Place</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-7 flex-wrap place-content-center'>

                <div className='flex gap-10 flex-wrap place-content-center ml-4 mr-2'>
                    <div className='flex flex-col gap-3 max-w-xl content-center'>
                        <h2 className='text-lime-600 font-semibold self-center' >Tell About Your Place</h2>

                        <input onChange={handleChange} className='p-3 border rounded-lg' type="text" id='title' placeholder='Title' minLength={5} maxLength={20} required />
                        <textarea onChange={handleChange} className='p-3 border rounded-lg' type='text' placeholder='Description' id='description' required />

                        <h2 className='text-rose-700 font-semibold self-center' >What's your place located</h2>
                        <div onChange={handleChange} className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                            <input className='p-3 border rounded-lg' type="text" id='streetAddress' placeholder='Street Address' />
                            <input className='p-3 border rounded-lg' type="text" id='city' placeholder='City' />
                            <input className='p-3 border rounded-lg' type="text" id='state' placeholder='State' />
                            <input className='p-3 border rounded-lg' type="text" id='country' placeholder='Country' />
                        </div>

                        <div className='flex gap-12 items-center'>
                            <div className='flex gap-3 items-center'>
                                <input onChange={handleChange} type="checkbox" checked={formData.type === 'sell'} name="sell" id="sell" />
                                <span>Sell</span>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <input onChange={handleChange} type="checkbox" checked={formData.type === 'rent'} name="rent" id="rent" />
                                <span>Rent</span>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <input onChange={handleChange} type="checkbox" name="furnished" id="furnished" />
                                <span>Furnished</span>
                            </div>

                        </div>

                        <div className='flex flex-wrap gap-3'>
                            <div className='flex items-center gap-2'>
                                <input onChange={handleChange} className='p-3 border border-gray-300 rounded-lg w-16' defaultValue={1} min={1} type="number" name="bedrooms" id="bedrooms" />
                                <span>Beds</span>
                            </div>

                            <div className='flex items-center gap-2'>
                                <input onChange={handleChange} className='p-3 border border-gray-300 rounded-lg w-16' defaultValue={1} type="number" min={1} required name="bathrooms" id="bathrooms" />
                                <span>Baths</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col flex-wrap max-w-xl items-center'>
                        <h2 className='text-blue-700 font-semibold mb-2'>Select Perks That Make Your Property Shine</h2>
                       
                        <div className='flex flex-wrap mx-7 justify-center'>
                        {
                            perks?.map((item , index)=>(
                                <div key={item.name}
                                className={`${formData.selectedPerks.includes(item.name) ? 'bg-sky-200': 'hover:bg-sky-100 bg-sky-50'} flex flex-col border rounded-lg items-center w-28 m-1.5 cursor-pointer border-sky-500`}
                                    onClick={()=>handlePerks(item.name)}>
                                {item.icon}
                                <p className='text-sm mb-1'>{item.name}</p>
                                </div>

                            ))
                        }
                        </div>

                    </div>
                </div>

                <h1 className='text-center font-semibold text-blue-700'>Enhance your property's appeal with stunning images</h1>

                <div className='flex flex-wrap place-content-center items-center text-sm mx-4'>

                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div
                                key={url}
                                className='flex flex-col justify-between m-3 border items-center'
                            >
                                <img
                                    src={url}
                                    alt='listing image'
                                    className='w-32 h-32 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer'
                                    onClick={() => openModal(index)}
                                />
                                <button
                                    type='button'
                                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                    onClick={() => handleDelete(url)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                    <div>
                        <BiImageAdd  className='w-32 h-32 cursor-pointer' onClick={() => !loadingimage && fileRef.current.click()} />
                        <input onChange={handleFileChanges} hidden type="file" id='image' accept='image/*' multiple ref={fileRef} />
                        <h1>{loadingimage ? "Uploading Images": "Upload Images (max 7)"}</h1>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        className='modal'
                        overlayClassName='modal-overlay'
                    >
                        <button onClick={closeModal} className='close-button'>X</button>
                        <Carousel
                            selectedItem={currentImageIndex}
                            showThumbs={false}
                            infiniteLoop={true}
                        >
                            {formData.imageUrls.map((url, index) => (
                                <div key={url}>
                                    <img src={url} alt={`Image ${index + 1}`} className='carousel-image' />
                                </div>
                            ))}
                        </Carousel>
                    </Modal>

                    
                </div>

                <p className='text-red-400 text-center'>
                    {(uploadImageError && uploadImageError) || (error && error) }
                </p>

                <div className=' flex flex-wrap gap-4 place-content-center text-sm sm:text:md' >
                    <div className='flex flex-wrap gap-3 items-center'>
                        <input onChange={handleChange} type="checkbox" name="discount" id="discount" />
                        <span>Discount</span>
                    </div>
                    <div className='flex flex-wrap gap-2 items-center'>
                        <input onChange={handleChange} className='border border-slate-400 rounded-lg w-20 p-2' type="number" name="regularPrice" id="regularPrice" defaultValue={30} />
                        <span>Regular Price ({formData.type === 'sell' ? '$' : '$/month'})</span>
                    </div>
                    {
                        formData.discount &&
                        <div className='flex flex-wrap gap-2 items-center'>
                            <input onChange={handleChange} className='border rounded-lg w-20 p-2' type="number" name="discountedPrice" id="discountedPrice" defaultValue={30} />
                            <span>Discounted Price ({formData.type === 'sell' ? '$' : '$/month'})</span>
                        </div>
                    }

                    <button 
                        disabled={loadingimage}
                        className='bg-green-500 p-3 border rounded-lg text-white hover:bg-opacity-90 w-80 lg:w-36'>
                        {loading  ? 'Uploading Post' : 'Create Post'}
                    </button>
                </div>


            </form>
        </main>
    )
}

export default CreateListing