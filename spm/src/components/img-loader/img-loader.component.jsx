import './img-loader.styles.scss';
import Loader from '../loader/loader.component';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ImgLoader = ({ imgSrc, imgWidth, ls }) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    return ( 
        <div className="img-loader-div" style={{ width: imgWidth }}>
            {!imgLoaded && <Loader lw={ls} lh={ls} pos="absolute" />}
            <img 
                src={imgSrc} 
                width={imgWidth} 
                className={`img ${imgLoaded ? 'fade-in' : 'hidden'}`} 
                onLoad={() => setImgLoaded(true)}
                alt="content"
            />
        </div>
    );
};

ImgLoader.propTypes = {
    imgSrc: PropTypes.string,
    imgWidth: PropTypes.string,
    ls: PropTypes.string
};

export default ImgLoader;
