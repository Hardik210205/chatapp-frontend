import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo5.svg";
import './RegCss.css';
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { registerRoute } from "../utils/APIRoutes";
// import {}
// import styled from 'styled-components';
function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }
   useEffect(() => {
      if (localStorage.getItem('chat_app_pro',)) {
        navigate('/')
      }
    }, []);
  const handleSubmit = async(event) => {
    event.preventDefault();
   if( handleValidation()){
    //console.log('invalidation',registerRoute)
    const {email,password , username,confirmPassword, } = values;
    //api
    
    // const {data} =  await axios.post(registerRoute,{
    //   username, email,password
    // });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register',{
           username, email,password
    });
    if (response===false){
      toast.error(response.msg, toastOptions);
    }
    if (response.data && response.data.user) {
      localStorage.setItem('chat_app_pro', JSON.stringify(response.data.user))
      navigate("/");
    }


      console.log(response.data); // handle response
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        console.error('Error response:', error.response);
      } else if (error.request) {
        // No response was received
        console.error('Error request:', error.request);
      } else {
        // Something else caused the error
        console.error('General error:', error.message);
      }
    }

   };

  }
  const handleValidation = () => {
    const {email,password , username,confirmPassword, } = values;
  
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Password and confirm password should be the same",
        toastOptions  );
      return false;
    }
   if (username.length < 4) {
 
        toast.error("Username should have more than 4 chartacters",
          toastOptions); return false;

    }
   if (password.length < 8) {

        toast.error("password should have atleast 8 chartacters",
          toastOptions);
        return false;

    }
    if (email === "") {
 
        toast.error("email is required",
          toastOptions);
        return false;
        }
        return true;

  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  return (
    <>

      <div className="form-container">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='appname'>
            <div className='logo'>
              <img src={Logo} width={170} height={100} alt="logo" />
              <h1>Flutterfly</h1>
            </div>
          </div>
          <input type="text" placeholder='username' name='username' onChange={e => handleChange(e)} />

          <input type="email" placeholder='Email' name='email' onChange={e => handleChange(e)} />

          <input type="password" placeholder='password' name='password' onChange={e => handleChange(e)} />

          <input type="password" placeholder='Conform Password' name='confirmPassword' onChange={e => handleChange(e)} />

          <button type='submit'>Create User</button>

          <span>  Already have Account ? <Link to="/Login">Login</Link></span>


        </form>
      </div>
      {/* <ToastConatianer/> */}
      <ToastContainer />
    </>
  )
};


export default Register