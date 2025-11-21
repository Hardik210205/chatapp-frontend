import React, { useEffect, useRef, useState } from 'react'
import styled
  from 'styled-components'
import Logout from './Logout';
import ChatInput from './ChatInput';
// import Messages from './Message';
import axios from 'axios';
import { sendMessageRoutes, getAllMessageRoutes, host } from '../utils/APIRoutes';
import {v4 as uuidv4} from 'uuid';
import { BsDownload } from 'react-icons/bs';

export default function ChatContainer({ currentChat, currentUser , socket, contactsCount}) {
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [message, setMessage] = useState([]);
  const scrollRef = useRef();

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Compare dates (not time)
    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      // Show actual date: "Jan 15" or "Jan 15, 2023" if different year
      const options = { 
        month: 'short', 
        day: 'numeric'
      };
      if (date.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
      }
      return date.toLocaleDateString('en-US', options);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    return grouped;
  };

  const handleSendMsg = async (msg, imageFile) => {
    try {
      if (imageFile) {
        // Send image
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('from', currentUser._id);
        formData.append('to', currentChat._id);

        const response = await axios.post(sendMessageRoutes, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageFilename = response.data.data?.message?.image;
        
        socket.current.emit("send-msg", {
          from: currentUser._id,
          to: currentChat._id,
          image: imageFilename,
        });

        const msgs = [...message];
        msgs.push({fromSelf: true, message: null, image: imageFilename, timestamp: new Date()});
        setMessage(msgs);
      } else if (msg) {
        // Send text message
        await axios.post(sendMessageRoutes, {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });

        socket.current.emit("send-msg", {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });
        const msgs = [...message];
        msgs.push({fromSelf: true, message: msg, image: null, timestamp: new Date()});
        setMessage(msgs);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDownloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-recevie",(data)=>{
        setArrivalMessage({fromSelf: false, message: data.message || null, image: data.image || null, timestamp: new Date()})
      })}
  },[])

  useEffect(()=>{ 
    arrivalMessage && setMessage((prev)=>[...prev,
      arrivalMessage])
  },[arrivalMessage]);

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behaviour:"smooth"})
},[message]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?._id || !currentChat?._id) return; 
      try {
        const response = await axios.post(getAllMessageRoutes, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessage(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);



  return (
    <>
      {
        currentChat && (

          <Container>


            <div className="chat-header">
              <div className="user-details">


                <div className="avatar">
                  <img src={`data:image/png;base64,${currentChat.AvtarImage}`} // Corrected image type
                    alt="avatar"
                  />

                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>
                <Logout />
              </div>
            </div>
            {/* <Message  /> */}
            <div className="chat-messages">
              {
                Object.entries(groupMessagesByDate(message)).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="date-divider">
                      <span>{date}</span>
                    </div>
                    {dateMessages.map((msg, index) => (
                      <div ref={scrollRef} key={`${date}-${index}-${msg.timestamp}`}>
                        <div className={`message ${msg.fromSelf ? 'sended' : 'recevied'}`}>
                          <div className="content">
                            {msg.image ? (
                              <div className="image-container">
                                <img 
                                  src={`${host}/uploads/${msg.image}`} 
                                  alt="Sent" 
                                  className="message-image"
                                />
                                <button 
                                  className="download-btn"
                                  onClick={() => handleDownloadImage(`${host}/uploads/${msg.image}`, msg.image)}
                                  title="Download image"
                                >
                                  <BsDownload />
                                </button>
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                              </div>
                            ) : (
                              <>
                                <p>{msg.message}</p>
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
            <ChatInput
              handleSendMsg={handleSendMsg}

            />
          </Container>
        )
      }
    </>
  );
}


const Container = styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
background: rgba(255, 255, 255, 0.02);

  .chat-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .user-details{
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
  }
    .avatar{
      img{
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 50%;
      border: 2px solid rgba(102, 126, 234, 0.3);
      object-fit: cover;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
    }
      .username{
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
        h3{
        color: white;
        margin: 0;
        font-weight: 600;
        font-size: 1.3rem;
        }
      }

      .chat-messages{
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      overflow: auto;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.01);
      &::-webkit-scrollbar{
      width: 0.5rem;
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
      .message{
           display: flex;
           align-items: flex-end;
           margin-bottom: 0.5rem;
           animation: slideIn 0.3s ease-out;
         }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      }
      .date-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1.5rem 0;
        position: relative;
        
        &::before,
        &::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }
        
        span {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          font-weight: 500;
          margin: 0 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      }
      
      .content{
        max-width: 50%;
        overflow-wrap: break-word;
        padding: 0.8rem 1.2rem;
        margin: 0.3rem 0;
        font-size: 1rem;
        border-radius: 1.2rem;
        color: #ffffff;
        line-height: 1.5;
        word-break: break-word;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        
        p {
          color: #ffffff;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          font-weight: 400;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          align-self: flex-end;
          margin-top: 0.2rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        }
        .image-container {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          overflow: hidden;
          gap: 0.3rem;
          
          .message-image {
            max-width: 100%;
            max-height: 300px;
            border-radius: 0.8rem;
            display: block;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
            &:hover {
              transform: scale(1.02);
            }
          }
          
          .download-btn {
            position: absolute;
            top: 0.8rem;
            right: 0.8rem;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 2;
            &:hover {
              background: rgba(102, 126, 234, 0.8);
              transform: scale(1.1);
              box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
            }
            svg {
              font-size: 1.1rem;
            }
          }
          
          .message-time {
            align-self: flex-end;
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            padding: 0.2rem 0.5rem;
          }
        }

      .message.sended {
  justify-content: flex-end;
  .content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom-right-radius: 0.3rem;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    
    p {
      color: #ffffff;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    .message-time {
      color: rgba(255, 255, 255, 0.85);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }
}
        }
        .recevied{
          justify-content: flex-start;
        .content{
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-bottom-left-radius: 0.3rem;
        
        p {
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        
        .message-time {
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        }
        }
        @media screen and (min-width:720px) and (max-width:1080px)
  {
    grid-template-rows:15% 70% 15%;
    .content {
      max-width: 60%;
    }
  }


  `;