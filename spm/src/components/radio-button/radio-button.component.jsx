import PropTypes from 'prop-types';
import './radio-button.styles.scss';
const RadioButton = ({ text, setMethod, state,groupName }) => {
    return (
        <div className='radio-button-div'>
            <input 
                type="radio" 
                className="radio-button__input" 
                id={`radio-${text}`} 
                name={groupName}
                onChange={() => setMethod(text)} 
                checked={state === text} 
            />
            <label className="radio-button__label" htmlFor={`radio-${text}`}>
                <span className="radio-button__custom"></span>
                {text}
            </label>
        </div>
    );
};

RadioButton.propTypes={
    text:PropTypes.string,
    setMethod:PropTypes.func,
    state:PropTypes.string,
    groupName:PropTypes.string,
}
export default RadioButton;