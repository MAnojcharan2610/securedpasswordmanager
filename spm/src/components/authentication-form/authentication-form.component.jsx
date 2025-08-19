import './authentication-form.styles.scss';
import Logo from '../../assets/password-svgrepo-com.svg';
import SubmitButton from '../submit-button/submit-button.component';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { compareHashPassword } from '../../utils/helpers/hash';
import { FaBullseye } from 'react-icons/fa6';
import { useState } from 'react';

const messages=['Hello there','You did it','Incorrect password','Error occured!']

const AuthenticationForm = () => {

    const [passType,setPassType]=useState('password');
    const [password,setPassword]=useState('');
    const [messsageState,setMessageState]=useState(0);
    const {userData,setUserDataState}=useGlobalUserDataContext();
    const {handleSetIsAuthenticatedWithPassword}=useUserAuthContext();
    const {generateKeysFromPassword}=useKeyGenerationContext();
    
    const handlePassType=()=>{
        setPassType(prev=>{
            if(prev === 'password'){
                return 'text'
            }else{
                return 'password'
            }
        })
      }

      const handleSubmit=async(e)=>{
        e.preventDefault();
        if(userData?.password){
            const result = await compareHashPassword(password,userData?.password)
            if(result === "error"){
                setMessageState(3);
                return;
            }
            if(result === "unmatch"){
                setMessageState(2);
                return;
            }
            if(result === "match"){
                setMessageState(1);
                handleKeyGeneration(password)
                handleSetIsAuthenticatedWithPassword(true);
            }
        }
      }
      
      const handleKeyGeneration=async(password)=>{
        try{
            await generateKeysFromPassword(password,userData?.salt);
        }catch(e){
            console.error(e)
            setUserDataState('error');
        }
      }

    return ( 
        <div className='authentication-form-div'>
            <div className='main'>
                <div className='feed'>
                    <div className='img'>
                    <img src={Logo}  />
                    </div>
                    <p>{messages[messsageState]}</p>
                </div>
                <div className='form'>
                    <h2>Password</h2>
                    <p>Enter your login password</p>
                    <form onSubmit={handleSubmit}>
                    <div className='pass'>
                        <input placeholder='Password' minLength={6} type={passType} required onChange={(e)=>setPassword(e.target.value)} name='password' value={password} className='c-input' maxLength={100} />
                        <FaBullseye className='eye' onClick={handlePassType} />
                    </div>
                    <SubmitButton text={"Submit"}  />
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default AuthenticationForm;