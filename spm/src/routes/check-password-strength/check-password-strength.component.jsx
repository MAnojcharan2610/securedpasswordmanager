import './check-password-strength.styles.scss';
import SubmitButton from '../../components/submit-button/submit-button.component'
import { useState } from 'react';
import { baseInfo,statusColors,statusCodeName,crackTimeCodeNames,crackTimeInterfaceNames } from '../../utils/helpers/helpers';
import zxcvbn from 'zxcvbn';
import { FaRegCopy } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { useToast } from '../../contexts/toast-context.context';

const CheckPasswordStrength = () => {

    const [passwordStrength,setPasswordStrength]=useState(5);
    const [basicInfo,setBasicInfo]=useState(baseInfo);
    const [warning,setWarning]=useState("None");
    const [suggestion,setSuggestion]=useState("None");
    const [crackTimeSeconds,setCrackTimeSeconds]=useState(crackTimeCodeNames);
    const [inputValue,setInputValue]=useState('');
    const {showToast}=useToast();

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(!inputValue) return;
        const result = zxcvbn(inputValue);
        try{
            setPasswordStrength(result.score)
            setWarning(result.feedback.warning || "None");
            setSuggestion(result.feedback?.suggestions?.[0] || "None")
            setBasicInfo({
                Password:result.password,
                Guesses:result.guesses,
                Guesses_log10:result.guesses_log10,
                Pattern: result.sequence[0]?.pattern || "None", 
                Matched_word: result.sequence[0]?.matched_word || "None",
                Dictionary_name: result.sequence[0]?.dictionary_name || "None",
            })
            const newCrackTimes={};
            Object.keys(crackTimeCodeNames).forEach((name)=>{
                newCrackTimes[name]=result.crack_times_display?.[name] || "Unknown time";
            })
            setCrackTimeSeconds(newCrackTimes);
        }catch(e){
            console.error(e);
            reset()
        }
    }

    const handleCopyClick=()=>{
        if(inputValue){
        try{
            navigator.clipboard.writeText(inputValue);
            showToast("Copied Successfully!")
        }catch(e){
            console.error(e)
        }
    }
    }

    const reset=()=>{
        setPasswordStrength(5);
        setBasicInfo(baseInfo);
        setWarning("None");
        setSuggestion("None");
        setCrackTimeSeconds(crackTimeCodeNames);
        setInputValue('');
    }

    return ( 
        <div className='check-password-strength-div'>
            <h1>Password strength checker</h1>
            <div className='main'>
                <div className='interface'>
                <h2>Interface</h2>
                    <div className='indicator' style={{backgroundColor:statusColors[passwordStrength]}}>
                        <div className='inner'>
                            {statusCodeName[passwordStrength]}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <label className='bold'>Input password</label>
                        <input className='c-input' minLength={2} spellCheck={"false"} maxLength={40} value={inputValue} onChange={(e)=>setInputValue(e.target.value)} placeholder='password' />
                        <SubmitButton text={"Check strength"}  />
                    </form>
                    <div className='copy-reset'>
                        <div className='copy' onClick={handleCopyClick}>
                                <FaRegCopy/> Copy to clipboard 
                        </div>
                        <div className='reset' onClick={reset}>
                            <FiRefreshCw/>
                        </div>
                    </div>
                    <div className='suggest'>
                        <h3>Suggestion</h3>
                        <p>{suggestion}</p>
                    </div>
                </div>
                <div className='results'>
                    <h2>Results</h2>
                    <div className='container'>
                    <p className='bold'>Basic info</p>
                        <div className='base-info'>
                            {Object.entries(basicInfo).map(([key,value],index)=>{
                                return <div key={`pas-basic-info-${index}`}
                                >
                                    <p>{key.replace("_"," ")}</p>
                                    <p>{value}</p>
                                </div>
                            })}
                        </div>
                        <p className='bold'>Crack time</p>
                        <div className='crack-time'>
                            {Object.entries(crackTimeSeconds).map(([,value],index)=>{
                                return <div key={`crack-time-pass-${index}`}>
                                    <p>{crackTimeInterfaceNames[index]}</p>
                                    <p>{value}</p>
                                </div>
                            })}
                        </div>
                        <p className='bold'>Feedback</p>
                        <div className='feedback'>
                            <div>
                                <p>Warning</p>
                                <p>{warning}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default CheckPasswordStrength;