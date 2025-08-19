import { useNavigate } from 'react-router-dom';
import './password-checklist.styles.scss';
import PasswordCheck from '../password-check/password-check.component';
import PropTypes from 'prop-types';


const PasswordCheckList = ({inputPassword,backgroundImageColor}) => {
    const router = useNavigate();
    return ( 
        <div className='password-checklist-div' style={{backgroundImage:backgroundImageColor}}>
            <PasswordCheck password={inputPassword} />
        <div className='info'>
                <h2>Password security</h2>
                <p>Learn how your passwords are securely stored at rest and transit</p>
                <p>See what process is used in maintaing the integrity of your passwords</p>
                <button className='c-btn' onClick={()=>router('/dashboard/public-information')}>Public info</button>
            </div>
        </div>
     );
}
PasswordCheckList.propTypes={
    inputPassword:PropTypes.string,
    backgroundImageColor:PropTypes.string,
}
export default PasswordCheckList;