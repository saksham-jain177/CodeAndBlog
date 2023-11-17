import React, { useEffect, useState } from 'react';
import authService from '../../appwrite/auth'
import {Link ,useNavigate,NavLink} from 'react-router-dom'
import {login} from '../../store/authSlice'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import LoadingBar from 'react-top-loading-bar'


export default function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const {register, handleSubmit} = useForm()

  const create = async(data) => {
    setError("")
    try {
        const userData = await authService.createAccount(data);
        if (userData) {
            const userData = await authService.getCurrentUser();
            if(userData) dispatch(login(userData));
            navigate("/");
        }
    } catch (error) {
        setError(error.message);
    }
}


// top Loader
const [isContentLoaded, setContentLoaded] = useState(false);
const [progress, setProgress] = useState(0);
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setContentLoaded(true);
  }, 2000);

  const intervalId = setInterval(() => {
    setProgress((prevProgress) => {
      const randomIncrement = Math.floor(Math.random() * 50) + 1;
      const newProgress = Math.min(prevProgress + randomIncrement, 100);
      return newProgress;
    });
  }, 300);

  // Clean up the timeout and interval when the component unmounts
  return () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };
}, []);

  return (
    <div>
    {isContentLoaded ? (
    <div className="flex items-center justify-center bg-gray-100 m-5 p-5">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(create)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 text-sm font-medium mb-2">
             Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-400"
              placeholder="Name"
              required
              {...register("name", {
                required: true,
            })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus-border-blue-400"
              placeholder="Email"
              required
              {...register("email", {
                required: true,
                validate: {
                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                }
            })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus-border-blue-400"
              placeholder="Password"
              required
              {...register("password", {
                required: true,})}
            />
          </div>
          <div className="mb-4">
            <button type="submit"  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Sign Up</button>
          </div>
        </form>
          
        <p className="text-center text-gray-600 text-sm"> Have an account? <NavLink className="text-indigo-500" to='/login'>Login</NavLink> </p>
      </div>
    </div>
    ) : (<LoadingBar color='#ff7c05' progress={progress} height = {3} onLoaderFinished={() => setProgress(0)}/>)}

{!isContentLoaded && <p className="text-center text-gray-500 mt-5 absolute top-[40%]">Loading...</p>}
    </div>
  );
}
