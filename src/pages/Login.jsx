import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo5.svg";
import './RegCss.css';
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { loginRoute } from "../utils/APIRoutes";
// import {}
// import styled from 'styled-components';
function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      //console.log('invalidation',loginRoute)
      const { password, username, } = values;
      //api

      // const {data} =  await axios.post(loginRoute,{
      //   username, email,password
      // });
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username, password
        });
        if (response === false) {
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

        if (error.response && error.response.data && error.response.data.msg) {
          toast.error(error.response.data.msg, toastOptions); // Display backend error message
        } 
        return false;

      }

    };

  }
  const handleValidation = () => {
    const { password, username, } = values;

    if (password === "" | username.length === "" | username === "") {
      toast.error("Username and password are required",
        toastOptions); return false;

    }
    // if () {

    //   toast.error("Email and password are required",
    //     toastOptions); return false;

    // }

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
          <input type="text" placeholder='username' name='username' onChange={e => handleChange(e)} min={3} />

          <input type="password" placeholder='password' name='password' onChange={e => handleChange(e)} />

          <button type='submit'>Login</button>

          <span>  Don't have Account ? <Link to="/register">Register</Link></span>


        </form>
      </div>
      {/* <ToastConatianer/> */}
      <ToastContainer />
    </>
  )
};




export default Login