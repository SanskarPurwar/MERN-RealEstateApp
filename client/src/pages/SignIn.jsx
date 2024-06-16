import React, { useState } from 'react';
import { Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart , signInFailure, signInSuccess} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = async (e) => {
    setFormData((formData)=>{
      return {
        ...formData,
        [e.target.id]:e.target.value
      }
    } )
  }
  console.log(formData)


  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        dispatch(signInStart());
        const res = await fetch('/api/auth/sign-in' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success === false){
          dispatch(signInFailure(data.message));
          return;
        }
        dispatch(signInSuccess(data));
        navigate('/');
        console.log(data);
      } catch (error) {
        dispatch(signInFailure(error.message))
      }
  }

  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-2xl font-semibold my-8'>Sign In</h1>
      <form className='flex flex-col gap-3'>
        <input onChange={handleChange} className='border rounded-lg p-2' type="text" placeholder='Username or Email' id='username' />
        <input onChange={handleChange} className='border rounded-lg p-2' type="password" placeholder='Password' id='password' />
        <input onChange={handleChange} className='border rounded-lg p-2' type="password" placeholder='Confirm Password' id='confirmPassword' />
        <button disabled={loading} onClick={handleSubmit} className='border rounded-lg bg-red-500 hover:opacity-90 p-2 disabled:opacity-65'>{loading?'loading..':'SignIn'}</button>
        <OAuth/>
      </form>

      <div className='flex gap-4 my-4'>
        <p>
          don't have an account?
        </p>
        <Link to={"/sign-up"}>
          <span className='text-blue-600'> Sign Up </span>
        </Link>
      </div>
       {error && <p className='text-red-500'>{error}</p> }
    </div>
  )
}

export default SignIn;