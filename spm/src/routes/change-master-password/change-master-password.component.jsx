import './change-master-password.styles.scss'
import PasswordCheckList from '../../components/password-checklist/password-checklist.component'
import { FaBullseye } from 'react-icons/fa6';
import { useState } from 'react';
import SubmitButton from '../../components/submit-button/submit-button.component';
import {useToast} from '../../contexts/toast-context.context';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import { compareHashPassword, hashPassword } from '../../utils/helpers/hash';
import { VscServerProcess } from "react-icons/vsc";
import { useGlobalDataContext } from '../../contexts/global-data.context';
import AsyncLoader from '../../components/async-loader/async-loader.component';
import PasswordChangeValidator from '../../components/password-change-validator/password-change-validator.component';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import {handleKeySelectionAndDecryptionProcess, handleKeySelectionAndEncryptionProcess} from '../../utils/helpers/globalFunctions';
import { ref, update } from 'firebase/database';
import { realtimeDb } from '../../utils/firebase/firebase';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';


const stateText={
    "loading":"Getting things ready",
    "error":"Error occured! Try again later",
}

const ChangeMasterPassword = () => {

    const [passType,setPassType]=useState('password');
    const [oldPassword,setOldPassword]=useState('');
    const [checkOldPassword,setCheckOldPassword]=useState('');
    const [newPassword,setNewPassword]=useState({t1:'',t2:''});
    const [isButtonDisabled,setIsButtonDisabled]=useState(true);
    const {userData}=useGlobalUserDataContext();
    const {showToast} = useToast();
    const {globalPasswordData,passwordsState}=useGlobalDataContext();
    const [stepIndex,setStepIndex]=useState(0);
    const [isValidatorOpen,setIsValidatorOpen]=useState(false);
    const {handleSetIsAuthenticatedWithPassword,user,isAuthenticatedWithPassword}=useUserAuthContext();
    const {generateKeysFromPassword,handleSetUserKeys}=useKeyGenerationContext();
    
    const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }
    const handleCheckOldPassword=async()=>{
        let password = oldPassword?.trim();
        if(password==='') return;
         if(userData?.password){
            const result = await compareHashPassword(password,userData?.password)
            if(result === "error"){
                showToast('Error occured try again later.');
                return;
            }
            if(result === "unmatch"){
                showToast('Incorrect password try again.')
                return;
            }
            if(result === "match"){
                showToast('Password verified successfully')
                setIsButtonDisabled(false);
                setCheckOldPassword(password);
            }
        }
    }
    const handleKeyUpOldPasswordInput=(key)=>{
        if(key==='Enter'){
            handleCheckOldPassword()
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        let newPassword1 = newPassword.t1.trim()
        let newPassword2 = newPassword.t2.trim()
        if(!newPassword1 || !newPassword2){
            showToast('Missing input values.');
             return;
        }
        if(newPassword1 !== newPassword2){
            showToast('Unmatched passwords, try again.')
            return;
        }
        if(newPassword1 === checkOldPassword){
            showToast('Dont use old password, choose a new one.')
            return;
        }
        if(globalPasswordData.length===0 || passwordsState==='empty'){
            updateMasterPasswordOnly(newPassword1)
            return;
        }
        try{
            setIsValidatorOpen(true)
            const oldKeyBundle = await generateKeysFromPassword(checkOldPassword,userData?.salt)
            const oldKeys = {
                userAes128Key: oldKeyBundle.aes128Key,
                userAes256Key: oldKeyBundle.aes256Key
            };
            setStepIndex(prev=>prev+1)
            const newKeyBundle = await generateKeysFromPassword(newPassword1, userData?.salt);
            const newKeys = {
                userAes128Key: newKeyBundle.aes128Key,
                userAes256Key: newKeyBundle.aes256Key
            };
            setStepIndex(prev=>prev+1)
            newKeyBundle.cancelTimeout?.();
            setStepIndex(prev=>prev+1)
            const updatedPasswordEntries = await Promise.all(
            globalPasswordData.map(async (entry) => {
                const decrypted = await handleKeySelectionAndDecryptionProcess(entry, oldKeys);
                const { iv, cipherText } = await handleKeySelectionAndEncryptionProcess(
                    newKeys,
                    entry.encryptionMethod,
                    decrypted
                );
                return {
                    key: entry.key,
                    updates: { iv, cipherText }
                };
            })
        );
        setStepIndex(prev=>prev+1)
        const hashedPassword = await hashPassword(newPassword1);
        const usersRef = ref(realtimeDb,`users/${user.uid}`);
        await update(usersRef,{password:hashedPassword});
        const updates={};
        updatedPasswordEntries.forEach(entry=>{
            updates[`userPasswords/${user.uid}/${entry.key}/iv`]=entry.updates.iv;
            updates[`userPasswords/${user.uid}/${entry.key}/cipherText`]=entry.updates.cipherText;
        })
        await update(ref(realtimeDb),updates);
        setStepIndex(prev=>prev+1)
        // handleSetUserKeys(null)
        // handleSetIsAuthenticatedWithPassword(false)
        setStepIndex(prev=>prev+1)
        showToast('Password change successful.')
        }catch(e){
            console.error(e)
            showToast('Error occured try again later.')
        }
    }
    const updateMasterPasswordOnly=async(newPassword1)=>{
        try{
        const hashedPassword = await hashPassword(newPassword1);
        await update(ref(realtimeDb,`users/${user.uid}`),{
            password:hashedPassword
        })
        showToast("Master password changed successfully");
        handleSetUserKeys(null)
        handleSetIsAuthenticatedWithPassword(false)
    }
    catch(e){
        showToast('Error occured while updating master password.')
        console.error(e)
    }
}
    
    if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

    if(passwordsState === "loading"  || passwordsState === "error"){
        return <AsyncLoader text={stateText[passwordsState]} ls={"70px"} type={passwordsState} />
    }

    return ( 
        <div className='change-master-password-div'>
            <h1>Change master password</h1>
            <div className='main'>
                <div className='changer'>
                    <div className='pass'>
                        <input className='c-input' placeholder='Old password' maxLength={100} minLength={4} type={passType} required value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} onKeyUp={(e)=>handleKeyUpOldPasswordInput(e.key)} />
                        <FaBullseye className='eye' onClick={handlePassType}  />
                        </div>
                        <button className='c-btn old-btn' onClick={handleCheckOldPassword}>Confirm</button>
                        <form className='new-pass-div' onSubmit={handleSubmit}>
                            <VscServerProcess className='note' />
                            <p className='note-p'>Changing your master password requires decrypting and re-encrypting your entire vault. This is a heavy operation — avoid doing it too often unless required.</p>
                            <div className='pass'>
                        <input className='c-input' placeholder='New password' maxLength={100} minLength={4} type={passType} required value={newPassword.t1} onChange={(e)=>setNewPassword((prev)=>({...prev,t1:e.target.value}))} />
                        <FaBullseye className='eye' onClick={handlePassType}  />
                        </div>
                            <div className='pass'>
                        <input className='c-input' placeholder='Confirm new password' maxLength={100} minLength={4} type={passType} required value={newPassword.t2} onChange={(e)=>setNewPassword((prev)=>({...prev,t2:e.target.value}))} />
                        <FaBullseye className='eye' onClick={handlePassType}  />
                        </div>
                        <SubmitButton text={'Confirm'} isDisabled={isButtonDisabled} />
                        </form>
                    </div>
                <PasswordCheckList backgroundImageColor={'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'} inputPassword={newPassword.t1} />
            </div>
            {isValidatorOpen && <PasswordChangeValidator stepIndex={stepIndex} />}
        </div>
     );
    
}
export default ChangeMasterPassword;