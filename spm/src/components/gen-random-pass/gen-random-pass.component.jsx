import './gen-random-pass.styles.scss';
import PassLengthSlider from '../pass-length-slider/pass-length-slider.component';
import { useState } from 'react';
import ToggleSwitch from '../toggle-switch/toggle-switch.component';
import PropTypes from 'prop-types';
import { passwordCriteriaArray } from '../../utils/helpers/helpers';

const labels=['Numbers','Uppercase Letters','Lowercase letters','Special symbols']

const GenRandomPass = ({setDisplayPassword}) => {
    const [length,setLength]=useState(8);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useDigits, setUseDigits] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [statusMessage,setStatusMessage]=useState('_'); //unmatched passwords, error
    const handleSetLength=(val)=>setLength(val);
    const setters=[setUseDigits,setUseUppercase,setUseLowercase,setUseSymbols];
    const states=[useDigits,useUppercase,useLowercase,useSymbols];

    const generatePassword = () => {
        let characters = '';
        if (useUppercase) characters += passwordCriteriaArray[0];
        if (useLowercase) characters += passwordCriteriaArray[1];
        if (useDigits) characters += passwordCriteriaArray[2];
        if (useSymbols) characters += passwordCriteriaArray[3];
        if (!characters) {
          setStatusMessage("At least one character type must be selected."); 
          setTimeout(()=>setStatusMessage('_'),2500)
          return;
        }
        let newPassword = '';
        const randomArray = new Uint8Array(length);
        window.crypto.getRandomValues(randomArray);
    
        for (let i = 0; i < length; i++) {
            const randomIndex = randomArray[i] % characters.length;
            newPassword += characters.charAt(randomIndex);
        }
        setDisplayPassword(newPassword)
      };
    return ( 
        <div className='gen-random-pass-div'>
            <h3 style={{textAlign:'center'}}>Generate random password</h3>
            <PassLengthSlider length={length} handleSetLength={handleSetLength} />
            <div className='options'>
                <span className='sm'>{statusMessage}</span>
                <h3>Include:</h3>
                <div className='opts'>
                    {setters.map((set,index)=>{
                        return <div key={`random-pass-setters-${index}`}>
                            <p>{labels[index]}</p>
                            <ToggleSwitch bool={states[index]} set={setters[index]} />
                        </div>
                    })}
                </div>
            </div>
            <button className='gen c-btn' onClick={generatePassword}>Generate</button>
        </div>
     );
}
GenRandomPass.propTypes={
    setDisplayPassword:PropTypes.func,
}
export default GenRandomPass;