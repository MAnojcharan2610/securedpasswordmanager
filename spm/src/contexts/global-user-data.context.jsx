import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import {realtimeDb,auth} from '../utils/firebase/firebase';
import { onValue, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const GlobalUserDataContext = createContext();

export const GlobalUserDataProvider=({children})=>{

    const [userData,setUserData]=useState({});
    const [userDataState,setUserDataState]=useState('loading'); //loading,error,empty

    useEffect(()=>{
        let unsubscribeFromDb=null;
        const fetchUserData=async(user)=>{
            try{
                const userRef = ref(realtimeDb,`users/${user.uid}`);
                unsubscribeFromDb=onValue(userRef,(snapshot)=>{
                    if(snapshot.exists()){
                        setUserData(snapshot.val())
                        setUserDataState('');
                    }else{
                        setUserData({});
                        setUserDataState('empty')
                    }
                })
            }catch(e){
                console.error(e,"error fetching user data");
                setUserDataState('error')
            }
        }
        const unsubscribe =onAuthStateChanged(auth,(user)=>{
            if(user){
                fetchUserData(user)
            }
        })
        return ()=>{
            unsubscribe();
            if(unsubscribeFromDb) unsubscribeFromDb();
        }
    },[])

    return(
        <GlobalUserDataContext.Provider value={{userData,userDataState}}>{children}</GlobalUserDataContext.Provider>
    )
}
GlobalUserDataProvider.propTypes={
    children:PropTypes.node,
}
export const useGlobalUserDataContext =()=>useContext(GlobalUserDataContext);