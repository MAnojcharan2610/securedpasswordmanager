import './user.styles.scss';
import { useState,useEffect } from 'react';
import {useUserAuthContext} from '../../contexts/user-auth.context';
import { FaUserAstronaut,FaUserLock,FaCircleInfo } from 'react-icons/fa6';
import { signOutUser } from '../../utils/firebase/firebase';
import { useToast } from '../../contexts/toast-context.context';
import {useKeyGenerationContext} from '../../contexts/key-generation.context';
import { useNavigate } from 'react-router-dom';
import { useDocsContext } from '../../contexts/docs.context';

const User = () => {
    const [isUserImgLoaded,setIsUserImgLoaded]=useState(false);
    const {user,handleSetIsAuthenticatedWithPassword,isAuthenticatedWithPassword}=useUserAuthContext();
    const {showToast}=useToast();
    const {handleSetUserKeys}=useKeyGenerationContext();
    const router = useNavigate();
    const {handleSetActiveStep}=useDocsContext();

    useEffect(()=>{
        const img = new Image();
        img.src = user?.photoURL;
        img.onload=()=>setIsUserImgLoaded(true);
    },[user?.photoURL]);

    const handleAccountLock=()=>{
        if(!isAuthenticatedWithPassword){
            showToast('Already in locked state',3000)
        }else{
            handleSetUserKeys(null)
            handleSetIsAuthenticatedWithPassword(false)
            showToast("security reset")
        }
    }
    const handleAccountLockInfo=()=>{
        router('/dashboard/public-information')
        setTimeout(()=>handleSetActiveStep(5),500)
    }
    return ( 
        <div className='user-div'>
            <h1>User space</h1>
            <div className='main'>
                {isUserImgLoaded ? <img src={user?.photoURL} alt='user' className='p-url' width={100} /> : <div  className='astro-user'><FaUserAstronaut/> </div>}
                <p>{user?.email}</p>
                <p>{user?.displayName || "Username"}</p>
                <button className='c-btn' onClick={signOutUser}> Sign Out</button>
                <div className='lock-app-div'>
                <button className='c-btn lock-app' onClick={handleAccountLock}> <FaUserLock/> Lock app  </button>
                <div className='info' onClick={handleAccountLockInfo}>
                    <FaCircleInfo/>
                </div>
                </div>
            </div>
        </div>
     );
}
 
export default User;