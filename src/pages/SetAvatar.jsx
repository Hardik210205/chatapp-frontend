import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import './RegCss.css';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { SetAvatarRoute } from "../utils/APIRoutes";
import styled from 'styled-components';
import { Buffer } from 'buffer'; // Corrected Buffer import

 function SetAvatar() {
    const api = "https://avatar.iran.liara.run/public";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]); // Corrected state function name
    const [isLoading, setIsLoading] = useState(true); // Corrected state function name
    const [selected, setSelected] = useState(undefined); // Corrected state function name

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    useEffect(() => {
        const checkAuth = async () => {
          const userData = localStorage.getItem('chat_app_pro');
          if (!userData) {
            navigate("/login");
          }
        };
        checkAuth();
      }, [navigate]);



    useEffect(() => {
        const fetchAvatars = async () => {
         
            const data = [];
            for (let i = 0; i < 4; i++) {
                // try {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 100)}`,
                    { responseType: 'arraybuffer' }
                );
                const buffer = Buffer.from(image.data, 'binary').toString('base64'); // Corrected Buffer usage
                data.push(buffer);
                // } catch (error) {
                //     console.error("Error fetching avatar:", error);
                // }
            }
            setAvatars(data); // Corrected state function name
            setIsLoading(false); // Corrected state function name
        };

        fetchAvatars();
    }, []);

    const handleSubmit = async () => {
        if (selected === undefined) {
            toast.error("Please select an avatar", toastOptions);
            return;
        }
        else{
            const user  = await JSON.parse(localStorage.getItem("chat_app_pro"))
            console.log(`${SetAvatarRoute}/${user._id}`);
            if (!user || !user._id) {
                toast.error("User data is invalid or missing", toastOptions);
                return;
            }
            // console.log(avatars[selected]);
            const data = await axios.post(`${SetAvatarRoute}/${user._id}`,{
                image: avatars[selected],
            });

            if (data.data.isSet) {
                user.isAvtarImageSet = true;
                user.AvtarImage = data.data.image;
                localStorage.setItem("chat_app_pro",JSON.stringify(user));
                navigate("/")
            }
           else{
                    toast.error("Failed to set Avatar, Please try agian", toastOptions);
           }
        }
    
    }

    return (
        <>
                   { isLoading ? (<Container>

                        <img src={loader} alt="loader" className="loader" />
                    </Container>
                    ) :(
                        <Container>
                <div className="title-container">
                    <h1>Choose Your Avatar as Profile Picture</h1>
                </div>
                <div className="avatars">
                    {
                        (
                            avatars.map((avatar, index) => (
                                <div
                                key={index}
                                className={`avatar ${selected === index ? "selected" : ""}`}
                                >
                                    <img
                                        src={`data:image/png;base64,${avatar}`} // Corrected image type
                                        alt="avatar"
                                        onClick={() => setSelected(index)} // Corrected state function name
                                    />
                                </div>
                            ))
                        )}
                </div>
                <button className='submit-btn' onClick={handleSubmit}>Set as Profile Pic</button>
            </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
background-size: 400% 400%;
animation: gradientShift 15s ease infinite;
height: 100vh;
position: relative;
overflow: hidden;

&::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.loader{
  max-inline-size: 100%;
  filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
  z-index: 1;
}

.title-container {
  position: relative;
  z-index: 1;
  h1{
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
    margin: 0;
  }
}

.avatars{
  display: flex;
  gap: 2rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar{
  border: 0.4rem solid transparent;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;   
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  img{
    height: 6rem;
    width: 6rem;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease;
  }
}

.submit-btn{
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  z-index: 1;
  
  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
  }
}

.selected{
  border: 0.4rem solid rgba(102, 126, 234, 0.8);
  background: rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  transform: scale(1.15);
  
  img {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.6);
  }
}
`;


export default SetAvatar