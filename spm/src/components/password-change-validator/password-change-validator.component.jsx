import './password-change-validator.styles.scss'
import { FaCheck } from 'react-icons/fa6';
import Loader from '../loader/loader.component';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { useUserAuthContext } from '../../contexts/user-auth.context';
const processes=['Generate old keys from old password','Generate new keys from new password','Decrypt all passwords','Encrypt all passwords with new keys','Update database','Perform security reset']
const PasswordChangeValidator = ({stepIndex=0}) => {
    
    const router = useNavigate();
    const [elapsedTime,setElapsedTime]=useState(0);
    const {handleSetIsAuthenticatedWithPassword}=useUserAuthContext();
        const {handleSetUserKeys}=useKeyGenerationContext();

    useEffect(()=>{
        let intervalId;
        if(stepIndex<6){
            intervalId = setInterval(()=>{
             setElapsedTime(prev=>prev+1)   
            },1000)
        }
        if(stepIndex>=6){
            clearInterval(intervalId)
        }
        return ()=>clearInterval(intervalId)
    },[stepIndex])
    return ( 
        <div className='overlaying'>
            <div className='password-change-validator-div'>
                <h3>Processing password change </h3>
                <div className='processes-div'>
                    {processes.map((p,i)=>{
                    return <div key={`process-index-${i}`} className='process-tile'>
                        {i<stepIndex ? <FaCheck/> :  <Loader  />}
                        <span>{p}</span>
                    </div>
                })}
                </div>
                <span className='elapsed-time'>Elapsed time : {elapsedTime}seconds </span>
                <button className='c-btn' disabled={stepIndex<6} onClick={()=>
                {
                    router('/dashboard')
                    handleSetUserKeys(null)
                    handleSetIsAuthenticatedWithPassword(false)
                }}>Continue</button>
            </div>
        </div>

     );
}
PasswordChangeValidator.propTypes={
    stepIndex:PropTypes.number,
}
export default PasswordChangeValidator;