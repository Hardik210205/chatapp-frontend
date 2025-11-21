import React from 'react'
import styled from 'styled-components';
import Robot from '../assets/robot.gif';


export default function Welcome({currentUser}) {
  return (
    <Container>
        <img src={Robot} alt="Robot" />
        <h1>Welcome,
              <span>
        <h1>{currentUser.username}!</h1>
            </span>
        </h1>
        <h3>Realtime Chatting with Flutterfly !! </h3>
    
    </Container>

      )
}
const Container  = styled.div `
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
gap: 2rem;
padding: 2rem;
text-align: center;
height: 100%;
background: rgba(255, 255, 255, 0.02);

img{
    height: 20rem;
    filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.5));
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
}

h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 3s ease infinite;
    background-size: 200% 200%;
}

@keyframes gradientText {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

span{
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}

h3 {
    font-size: 1.3rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-style: italic;
}
`;