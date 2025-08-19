import './password-check.styles.scss';
import { passwordCheckList,defaultChecklist,passwordCriteriaArray } from '../../utils/helpers/helpers';
import { FaRegCircleDot,FaCheck } from "react-icons/fa6";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const PasswordCheck = ({password=''}) => {

    const [checkListStates,setCheckListStates]=useState(defaultChecklist);

    useEffect(()=>{
        let newCheckList={...defaultChecklist};
        newCheckList.has8Characters=password.length>=8;
        newCheckList.hasUpperCase=passwordCriteriaArray[0].split('').some(char=>password.includes(char));
        newCheckList.hasLowercase=passwordCriteriaArray[1].split('').some(char=>password.includes(char));
        newCheckList.hasNumbers=passwordCriteriaArray[2].split('').some(char=>password.includes(char));
        newCheckList.hasSymbols=passwordCriteriaArray[3].split('').some(char=>password.includes(char));
        setCheckListStates(newCheckList);
    },[password]);

    return ( 
        <div className="password-check-div">
            <h2>Password checklist</h2>
            <div className='checks-container'>
                {Object.values(checkListStates).map((liststate,index)=>{
                    return <div key={`pass-check-list-option-${index}`}>
                        {!liststate ? <FaRegCircleDot/> : <FaCheck className='green' />}
                        <p style={{color:liststate ? "rgb(121, 232, 121)" : ""}}>{passwordCheckList[index]}</p>
                    </div>
                })}
            </div>
        </div>
     );
}
PasswordCheck.propTypes={
    password:PropTypes.string,
}
export default PasswordCheck;