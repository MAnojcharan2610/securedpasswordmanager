import './add-password-dialog.styles.scss';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useEffect, useState } from 'react';
import { hashPassword } from '../../utils/helpers/hash';
import { realtimeDb } from '../../utils/firebase/firebase';
import { ref,update } from 'firebase/database';
import SubmitButton from '../submit-button/submit-button.component';
import { FcGoogle } from "react-icons/fc";
import { FaBullseye } from "react-icons/fa";
import { isPasswordPwned } from '../../utils/helpers/breachCheck';


const AddPasswordDialog = () => {

    const {handeSetIsNewGoogleAuthUser,user}=useUserAuthContext();
    const [passType,setPassType]=useState('password');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [isMasterPasswordCreated,setIsMasterPasswordCreated]=useState(false);
    const [statusMessage,setStatusMessage]=useState('_'); //unmatched passwords, error
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [bioError, setBioError] = useState('');

    const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }

      const handleSubmit=async(event)=>{
        event.preventDefault();
        if(password !== confirmPassword){
            setStatusMessage('Unmatched passwords');
            setTimeout(()=>setStatusMessage('_'),2500);
            return;
        } 

        setStatusMessage('Checking password safety...');
        const pwned = await isPasswordPwned(password);
        if (pwned) {
            setStatusMessage('This password has been found in data breaches. Please choose another.');
            setTimeout(() => setStatusMessage('_'), 4000);
            return;
        }

        setIsMasterPasswordCreated(true);
        const hashedPassword=await hashPassword(password);
        try{
            const userRef = ref(realtimeDb,`users/${user.uid}`);
            await update(userRef,{
                password:hashedPassword,
                hasMasterPassword:true,
            });
            handeSetIsNewGoogleAuthUser(false);
            setStatusMessage("Master password created successfully!"); // <-- Success message
            setTimeout(()=>setStatusMessage('_'),3000); // Optional: clear after 3s
        }catch(e){
            console.error(e);
            setStatusMessage("Error occurred, please try again");
            setTimeout(()=>setStatusMessage('_'),2500);
        }finally{
            setIsMasterPasswordCreated(false);
        }
      }

      const handleFaceAuth = async () => {
        setBioError('');
        if (!window.PublicKeyCredential) {
          setBioError('Biometric authentication not supported on this browser.');
          return;
        }
        try {
          // Simple WebAuthn get() call for demonstration
          await navigator.credentials.get({
            publicKey: {
              challenge: new Uint8Array(32),
              timeout: 60000,
              userVerification: 'required',
            }
          });
          setIsAuthenticated(true);
          setBioError('Face authentication successful!');
        } catch (e) {
          setBioError('Face authentication failed or cancelled.');
        }
      };

    return ( 
        <div className='overlaying'>
            <div className="add-password-dialog-div">
                <div className='info'>
                    <div className='icon'>
                    <FcGoogle/>
                    </div>
                    <div className='p-info'>
                    <p>Having chosen google signin, it is required to have a master password to continue with the application usage.</p>
                    <p>This is a one time procedure, so please create a convenient unique password.</p>
                    </div>                    
                </div>
                <div className='input'>
                    <h2>Master password</h2>
                    <p>Input a convenient unique password</p>
                    {/* Face authentication button */}
                    <button
                      type="button"
                      className="c-btn"
                      onClick={handleFaceAuth}
                      disabled={isAuthenticated}
                    >
                      {isAuthenticated ? "Face Authenticated" : "Authenticate with Face"}
                    </button>
                    <span style={{color: 'red'}}>{bioError}</span>
                    <form onSubmit={handleSubmit}>
                    <div className='pass' >
                        <input placeholder='Password' minLength={6} type={passType} required onChange={(e)=>setPassword(e.target.value)} name='password' value={password} className='c-input' maxLength={100} />
                        <FaBullseye className='eye' onClick={handlePassType} />
                    </div>
                    <div className='pass'>
                        <input placeholder='Confirm password' minLength={6} type={passType} required onChange={(e)=>setConfirmPassword(e.target.value)} name='confirmpassword' value={confirmPassword} className='c-input' maxLength={100} />
                        <FaBullseye className='eye' onClick={handlePassType} />
                    </div>
                    <SubmitButton text={"Submit"} state={isMasterPasswordCreated || !isAuthenticated} disabled={!isAuthenticated} />
                    </form>
                    <span>{statusMessage}</span>
                </div>
            </div>
        </div>
     );
}
 
export default AddPasswordDialog;