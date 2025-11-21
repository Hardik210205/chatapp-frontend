import React,{useState, useRef, useEffect} from 'react';
import {IoMdSend} from 'react-icons/io';
import {BsEmojiSmileFill} from 'react-icons/bs';
import {BsImage} from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import styled from 'styled-components';


export default function ChatInput({handleSendMsg}) {
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const [msg,setmsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  const handleEmojiPickerHideShow = () => {
    setshowEmojiPicker(!showEmojiPicker);
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setshowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Auto send image when selected
      handleSendMsg(null, file);
      setSelectedImage(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sendChat = (event)=> {
   event.preventDefault();
   if(msg.length > 0) {
    handleSendMsg(msg, null);
    setmsg('');
  }
}
  return (
    

    <Container>

    <div className="button-container">
        <div className="emoji" ref={emojiPickerRef}>
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
            {
              showEmojiPicker && (
                <div className="emoji-picker-wrapper">
                  <Picker
                    theme='dark' 
                    className="custom-emoji-picker" 
                    onEmojiClick={(emoji)=>{
                      setmsg((prevMsg)=> prevMsg + emoji.emoji);
                      setshowEmojiPicker(false);
                    }}
                  />
                </div>
              )
            }
        </div>
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            id="image-upload-input"
          />
          <label htmlFor="image-upload-input">
            <BsImage />
          </label>
        </div>
    </div>        
            <form className='input-container' onSubmit={(e)=>
              sendChat(e)
            } >
                <input type="text" placeholder='Message' value={msg} onChange={(e)=>setmsg(e.target.value)}/>
                <button type="button" className='submit'
                onClick={sendChat} >
                <IoMdSend/>
                </button>
            </form>
    </Container>
  )
}


const styledPicker = styled(Picker);
const Container = styled.div`
display: flex;
align-items: center;
gap: 1rem;
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border-top: 1px solid rgba(255, 255, 255, 0.1);
padding: 1rem 2rem;
box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

@media screen and (min-width:720px) and (max-width:1080px)
{
  padding: 0.8rem 1rem;
  gap: 0.8rem;              
}

.button-container{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    }
  .emoji {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: rgba(255, 215, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 215, 0, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
    z-index: 10;
    
    svg {
      font-size: 1.4rem;
      color: #ffd700;
      transition: all 0.3s ease;
    }
    
    &:hover {
      background: rgba(255, 215, 0, 0.25);
      border-color: rgba(255, 215, 0, 0.5);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
      
      svg {
        transform: rotate(15deg);
      }
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    .emoji-picker-wrapper {
      position: absolute;
      bottom: calc(100% + 10px);
      left: 0;
      z-index: 1000;
      
      :global(.custom-emoji-picker) {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
      }
    }
  }
  
  .image-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: rgba(79, 172, 254, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(79, 172, 254, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
    
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      margin: 0;
    }
    
    svg {
      font-size: 1.4rem;
      color: #4facfe;
      transition: all 0.3s ease;
    }
    
    &:hover {
      background: rgba(79, 172, 254, 0.25);
      border-color: rgba(79, 172, 254, 0.5);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  .input-container{
    flex: 1;
    display: flex;
    border-radius: 2rem;
    align-items: center;
    padding: 0.5rem 1rem;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    input{
      flex: 1;
      border: none;
      background-color: transparent;
      color: white;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &::selection{
        background-color: rgba(102, 126, 234, 0.5);
      }
      
      &:focus{
        outline: none;
      }
    }
    
    button.submit{
      padding: 0.6rem;
      min-width: 2.8rem;
      height: 2.8rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      flex-shrink: 0;
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      @media screen and (min-width:720px) and (max-width:1080px)
      {
        padding: 0.5rem;
        min-width: 2.5rem;
        height: 2.5rem;
        
        svg{
          font-size: 1.2rem;
        }
      }
      
      svg{
        font-size: 1.4rem;
        color: white;
      }
    }
  }

:global(.custom-emoji-picker) {
  background: rgba(30, 30, 40, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:global(.custom-emoji-picker .epr-body)::-webkit-scrollbar {
  width: 0.5rem;
}

:global(.custom-emoji-picker .epr-body)::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

:global(.custom-emoji-picker .epr-body)::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  
  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
}

    `;