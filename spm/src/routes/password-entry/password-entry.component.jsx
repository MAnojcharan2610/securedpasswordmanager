import './password-entry.styles.scss';
import { useParams } from 'react-router-dom';
import { useGlobalDataContext } from '../../contexts/global-data.context';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../contexts/toast-context.context';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { FaRegStar,FaPen } from 'react-icons/fa';
import { FaStar,FaTrash,FaRegCopy } from 'react-icons/fa6';
import Avatar from 'boring-avatars';
import { handleFavClick, handleKeySelectionAndDecryptionProcess,handleKeySelectionAndEncryptionProcess } from '../../utils/helpers/globalFunctions';
import { ref,  update } from 'firebase/database';
import { realtimeDb } from '../../utils/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import DeletePasswordDialog from '../../components/delete-password-dialog/delete-password-dialog.component';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';

const PasswordEntry = () => {
    const {key}=useParams();
    const {globalPasswordData}=useGlobalDataContext();
    const [currentPasswordDetails,setCurrentPasswordDetails]=useState([]);
    const [isEditable,setIsEditable]=useState(false);
    const [isEditingDisabled,setIsEditingDisabled]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {showToast}=useToast();
    const {userData}=useGlobalUserDataContext();
    const {userKeys}=useKeyGenerationContext();
    const {user,isAuthenticatedWithPassword}=useUserAuthContext();
    const [siteName,setSiteName]=useState('');
    const [username,setUserName]=useState('');
    const [initialPassword,setInitialPassword]=useState('');
    const [password,setPassword]=useState('');
    const [isDeletePasswordDialogOpen,setIsDeletePasswordDialogOpen]=useState(false);
    const router = useNavigate();
    const deleteButtonRef =useRef(null);
    const deleteDialogRef = useRef(null);
    
    const handleEditClick=()=>{
        setIsEditable(!isEditable);
        showToast(!isEditable ? "Editor mode":"Readonly mode")
    }
    const handleCopyClick=(text)=>{
        navigator.clipboard.writeText(text)
        showToast("Copied successfully");
    }

    const handleFavouritesClick=(isFavourite,key)=>{
      if(key){
        const result = handleFavClick(isFavourite,key,userData?.favouritesCount)
        showToast(result ? `${!isFavourite ? "Added to favourites": "Removed from favourites"}` : "error occured! Try again later")
      }
    }

    const handleEntryEdit=async()=>{
      const updates={};
      if(siteName !== currentPasswordDetails?.inputSite) updates['inputSite']=siteName;
      if(username !== currentPasswordDetails?.inputUsername) updates['inputUsername']=username;
      if(password!==initialPassword) updates['cipherText']=password;
      if(!Object.keys(updates).length){
        showToast("No changes done")
        return;
      }
      try{
      if(updates.cipherText){
        const {iv,cipherText}=await handleKeySelectionAndEncryptionProcess(userKeys,currentPasswordDetails?.encryptionMethod,password)
        updates['cipherText']=cipherText;
        updates['iv']=iv;
      }
        const userPasswordRef = ref(realtimeDb,`userPasswords/${user.uid}/${currentPasswordDetails.key}`);
        await update(userPasswordRef,updates);
        showToast("Entries updated successfully")
      }catch(e){
        console.error(e);
        showToast("Error editing password details");
      }
    }

    const handleEntryDelete=async()=>{
      setIsLoading(true);
      try{
        const updates={};
        updates[`userPasswords/${user.uid}/${currentPasswordDetails.key}`]=null;
        updates[`users/${user.uid}/passwordsCount`]=userData.passwordsCount-1;
        if(currentPasswordDetails.isFavourite){
          updates[`users/${user.uid}/favouritesCount`]=userData.favouritesCount-1;
        }
        await update(ref(realtimeDb),updates);
        setIsLoading(false);
        setIsDeletePasswordDialogOpen(false);
        router('/dashboard/all-passwords')
        showToast("Password deleted successfully")
      }catch(e){
        console.error(e);
        showToast("Password deletion failed")
      }finally{
        setIsLoading(false);
        setIsDeletePasswordDialogOpen(false);
      }
    }

    useEffect(() => {
        const passwordEntry = globalPasswordData.find(obj => obj.key === key);
        if (passwordEntry) {
          setCurrentPasswordDetails(passwordEntry);
          setSiteName(passwordEntry.inputSite);
          setUserName(passwordEntry.inputUsername);
          
          const decryptPassword = async () => {
            try {
              const decrypted = await handleKeySelectionAndDecryptionProcess(passwordEntry,userKeys);
              setPassword(decrypted);
              setInitialPassword(decrypted);
            } catch (error) {
              console.error("Error during decryption", error);
              showToast("Failed to decrypt password");
              setIsEditingDisabled(true)
            }
          };
    
          if (userKeys) {
            decryptPassword();
          }
        }
      }, [globalPasswordData, key, userKeys]);

      useEffect(()=>{
        if(isDeletePasswordDialogOpen){
          const handleClickOutside =(event)=>{
            if(deleteButtonRef.current && !deleteButtonRef.current.contains(event.target) && deleteDialogRef.current && !deleteDialogRef.current.contains(event.target)){
              setIsDeletePasswordDialogOpen(false);
            }
          }
          document.addEventListener('click',handleClickOutside);
            return ()=>document.removeEventListener('click',handleClickOutside);
        }
      },[isDeletePasswordDialogOpen])

      if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

    return ( 
        <div className='password-entry-div'>
            <h1>
                Password entry
            </h1>
            <div className='main'>
            <div className='options'>
                <div className='pic'>
                    <Avatar variant='marble' colors={["#0a0310", "#49007e", "#ff005b", "#ff7d10", "#ffb238"]} name={currentPasswordDetails?.inputSite} size={"150"} />
                    <span>{currentPasswordDetails?.inputSite?.slice(0,1).toUpperCase()}</span>
                </div>
                <p>{currentPasswordDetails?.inputSite}</p>
                <div className='opts'>
                    <button className='blue c-btn' onClick={handleEditClick} disabled={isEditingDisabled} ><FaPen/></button>
                    <button className='c-btn' ref={deleteButtonRef} onClick={()=>setIsDeletePasswordDialogOpen(true)} ><FaTrash/></button>
                    <button className='c-btn' onClick={()=>handleFavouritesClick(currentPasswordDetails?.isFavourite,currentPasswordDetails?.key)}>{currentPasswordDetails?.isFavourite ?  <FaStar/>  :  <FaRegStar/> } </button>
                </div>
                <span>Created at: {new Date(currentPasswordDetails?.timestamp).toUTCString().replace("GMT",'')}</span>
            </div>
            <div className='fields'>
                <div className='inputs'>
                    <div>
                        <label>Username <span><FaRegCopy onClick={()=>handleCopyClick(username)} /></span></label>
                        <input className='c-input' maxLength={80} value={username}  readOnly={!isEditable} onChange={(e)=>setUserName(e.target.value)} spellCheck={false} />
                    </div>
                    <div>
                        <label>Password <span><FaRegCopy onClick={()=>handleCopyClick(password)} /></span></label>
                        <input className='c-input' maxLength={100} value={password} readOnly={!isEditable} onChange={(e)=>setPassword(e.target.value)} spellCheck={false} />
                    </div>
                    <div>
                        <label>Site <span><FaRegCopy onClick={()=>handleCopyClick(siteName)} /></span></label>
                        <input className='c-input' maxLength={100} value={siteName} readOnly={!isEditable} onChange={(e)=>setSiteName(e.target.value)} spellCheck={false} />
                    </div>
                </div>
                <button className='c-btn confirm-changes' disabled={!isEditable} onClick={handleEntryEdit}>Confirm changes</button>
            </div>
            </div>
            {isDeletePasswordDialogOpen && <DeletePasswordDialog site={siteName} setIsDeletePasswordDialogOpen={setIsDeletePasswordDialogOpen} deleteDialogRef={deleteDialogRef} isLoading={isLoading} handleEntryDelete={handleEntryDelete} />}
        </div>
     );
}
 
export default PasswordEntry;