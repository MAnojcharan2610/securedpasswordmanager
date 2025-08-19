import PropTypes from 'prop-types';
import './submit-button.styles.scss';
import Loader from '../loader/loader.component';
const SubmitButton = ({text,state,size="25px",isDisabled=false}) => {
    return ( 
        <button type="submit" className='submit-button-btn' disabled={isDisabled}>
        {state ? <Loader lh={size} lw={size} pos={'relative'} /> : text }
        </button>
     );
}
SubmitButton.propTypes={
    text:PropTypes.string,
    state:PropTypes.bool,
    size:PropTypes.string,
    isDisabled:PropTypes.bool
}
export default SubmitButton;