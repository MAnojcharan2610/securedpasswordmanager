import PropTypes from 'prop-types';
import './toggle-switch.styles.scss';
const ToggleSwitch = ({bool,set}) => {
    return ( <label className="t-switch">
        <input type="checkbox" checked={bool} onChange={()=>set(prev=>!prev)} />
        <span className="t-slider"></span>
      </label> );
}
ToggleSwitch.propTypes={
  bool:PropTypes.bool,
  set:PropTypes.func,
}
export default ToggleSwitch;