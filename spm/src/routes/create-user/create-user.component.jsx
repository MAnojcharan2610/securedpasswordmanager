import './create-user.styles.scss';
import AppIcon from '../../assets/password-svgrepo-com.svg';
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { FaBullseye } from "react-icons/fa";
import SubmitButton from '../../components/submit-button/submit-button.component';
import { signInWithGooglePopup } from '../../utils/firebase/firebase';
import { createUserFromEmailAndPassword } from '../../utils/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useUserAuthContext } from '../../contexts/user-auth.context';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

const CreateUser = () => {

      const [formFields, setFormFields] = useState(defaultFormFields);
      const { displayName, email, password, confirmPassword } = formFields;
      const [passType,setPassType]=useState('password');
      const [isLoading,setIsLoading]=useState(false);
      const {handeSetIsNewGoogleAuthUser}=useUserAuthContext();
      const [statusMessage,setStatusMessage]=useState(''); //error
      const router = useNavigate();

      const resetFormFields = () => {
        setFormFields(defaultFormFields);
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
          setStatusMessage('passwords do not match');
          setTimeout(()=>setStatusMessage(''),2500)
          return;
        }
        setIsLoading(true);
        try{
        let msg=await createUserFromEmailAndPassword(formFields.email,formFields.password,formFields.displayName)
        if(msg === "Email already in use. Please use a different email."){
          throw new Error("Email already in use. Please use a different email.");
        }
        setIsLoading(false)
        resetFormFields()
        router('/dashboard')
        }catch(e){
          console.error(e)
          resetFormFields();
          setIsLoading(false);
          setStatusMessage("Email already in use. Please use a different email.")
          setTimeout(()=>setStatusMessage(''),2500)
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
            setTimeout(()=>setStatusMessage(''),2500)
        }
    }

    return ( 
        <div className='create-user-div'>
            <div className='i-space c-i-space'>
                <div>
                    <img src={AppIcon} onClick={()=>router('/')} />
                    <span>Secure Password manager</span>
                </div>
                <div>
                <p className='big-p'>Securely,</p>
                    <p>store and manage your passwords.</p>
                </div>
            </div>
            <div className='main c-i-main'>
                <div className='head'>
                    <h1>{"Don't"} have an account ? </h1>
                    <p>Sign up with your email and password</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <input placeholder='Display Name' type='text' required onChange={handleChange} name='displayName' value={displayName} className='c-input' spellCheck={false} maxLength={70} />
                  <input placeholder='Email' type='email' required maxLength={100} onChange={handleChange} name='email'  value={email} className='c-input' />
                  <div className='pass' >
                  <input placeholder='Password' minLength={6} type={passType} required onChange={handleChange} name='password' value={password} className='c-input' maxLength={100} />
                  <FaBullseye className='eye' onClick={handlePassType} />
                  </div>
                  <div className='pass'>
                  <input placeholder='Confirm Password' minLength={6} type={passType} required onChange={handleChange} name='confirmPassword' value={confirmPassword} className='c-input' maxLength={100} />
                  <FaBullseye className='eye' onClick={handlePassType} />
                  </div>
                  <SubmitButton text={'Sign Up'} state={isLoading} size={"28px"} />
              </form>
                <div className='g-sign'>
                <button onClick={handleGooglePopupSignIn}><FcGoogle className='svg' /> Sign In with Google</button>
                </div>
                <p>{statusMessage}</p>
            </div>
        </div>
     );
}
 
export default CreateUser;