import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
 fetchUserInfo: async (uid) => {
    if(!uid) return set({currentUser: null, isLoading: false})

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    set({currentUser: docSnap.data(), isLoading: false});
//   console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  set({currentUser: null, isLoading: false});
  console.log("No such document!");
}
        } catch (error) {
            console.log(error )
            return set({currentUser: null, isLoading: false})
        }
 }
}))