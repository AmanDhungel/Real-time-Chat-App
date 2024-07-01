import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { Firestore, arrayUnion, doc, getDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore.js';
import { toast } from 'react-toastify';
import upload from '../../lib/upload.js';

const Chat = () => {
const [emoji, setEmoji] = useState(false);
const [inputs, setInputs] = useState("");
const [chat, setChat] = useState("");
const [img, setImg] = useState({
  file: null,
  url: "",
});

const endRef = useRef(null)
const { chatId, user} = useChatStore()
const { currentUser} = useUserStore()

useEffect(()=> {
  const unSub = onSnapshot(doc(db, "chats", chatId), (res)=> {
    setChat(res.data())

  })

  return ()=> {
    return unSub()
  }
}, [chatId])

  
const handleEmoji = (e) => {
 setInputs(prev=> prev + e.emoji)
 setEmoji(false);
}

const handleImage = (e) => {
  console.log(e.target.files[0])
  if(e.target){
      setImg({
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0])
      })
      
  }
 }


const handleSend = async () => {
  if (inputs.trim() === "") {
    return;
  }

  let imgUrl = null;

  try {

    if(img.file){
      imgUrl = await upload(img.file)
    }

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: currentUser.id,
        text: inputs,
        createdAt: Timestamp.now(),
        ...(imgUrl && {img: imgUrl})
      })
    });

    const userIDs = [currentUser.id, user.id];

    userIDs.forEach(async (id) => {
      const userChatsRef = doc(db, "usersChats", id);
      const userChatsSnapShot = await getDoc(userChatsRef);

      if (userChatsSnapShot.exists()) {
        const userChatsData = userChatsSnapShot.data();

        const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = inputs;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Timestamp.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          });
        }
      }
    });

    setInputs(""); // Clear the input after sending the message

  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }

  setImg({
    file: null,
    url: "",

  })

  setChat("");

};



  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>aman</span>
            <p>Yeah thats good</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Yeah thats good</p>
            <span>1 min ago</span>
          </div>
        </div>
        {
  chat.messages && chat.messages.map((message) => (
    <div className={message.senderId === currentUser?.id ? 'message own' : "message"} key={`${message.id}-${message.createdAt}`}>
      <div className="texts">
        {message.img && <img src={message.img} alt="" />}
        <p>{message.text}</p>
      </div>
    </div>
  ))
}

{img.url && <div className="message own">
  <div className="texts">
    <img src={img.url} alt="" />
  </div>
</div>}

       
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
          <img src="./img.png" alt="" />
          </label>
          <input type="file" name="" id="file" style={{display: "none"}} onChange={handleImage}/>
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <div className='emoji'>
          <input type="text" placeholder='Message...' 
          value={inputs}
          onChange={e=>setInputs(e.target.value)}/>
          <img src="./emoji.png" alt="" onClick={()=>setEmoji(!emoji)} />
          <div className="picker">
          {emoji && <EmojiPicker onEmojiClick={handleEmoji}/>} 
          </div>
          </div>
        <button className='sendButton' onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Chat