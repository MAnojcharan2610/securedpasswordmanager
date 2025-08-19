import './auth.styles.scss';
import AppIcon from '../../assets/password-svgrepo-com.svg';
import { useState } from 'react';
import { FaBullseye } from "react-icons/fa";
import SubmitButton from '../../components/submit-button/submit-button.component';
import { FcGoogle } from "react-icons/fc";
import { signInWithGooglePopup } from '../../utils/firebase/firebase';
import { signInUserWithEmailAndPassword } from '../../utils/firebase/firebase';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useNavigate } from 'react-router-dom';

const defaultFormFields = {
    email: '',
    password: '',
};

const Auth = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);
    const {  email, password } = formFields;
    const [passType,setPassType]=useState('password');
    const [isLoading,setIsLoading]=useState(false);
    const {handeSetIsNewGoogleAuthUser}=useUserAuthContext();
    const [statusMessage,setStatusMessage]=useState('.'); //error
    const router = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try{
        let msg = await signInUserWithEmailAndPassword(formFields.email,formFields.password)
        if(msg === "invalid credential"){
            throw new Error("invalid credential");
        }
        setIsLoading(false);
        resetFormFields()
        router('/dashboard')
        }catch(e){
          console.error(e)
          setIsLoading(false);
          resetFormFields()
          setStatusMessage(e.message);
          setTimeout(()=>setStatusMessage('.'),2500)
        }
      };
    

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormFields({ ...formFields, [name]: value });
      };

      const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }

      const handleGooglePopupSignIn=async()=>{
        try{
            const returnedVal = await signInWithGooglePopup();
            if(returnedVal) handeSetIsNewGoogleAuthUser(true);
        }catch(e){
            console.error(e)
            setStatusMessage("error occured try again later")
            setTimeout(()=>setStatusMessage('.'),2500)
        }
    }

    return ( 
        <div className='auth-div'>
            <div className='i-space c-i-space'>
                <div>
                <img src={AppIcon} onClick={()=>router('/')} />
                <span>Secure Password manager</span>
                </div>
            <div>
                <p className='big-p'>Welcome back!</p><p>secure access to your passwords, only for you.</p>
            </div>
            </div>
            <div className='main c-i-main'>
            <div className='head'>
                    <h1>Sign in to your account  </h1>
                    <p>Sign in with your email and password</p>
            </div>
                <form onSubmit={handleSubmit}>
                  <input placeholder='Email' type='email' required onChange={handleChange} name='email' value={email} className='c-input' maxLength={100} />
                  <div className='pass'>
                  <input placeholder='Password' minLength={6} type={passType} required onChange={handleChange} name='password' value={password} className='c-input' maxLength={100} />
                  <FaBullseye className='eye' onClick={handlePassType} />
                  </div>
                  <SubmitButton text={'Sign In'} state={isLoading} size={"25px"} />
                </form>
                <div className='g-sign'>
                  <button onClick={handleGooglePopupSignIn}><FcGoogle className='svg' /> Sign In with Google</button>
                </div>
            <span>{statusMessage}</span>
            </div>
        </div>
     );
}
 
export default Auth;