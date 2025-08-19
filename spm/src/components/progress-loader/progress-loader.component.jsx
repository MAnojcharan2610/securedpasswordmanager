import {  useEffect, useState } from 'react';
import './progress-loader.styles.scss';
import PropTypes from 'prop-types';
import { statusColors,progressDotColors } from '../../utils/helpers/helpers';


const ProgressLoader = ({progress,statusCode}) => {
    const [percentage,setPercentage]=useState(0);
    
    useEffect(()=>{
        const timeout = setTimeout(()=>setPercentage(progress),300);
        return ()=> clearTimeout(timeout);
    },[progress])
    
    return ( 
        <div className='progress-loader-div'>
            <div className='main-loader' style={{width:`${percentage}%`,backgroundColor:statusColors[statusCode]}}>
                <div className='dot' style={{backgroundColor:progressDotColors[statusCode]}}></div>
            </div>
        </div>
     );
}
ProgressLoader.propTypes={
    progress:PropTypes.number,
    statusCode:PropTypes.number,
}
export default ProgressLoader;