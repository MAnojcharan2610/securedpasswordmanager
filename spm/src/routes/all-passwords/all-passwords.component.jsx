import './all-passwords.styles.scss';
import AsyncLoader from '../../components/async-loader/async-loader.component';
import {  useState,useMemo } from 'react';
import ToggleSwitch from '../../components/toggle-switch/toggle-switch.component';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useGlobalDataContext } from '../../contexts/global-data.context';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';
import PasswordTile from '../../components/password-tile/password-tile.component';

const stateText={
    "loading":"Getting things ready",
    "error":"Error occured! Try again later",
    "empty":"Nothing yet!"
}

const AllPasswords = () => {
    
    const [inputValue,setInputValue]=useState('');
    const [showFavourites,setShowFavourites]=useState(false);
    const {isAuthenticatedWithPassword}=useUserAuthContext();
    const {globalPasswordData,passwordsState}=useGlobalDataContext();

    const filteredPasswords = useMemo(() => {
        return globalPasswordData
          .filter(obj =>
            obj.inputSite.toLowerCase().startsWith(inputValue.toLowerCase())
          )
          .filter(obj => (showFavourites ? obj.isFavourite : true));
      }, [globalPasswordData, inputValue, showFavourites]);

    if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

    if(passwordsState === "loading"  || passwordsState === "error" || passwordsState === "empty"){
        return <AsyncLoader text={stateText[passwordsState]} ls={"70px"} type={passwordsState} />
    }


    return ( 
        <div className='all-passwords-div'>
            <h1>All passwords</h1>
            <div className='opts'>
                <div >
                    <input maxLength={100} type='search' placeholder='search by site' className='c-input' value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
                </div>
                <div className='favs'>
                    <span>Favourites</span>
                    <ToggleSwitch bool={showFavourites} set={setShowFavourites} />
                </div>
            </div>
            <div className='main'>
                {filteredPasswords.map((d)=>{
                    return <PasswordTile d={d}  key={d.key} /> 
                })}
            </div>
        </div>
     );
}
 
export default AllPasswords;