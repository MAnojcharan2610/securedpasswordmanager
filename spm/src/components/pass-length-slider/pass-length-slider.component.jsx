import PropTypes from 'prop-types';
import './pass-length-slider.styles.scss';
const PassLengthSlider = ({length,handleSetLength}) => {
    return ( 
        <div className='pass-length-slider-div'>
            <p>Password length</p>
            <input type="range" min="0" max="40" value={length} onChange={(e)=>handleSetLength(Number(e.target.value))} className="range-slider" id="myRange"></input>
            <h3>{length}</h3>
        </div>
     );
}
PassLengthSlider.propTypes={
    length:PropTypes.number,
    handleSetLength:PropTypes.func,
}
export default PassLengthSlider;