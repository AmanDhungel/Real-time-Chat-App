import React, { useState } from 'react'
import "./login.css";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase.js';
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import upload from '../../lib/upload.js';

const Login = () => {

  const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })

    const handleLogin=  async(e) => {
      e.preventDefault();
      setLoading(true);
      console.log("login")
      const formData = new FormData(e.target);
      const {email, password} = Object.fromEntries(formData);

      try {
        const loginRes = await signInWithEmailAndPassword(auth, email, password)
        console.log(loginRes);
        toast.success("Login Successful");
      } catch (error) {
      toast.error(error.message);
      }finally{
        setLoading(false);
      }
}

    const handleRegister = async(e) => {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target);

      const {username, email, password} = Object.fromEntries(formData);
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        console.log(res.user.uid);

        const imgUrl = await upload(avatar.file);

        const docRef = await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: []
        });
         
        await setDoc(doc(db, "usersChats", res.user.uid), {
      chats: []
        });

       

        toast.success("Account Created Can Login Now!");
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
      console.log(username, email, password)
    }

   const handleAvatar = (e) => {
    console.log(e.target.files[0])
    if(e.target){
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
        
    }
   }

  return (
<div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form 
        onSubmit={handleLogin}
        >
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button 
          disabled={loading}>{loading ? "Loading" : "Sign In"}
        </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form 
        onSubmit={handleRegister}
        >
          <label htmlFor="file">
            <img src={
                avatar.url ||
                 "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button
           disabled={loading}>{loading ? "Loading" : "Sign Up"}
           </button>
        </form>
      </div>
    </div>
  )
}

export default Login