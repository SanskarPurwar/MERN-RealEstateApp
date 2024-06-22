import React, { useState } from 'react'
import { Link,useNavigate } from "react-router-dom"
import OAuth from '../components/OAuth';

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState(null);
  const navigate = useNavigate();

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
        setLoading(true);
        const res = await fetch('/api/auth/sign-up' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success === false){
          setError(data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/sign-in');
        console.log(data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
  }

  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-2xl font-semibold my-8'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input onChange={handleChange} className='border rounded-lg p-2' type="text" placeholder='Username' id='username' />
        <input onChange={handleChange} className='border rounded-lg p-2' type="email" placeholder='Email' id='email' />
        <input onChange={handleChange} className='border rounded-lg p-2' type="password" placeholder='Password' id='password' />
        <button disabled={loading} className='border rounded-lg bg-red-500 hover:opacity-90 p-2 disabled:opacity-65'>{loading?'loading..':'SignUp'}</button>
        <OAuth/>
      </form>

      <div className='flex gap-4 my-4'>
        <p>
          Have an account?
        </p>
        <Link to={"/sign-in"}>
          <span className='text-blue-600'> Sign in </span>
        </Link>
      </div>
       {error && <p className='text-red-500'>{error}</p> }
    </div>
  )
}

export default SignUp;