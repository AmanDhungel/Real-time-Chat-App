import React from 'react'
import './detail.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {

  const { chatId,
    user,
    isCurrentUserBlocked,
    isRecieverBlocked,
   changeChat,
   changeBlock
   }
   = useChatStore();


  console.log(user);


   const { currentUser } = useUserStore();



  const handleBlock = async() => {
  if(!user) return;

  const userDocRef = doc(db, "users", currentUser.id);

try {
  await updateDoc(userDocRef, {
    blocked: isRecieverBlocked ? arrayRemove(user.id): arrayUnion(user.id),
     
  })
  changeBlock();
} catch (error) {
  console.log(error)
}
  }

  return (
    <div className='detail'>
     <div className="user">
      <img src={user?.avatar || "./avatar.png"} alt="" />
      <h2>{user?.username}</h2>
      <p>Web Developer</p>
     </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <div className="photos">
          <div className="photoItem">
            <div className="photoDetail">
            <img src="https://images.pexels.com/photos/21293020/pexels-photo-21293020/free-photo-of-potted-plants-on-either-side-of-an-old-wooden-door.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load" alt="" />
            <span>photothis.png</span>
            </div>
          <img src="./download.png" className='icon' alt="" />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
            <img src="https://images.pexels.com/photos/21293020/pexels-photo-21293020/free-photo-of-potted-plants-on-either-side-of-an-old-wooden-door.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load" alt="" />
            <span>photothis.png</span>
            </div>
          <img src="./download.png" className='icon' alt="" />
          </div>
          <div className="photoItem">
            <div className="photoDetail">
            <img src="https://images.pexels.com/photos/21293020/pexels-photo-21293020/free-photo-of-potted-plants-on-either-side-of-an-old-wooden-door.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load" alt="" />
            <span>photothis.png</span>
            </div>
          <img src="./download.png" className='icon' alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowup.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are BLocked!": isRecieverBlocked ? " User blocked" : "Block User" }</button>
        <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
      </div>
  )
}

export default Detail