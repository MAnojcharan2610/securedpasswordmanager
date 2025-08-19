import { initializeApp } from "firebase/app";
import { getAuth,
        GoogleAuthProvider,
        signInWithPopup,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        deleteUser,signOut
        } from "firebase/auth";
import { getDatabase,ref,get,set } from "firebase/database";
import { hashPassword } from "../helpers/hash";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const realtimeDb = getDatabase(app);


export const signInWithGooglePopup =async()=>{
    try{
        const result = await signInWithPopup(auth,provider);
        const user = result.user;
        const userRef = ref(realtimeDb,`users/${user.uid}`);
        const snapshot = await get(userRef);
        if(!snapshot.exists()){
            const saltArray = crypto.getRandomValues(new Uint8Array(16));
            const salt = Array.from(saltArray).map(b=>b.toString(16).padStart(2,'0')).join('');
            await set(userRef,{
                email:user.email,
                name:user.displayName || "Anonymous",
                password:'google popup',
                passwordsCount:0,
                favouritesCount:0,
                isAccessMethodsConfigured:false,
                hasMasterPassword:false,
                salt:salt,
                subscriptionPlan:'free'
            })
            return true;
        }
        return false;
    }catch(e){
        console.error('error while signing in with google popup',e)
    }
}

export const createUserFromEmailAndPassword =async(email,password,name)=>{
  try{
      const result = await createUserWithEmailAndPassword(auth,email,password);
      const userRef = ref(realtimeDb,`users/${result.user.uid}`);
      const snapshot = await get(userRef);
      if(snapshot.exists()){
          throw new Error("User already exists in Database");
      }
      const hashedPassword = await hashPassword(password);
      const saltArray = crypto.getRandomValues(new Uint8Array(16));
      const salt = Array.from(saltArray).map(b=>b.toString(16).padStart(2,'0')).join('');
      await set(userRef,{
          email:email,
          name:name,
          password:hashedPassword,
          passwordsCount:0,
          favouritesCount:0,
          isAccessMethodsConfigured:false,
          hasMasterPassword:true,
          salt:salt,
          subscriptionPlan:'free'
      })
  }catch(e){
      if (e.code === 'auth/email-already-in-use') {
          return "Email already in use. Please use a different email.";
        }
        if(e.message !== "User already exists in Database"){
          console.error("Error while creating user or setting data",e);
          const user = auth.currentUser;
          if(user){
              await deleteUser(user)
              console.log("User deleted from Auth due to Firestore error");
          }
        }
      console.error('error while creating user with email and password',e)
  }
}

export const signInUserWithEmailAndPassword =async(email,password)=>{
  try{
      await signInWithEmailAndPassword(auth,email,password);
  }catch(e){
      if(e.code ==='auth/invalid-credential'){
          return "invalid credential"
      }
      console.error('error while signing user with email and password',e)
  }
}
export const signOutUser=async()=>{
    try{
        await signOut(auth);
    }catch(e){
        console.error('error signing out user',e);
    }
}