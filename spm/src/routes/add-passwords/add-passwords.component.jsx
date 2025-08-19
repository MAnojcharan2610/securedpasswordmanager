import './add-passwords.styles.scss'
import SubmitButton from '../../components/submit-button/submit-button.component';
import { useState } from 'react';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useToast } from '../../contexts/toast-context.context';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import { handleKeySelectionAndEncryptionProcess } from '../../utils/helpers/globalFunctions';
import { realtimeDb } from '../../utils/firebase/firebase';
import { ref,push, update } from 'firebase/database';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';
import RadioButton from '../../components/radio-button/radio-button.component';
import { FaBullseye } from "react-icons/fa";
import PasswordCheckList from '../../components/password-checklist/password-checklist.component';

const AddPasswords = () => {

        const [passType,setPassType]=useState('password');
        const [inputPassword,setInputPassword]=useState("");
        const [inputUsername,setInputUsername]=useState("");
        const [inputSite,setInputSite]=useState("");
        const [isProcessLoading,setIsProcessLoading]=useState(false);
        const [encryptionMethod,setEncryptionMethod]=useState("AES-128");
        const [encodingMethod,setEncodingMethod]=useState("Base 64");
        const {isAuthenticatedWithPassword,handleSetIsAuthenticatedWithPassword,user}=useUserAuthContext();
        const {userKeys}=useKeyGenerationContext();
        const {userData}=useGlobalUserDataContext();
        const {showToast}=useToast();        
    
    const resetFields=()=>{
        setInputSite("");
        setInputUsername("");
        setInputPassword("");
    }
    
    const pushToDb=async(passwordDataObject)=>{
        const passwordsRef = ref(realtimeDb,`userPasswords/${user.uid}`);
        const newPasswordsRef = push(passwordsRef);
        const newPasswordKey = newPasswordsRef.key;

        const currentPasswordsCount = userData?.passwordsCount || 0;

        const updates={};
        updates[`userPasswords/${user.uid}/${newPasswordKey}`]=passwordDataObject;
        updates[`users/${user.uid}/passwordsCount`]=currentPasswordsCount+1;
        await update(ref(realtimeDb),updates);
    }

    const handlePasswordLimits=()=>{
        const totalUserPasswords=userData?.passwordsCount;
        if(totalUserPasswords || totalUserPasswords===0){
            if(userData?.subscriptionPlan==='free'){
                return totalUserPasswords < 20;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    const handleSubmit=async(event)=>{
        event.preventDefault();
        if(!userKeys){
            handleSetIsAuthenticatedWithPassword(false);
            return;
        }
        const isPasswordAdditionAllowed=handlePasswordLimits();
        if(isPasswordAdditionAllowed){
            setIsProcessLoading(true);
        try{
            const {iv,cipherText}=await handleKeySelectionAndEncryptionProcess(userKeys,encryptionMethod,inputPassword.trim());
            const encryptedPasswordData={
                inputSite,
                inputUsername,
                encryptionMethod,
                iv,
                cipherText,
                isFavourite:false,
                timestamp:Date.now()
            }
            await pushToDb(encryptedPasswordData);
            resetFields()
            setIsProcessLoading(false);
            showToast("Password added successfully")
        }catch(e){
            console.error(e);
            resetFields()
            setIsProcessLoading(false);
            showToast("Error occured please try again!")
        }
        }else{
            showToast("Maximum Password Limit")
        }
    }

    const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }

    if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }
    
    return ( 
        <div className='add-passwords-div'>
            <h1>Add your passwords</h1>
            <div className='main'>
                <div className='interface'>
                <h3>Enter your details</h3>
                    <form onSubmit={handleSubmit}>
                        <input className='c-input' placeholder='Username or email' required maxLength={80} value={inputUsername} onChange={(e)=>setInputUsername(e.target.value)}  />
                        <div className='pass'>
                        <input className='c-input' placeholder='Password' maxLength={100} minLength={4} type={passType} required value={inputPassword} onChange={(e)=>setInputPassword(e.target.value)} />
                        <FaBullseye className='eye' onClick={handlePassType}  />
                        </div>
                        <input className='c-input' placeholder='Site' required maxLength={100} value={inputSite} onChange={(e)=>setInputSite(e.target.value)} />
                        <SubmitButton text={"Add password"} state={isProcessLoading} />
                    </form>
                    <div className='encrypt-method'>
                        <h4>Encryption method</h4>
                        <div>
                        <RadioButton text={"AES-128"} setMethod={setEncryptionMethod} state={encryptionMethod} groupName={"encryption"} />
                        <RadioButton text={"AES-256"} setMethod={setEncryptionMethod} state={encryptionMethod} groupName={"encryption"} />
                        </div>
                    </div>
                    <div className='encode-method'>
                    <h4>Encoding method</h4>
                        <div>
                        <RadioButton text={"Base 64"} setMethod={setEncodingMethod} state={encodingMethod} groupName={"encoding"} />
                        </div>
                    </div>
                </div>
                <PasswordCheckList inputPassword={inputPassword} backgroundImageColor={'linear-gradient(to top, #30cfd0 0%, #330867 100%)'} />
            </div>
        </div>
     );
}
 
export default AddPasswords;