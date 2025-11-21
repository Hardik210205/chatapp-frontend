import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import {BiPowerOff} from 'react-icons/bi';
export default function Logout() {
    const navigate = useNavigate();
    const handleClick = async () => {
        localStorage.clear();
        navigate("/login");
    }
    return (

        <Button>
            <BiPowerOff onClick={handleClick}
            
            />
        </Button>
  )
}
const Button = styled.button `
display: flex;
justify-content: center;
align-items: center;
width: 2.8rem;
height: 2.8rem;
min-width: 2.8rem;
min-height: 2.8rem;
padding: 0;
border-radius: 50%;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border: 1px solid rgba(255, 255, 255, 0.2);
cursor: pointer;
margin-left: auto;
transition: all 0.3s ease;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
flex-shrink: 0;

&:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

&:active {
    transform: scale(0.95) rotate(90deg);
}

svg{
    font-size: 1.4rem;
    color: #ffffff;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}
`;