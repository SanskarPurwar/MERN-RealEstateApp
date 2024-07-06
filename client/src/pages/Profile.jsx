import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { FaLocationPin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector(state => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileProg, setFileProg] = useState(0);
  const [formData, setFormData] = useState({});
  const [uploadError, setUploadError] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [listingData, setListingData] = useState([])
  const [openListing, setOpenListing] = useState(false);
  const [errorDeletingListing, setErrorDeletingListing] = useState(false);
  const [deletingListing, setDeletingListing] = useState(false);


  console.log(formData);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });

      const data = await response.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        setUpdated(false);
        return;

      }
      dispatch(updateUserSuccess(data));
      setUpdated(true);
      setTimeout(() => {
        setUpdated(false);
      }, 3000)

    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdated(false);
    }
  }

  useEffect(() => {
    try {
      if (file) {
        handleFileUpload(file);
      }
    } catch (error) {
      console.log(error);
    }

  }, [file])

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadFile = uploadBytesResumable(storageRef, file);

    uploadFile.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProg(Math.round(progress));
      },
      (error) => { setUploadError(true); },

      () => {
        getDownloadURL(uploadFile.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          });
      }
    )
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
        });
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure());
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/sign-out');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    if (openListing) {
      setOpenListing(false);
      return;
    }
    setError(false);
    try {
      const response = await fetch(`api/user/listing/${currentUser._id}`, {
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
      setListingData(data)
      setOpenListing(true);
    } catch (error) {
      console.log('Listing error is ', error)
    }
  }

  const handleListingDelete = async (id) => {
    setErrorDeletingListing(false);
    setDeletingListing(true);
    try {
      const response = await fetch(`/api/listing/delete/${id}`,{
        method:'DELETE'
      });
      const data = await response.json();
      if (data.success === false) {
        setDeletingListing(false);
        setErrorDeletingListing(data.message);
        return;
      }
      setListingData((data)=>{
        data.filter(listing=>listing._id!==id);
      })
      setDeletingListing(false);

    } catch (error) {
      setDeletingListing(false);
      setErrorDeletingListing(error.message);
    }
  }


  return (
    <>
      <div className='max-w-sm md:max-w-lg mx-auto p-3'>
        <h1 className='text-xl md:text-3xl text-center my-5 font-semibold'>Welcome {currentUser.username}</h1>

        {
          updated &&
          <p className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-lg text-center mb-2">
            User Updated Successfully
          </p>
        }

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input onChange={(e) => setFile(e.target.files[0])} hidden type="file" name="file" id="myFile" ref={fileRef} accept='image/.*' />
          <img onClick={() => fileRef.current.click()} className='w-32 h-32 rounded-full mx-auto object-cover cursor-pointer' src={formData.avatar || currentUser.avatar} alt="n click here " id='avatar' />
          <p className='text-sm self-center'>
            {uploadError ? (
              <span className='text-red-700'>
                Error uploading image
              </span>
            ) : fileProg > 0 && fileProg < 100 ? (
              <span className='text-green-700'>{`Uploading ${fileProg}%`}</span>
            ) : fileProg === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input onChange={handleChange} className='border rounded-lg p-2 ' type="text" placeholder='Username' id='username' defaultValue={currentUser.username} />
          <input onChange={handleChange} className='border rounded-lg p-2' type="email" name="email" id="email" placeholder='Email' defaultValue={currentUser.email} />
          <input onChange={handleChange} className='border rounded-lg p-2' type="password" name="password" id="password" placeholder='Password' />
          <button disabled={loading} className='flex items-center justify-center border rounded-xl p-2 bg-cyan-600 hover:opacity-90 disabled:opacity-60'>



            {loading ?
              <p className='flex items-center justify-center'>
                <svg aria-hidden="true" role="status" className="inline  w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                Updating...
              </p>
              :
              'Update'
            }
          </button>
        </form>

        <div className='flex justify-between mt-4 text-red-500'>
          <button onClick={handleDelete}>Delete Account</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>



        <p onClick={handleShowListings} className='text-center text-cyan-600 cursor-pointer' role='alert'>
          show listing</p>

      </div>


      {errorDeletingListing &&
        <p className='text-red-700 text-center bg-red-100 py-2 max-w-5xl mx-auto border border-red-600 rounded-xl'>{errorDeletingListing}</p>}
      <div className='flex flex-col flex-wrap gap-6 place-content-center m-4'>

        {listingData && openListing &&
          listingData.map((item, index) => (
            <div key={item._id} className='cursor-pointer flex sm:max-w-3xl bg-sky-50 overflow-auto text-xs sm:text-sm sm:gap-5 gap-2 rounded-lg border-sky-200 border-2'>
              <img className='w-32 sm:w-40 md:w-56 border rounded-md' src={item?.imageUrls[0]} alt="" />
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
    </>
  )
}

export default Profile;