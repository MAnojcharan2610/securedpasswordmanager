import './gen-significant-pass.styles.scss';
import PassLengthSlider from '../pass-length-slider/pass-length-slider.component';
import { useState } from 'react';
import { separatorArray } from '../../utils/helpers/helpers';
import { wordlist } from '../../utils/words/words';
import PropTypes from 'prop-types';
const wordCountArray =[1,2,3,4,5,6];

const GenSignificantPass = ({setDisplayPassword}) => {
    const [length,setLength]=useState(15);
    const [wordCount, setWordCount] = useState(3); 
    const [wordSeparator, setWordSeparator] = useState('-');

    const handleSetLength=(val)=>setLength(val);

    const generatePassword=()=>{
        const wordlistLength = wordlist.length;
        if(!length || !wordlistLength) return;
        const newPassword = Array(wordCount).fill(null).map(() => {
        const randomIndex = Math.floor(Math.random() * wordlistLength);
        return wordlist[randomIndex];
      }).join(wordSeparator).slice(0,length);
      setDisplayPassword(newPassword);
    }


    return ( 
        <div className='gen-significant-pass-div'>
            <h3>Generate significant password</h3>
            <PassLengthSlider length={length} handleSetLength={handleSetLength} />
            <div className='options'>
            <h3>Include:</h3>
            <div className='opts'>
                <div className='opt'>
                    <p>Word count</p>
                    <div className='tile-container'>
                        {wordCountArray.map((count,index)=>{
                            return <div key={`word-count-tile-${index}`} onClick={()=>setWordCount(count)} className={wordCount === count ? "black-white" : ""}>
                                {count}
                            </div>
                        })}
                    </div>
                </div>
                <div className='opt'>
                    <p>Choose separator</p>
                    <div className='tile-container'>
                        {separatorArray.map((separator,index)=>{
                            return <div key={`separator-tile-${index}`} className={`seps ${wordSeparator === separator ? "black-white" : ""}` } onClick={()=>setWordSeparator(separator)}>
                                {separator}
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <button className='gen c-btn' onClick={generatePassword}>Generate</button>
            </div>
        </div>
     );
}
GenSignificantPass.propTypes={
    setDisplayPassword:PropTypes.func,
}
export default GenSignificantPass;