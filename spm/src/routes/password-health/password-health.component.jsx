import './password-health.styles.scss'
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useGlobalDataContext } from '../../contexts/global-data.context';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';
import AsyncLoader from '../../components/async-loader/async-loader.component';
import AnalysisImg from '../../assets/analysis.svg';
import PasswordTile from '../../components/password-tile/password-tile.component';
import ProgressLoader from '../../components/progress-loader/progress-loader.component';
import zxcvbn from 'zxcvbn';
import { handleKeySelectionAndDecryptionProcess } from '../../utils/helpers/globalFunctions';
import { statusCodeName,statusColors } from '../../utils/helpers/helpers';
import { useToast } from '../../contexts/toast-context.context';
import { useState } from 'react';


const PasswordHealth = () => {
    const {isAuthenticatedWithPassword}=useUserAuthContext();
    const {globalPasswordData,handleSetAnalysisData,analysisData}=useGlobalDataContext();
    const [state,setState]=useState('');
    const {userKeys}=useKeyGenerationContext();
    const {showToast}=useToast();

    if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

    if(state === 'loading') return <AsyncLoader text={"Analysing your passwords"} type={"loading"} ls={"70px"} />

    if(state === 'error') return <AsyncLoader text={"Error occured please try later"} type={"error"} ls={"70px"} />


    const handlePasswordHealthGeneration=async()=>{
        if(!globalPasswordData.length || !userKeys){
            showToast('Nothing yet!')
            return;
        }
        try{
            setState('loading');
            const analysisArray =await Promise.all(globalPasswordData.map(async(d)=>{
                const decryptedPassword = await handleKeySelectionAndDecryptionProcess(d,userKeys);
                const result = zxcvbn(decryptedPassword);
                return {...d,"score":result.score,"guesses":result.guesses}
            }))
            handleSetAnalysisData(analysisArray);
        }catch(e){
            console.error('error analysing passwords',e)
            setState('error')
        }finally{
            setState('')
        }
    }

    return ( 
        <div className='password-health-div'>
            <h1>Password Health</h1>
            <div className='main'>
                {analysisData.length ===0 ? <div className='main-greet'>
                    <div className='img'>
                        <img src={AnalysisImg} />
                    </div>
                    <div className='content'>
                        <p>Get an overview of how strong your passwords are by generating the strength score with our analyser</p>
                        <button className='c-btn' onClick={handlePasswordHealthGeneration}>Analyse now</button>
                    </div>
                </div> : <div className='main-analysis'>
                <button className='c-btn' onClick={handlePasswordHealthGeneration}>Reanalyse</button>
                    <div className='stats'>
                    {analysisData.map((d,index)=>{
                        return <div key={`pass-health-tile-${index}`} className='tile'>
                            <PasswordTile d={d} isOptionsRequired={false} />
                            <div className='result'>
                            <ProgressLoader statusCode={d.score} progress={(d.score+1)*20}  />
                            <span>{(d.score+1)*20}%</span>
                            </div>
                            <div className='status'>
                                <p>Guesses: <span>{d.guesses}</span></p>
                                <p>Status: <span style={{color:statusColors[d.score]}}>{statusCodeName[d.score]}</span></p>
                            </div>
                        </div>
                    })}
                    </div>
                </div>}
            </div>
        </div>
     );
}
 
export default PasswordHealth;