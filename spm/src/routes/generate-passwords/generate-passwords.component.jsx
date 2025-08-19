import './generate-passwords.styles.scss';
import { useState } from 'react';
import GenSignificantPass from '../../components/gen-significant-pass/gen-significant-pass.component';
import GenRandomPass from '../../components/gen-random-pass/gen-random-pass.component';
import { FaRegCopy } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { useToast } from '../../contexts/toast-context.context';

const GeneratePasswords = () => {
    const [isSwitched,setIsSwitched]=useState(false);
    const [displayPassword,setDisplayPassword]=useState('Password');
    const {showToast}=useToast();

    const switch1Styles={backgroundColor:isSwitched ? 'rgb(72,139,255)' : 'inherit',color:isSwitched?'ghostwhite' : ''}
    const switch2Styles={backgroundColor:!isSwitched ? 'rgb(72,139,255)' : 'inherit',color:!isSwitched?'ghostwhite' : ''}

    const handleCopyClick=()=>{
        try{
            navigator.clipboard.writeText(displayPassword);
            showToast("Copied Successfully!")
        }catch(e){
            console.error(e)
        }
    }

    return ( 
        <div className='generate-passwords-div'>
            <h1>Generate password</h1>
            <div className='main'>
                <div className='display'>
                    <div className='show'>
                    <h3>{displayPassword}</h3>
                    </div>
                    <div className='copy-reset'>
                        <div className='copy' onClick={handleCopyClick}>
                              <FaRegCopy/> Copy to clipboard 
                        </div>
                        <div className='reset' onClick={()=>setDisplayPassword('Password')}>
                            <FiRefreshCw/>
                        </div>
                    </div>
                </div>
                <div className='controls'>
                    <div className='switch'>
                        <div style={switch1Styles} onClick={()=>setIsSwitched(true)}>Significant</div>
                        <div style={switch2Styles} onClick={()=>setIsSwitched(false)} >Random</div>
                    </div>
                    <div className='components'>
                        {isSwitched ? <GenSignificantPass setDisplayPassword={setDisplayPassword} /> : <GenRandomPass setDisplayPassword={setDisplayPassword} />}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default GeneratePasswords;