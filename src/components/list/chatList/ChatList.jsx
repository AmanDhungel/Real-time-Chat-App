import React, { useEffect, useState } from 'react'
import './chatlist.css'
import AddUser from './addUser/AddUser'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase.js';
import { useUserStore } from '../../../lib/userStore.js';
import { useChatStore } from '../../../lib/chatStore.js';
import { toast } from 'react-toastify';

const ChatList = () => {

  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false)
  const [search, setSearch] = useState('');
  const { currentUser } = useUserStore()
  const { chatId, changeChat } = useChatStore()

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "usersChats", currentUser.id), async (res) => {
      const items = res.data()?.chats;
      
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.recieverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      const chatData = await Promise.all(promises)

      setChats(chatData.sort((a, b) => a.updatedAt - b.updatedAt));
    })
    return () => {
      unSub()
    }
  }, [currentUser.id])

  const handleSelect = async (chat) => {

    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "usersChats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)

    } catch (error) {
      console.log(error)
      toast.warn(error.message)
    }
  }

  const filteredChats = chats.filter(c =>
    c.user && c.user.username && c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder='Search here'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className='add' onClick={() => setAddMode(!addMode)} />
      </div>
      {filteredChats.length > 0 ? (
        filteredChats.map(chat => (
          <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
            <img src={chat.user.avatar || "./avatar.png"} alt="" />
            <div className="texts">
              <span>{chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList
