import React,{useState, useEffect} from 'react'
import styled from 'styled-components';
import Logo from "../assets/logo5.svg";
export default function Contacts({contacts,currentUser,changeChat}) {
  
  const [currentUsername, setCurrentUsername] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
 const [selectedcurrentUser, setSelectedCurrentUser] = useState(undefined);
 
  useEffect(() => {

    if(currentUser)
    {
      setCurrentUserImage(currentUser.AvtarImage);
      setCurrentUsername(currentUser.username);
    } 
    
  },[currentUser])   
  
  const changeCurrentChat = (index, contacts) =>{
    setSelectedCurrentUser(index);
    changeChat(contacts);
    }
  // console.log(contacts);
  return (
    <>
  {
    currentUsername && currentUserImage &&(
      <Container>
        
        <div className="brand">
          <img src={Logo} alt="logo"  />
          <h3>FlutterFly</h3>

        
        </div>

        <div className="contacts">
          {contacts.map((contact, index) => {
            return(
   
              
              
              <div className={`contact
                ${index === selectedcurrentUser ?"selected": ""}`} key={index}
                onClick={()=>changeCurrentChat(index, contact)}
                >

                <div className="avatar">
                  <img src={`data:image/png;base64,${contact.AvtarImage}`} // Corrected image type
                                        alt="avatar" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
                </div>
                )
            
          })
          }



        </div>


        <div className="current-user">
        <div className="avatar">

                  <img src={`data:image/png;base64,${currentUserImage}`} // Corrected image type
                                        alt="avatar" />
                </div>
                <div className="username">
                  <h2>{currentUsername}</h2>
                </div>

        </div>
      </Container>
    )
  }
  
  </>
  )
}

const Container =  styled.div `
display: grid;
grid-template-rows : 10% 75% 15%;
overflow: hidden;
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(10px);
border-right: 1px solid rgba(255, 255, 255, 0.1);

.brand{
 display: flex;
 align-items: center;
 justify-content : center;
 gap: 1rem;
 padding: 1rem;
 border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  img{
    height: 3rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1) rotate(5deg);
    }
  }
 h3{
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  }
}
  .contacts{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap : 0.8rem;
    padding: 1rem 0;
    &::-webkit-scrollbar{
    width: 0.4rem;
    }
    &::-webkit-scrollbar-track{
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb{
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
    }
    }
    .contact{
      display:flex;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      align-items:center;
      min-height : 5rem;
      width : 90%;
      cursor: pointer;
      border-radius: 1rem;
      padding: 0.8rem;
      gap: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }
      }
      .selected{
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
        border: 1px solid rgba(102, 126, 234, 0.5);
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        transform: translateX(5px);
      }   
      .avatar{ 
        position: relative;
        img{
          height: 3.5rem;
          width: 3.5rem;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          object-fit: cover;
          transition: all 0.3s ease;
          }
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.1);
          }
          }    
          .username{
            h3{
              color: white;
              font-weight: 500;
              font-size: 1.1rem;
              margin: 0;
              }
              }
          .current-user{
            background: rgba(102, 126, 234, 0.1);
            backdrop-filter: blur(10px);
            display : flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            
            .avatar {
              img{
              height: 3.5rem;
              width: 3.5rem;
              border-radius: 50%;
              border: 2px solid rgba(102, 126, 234, 0.5);
              object-fit: cover;
              box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
              }
          }    
            .username{
            h2{
            color: white;
            font-weight: 600;
            font-size: 1.2rem;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            }
            }     
      }

      
  @media screen and (min-width:720px) and (max-width:1080px)
{
  gap:0.5rem;
  .username{
    h3{
      font-size: 1rem;
    }
  }
}

}
            `;