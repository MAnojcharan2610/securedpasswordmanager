import './password-tile.styles.scss';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import Avatar from 'boring-avatars';
import { handleKeySelectionAndDecryptionProcess } from '../../utils/helpers/globalFunctions';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/toast-context.context';
import { FaRegStar,FaStar } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import { handleFavClick } from '../../utils/helpers/globalFunctions';
import PropTypes from 'prop-types';

const PasswordTile = ({d,isOptionsRequired=true}) => {

    const {userKeys}=useKeyGenerationContext();
    const {userData}=useGlobalUserDataContext();
    const {showToast}=useToast();
    const router = useNavigate();

    const handleCopyClick=async(passwordEntry)=>{
        try{
            const decryptedPassword = await handleKeySelectionAndDecryptionProcess(passwordEntry,userKeys);
            navigator.clipboard.writeText(decryptedPassword);
            showToast("Copied to clipboard");
        }catch(e){
            console.error(e);
            showToast("Error occured please try again")
        }
    }

    const handleFavouritesClick=(isFavourite,key)=>{
        const result = handleFavClick(isFavourite,key,userData?.favouritesCount)
        showToast(result ? `${!isFavourite ? "Added to favourites": "Removed from favourites"}` : "error occured! Try again later")
    }

    return ( 
        <div className='password-tile-div'>
            <div className='pic'>
                <Avatar variant='marble' colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]} name={d.inputSite} size={"42"} />
                <span>{d.inputSite.slice(0,1).toUpperCase()}</span>
            </div>
            <div className='info' onClick={()=>router(`/dashboard/password-entry/${d.key}`)}>
                <p className='bold'>{d.inputSite}</p>
                <p className='small'>{d.inputUsername}</p>
            </div>
            {isOptionsRequired && <div className='arrow' >
                <div onClick={()=>handleCopyClick(d)}>
                <FaRegCopy/>
                </div>
                <div onClick={()=>handleFavouritesClick(d.isFavourite,d.key)}>
                    {!d.isFavourite ? <FaRegStar/> : <FaStar style={{color:"gray"}} />}
                </div>
            </div>}
        </div>
     );
}
PasswordTile.propTypes={
    d:PropTypes.object,
    isOptionsRequired:PropTypes.bool,
    key:PropTypes.string,
}
export default PasswordTile;