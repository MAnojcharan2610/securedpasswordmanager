import PropTypes from 'prop-types';
import './delete-password-dialog.styles.scss';
import { FcFullTrash } from "react-icons/fc";
import Loader from '../loader/loader.component';

const DeletePasswordDialog = ({site="site",setIsDeletePasswordDialogOpen,deleteDialogRef,isLoading,handleEntryDelete}) => {
    return (  
        <div className='overlaying'>
        <div className='delete-password-dialog-div' ref={deleteDialogRef}>
            <FcFullTrash className='icon' />
            <h4>Delete password entry</h4>
            <p>{site}</p>
            <div className='btns'>
                <button className='c-btn' onClick={()=>setIsDeletePasswordDialogOpen(false)}>Cancel</button>
                <button className='c-btn' onClick={handleEntryDelete}>
                    {!isLoading ? "Delete" : <Loader lh={"25px"} lw={"25px"} />}
                </button>
            </div>
        </div>
        </div>
    );
}
DeletePasswordDialog.propTypes={
    site:PropTypes.string,
    setIsDeletePasswordDialogOpen:PropTypes.func,
    deleteDialogRef:PropTypes.shape({
        current:PropTypes.instanceOf(Element)
    }),
    isLoading:PropTypes.bool,
    handleEntryDelete:PropTypes.func,
}
export default DeletePasswordDialog;