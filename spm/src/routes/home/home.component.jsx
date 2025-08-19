import './home.styles.scss';
import userPic from '../../assets/user-account-person-avatar-svgrepo-com.svg';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import { useGlobalUserDataContext } from '../../contexts/global-user-data.context';
import AddPasswordDialog from '../../components/add-password-dialog/add-password-dialog.component';
import AsyncLoader from '../../components/async-loader/async-loader.component';
import { FaChevronRight,FaStar } from "react-icons/fa6";
import { RiAiGenerate,RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAssessment,MdOutlinePublic, MdReportGmailerrorred } from "react-icons/md";
import { CgDatabase } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { FaThList } from "react-icons/fa";
import { userTypeIndicatorsPlaceholdersColors } from '../../utils/helpers/helpers';

const nameArray=['Add passwords','Generate passwords','Check password strength','Security Settings','Compromised Passwords','Public information'];
const iconArray=[CgDatabase,RiAiGenerate,MdOutlineAssessment,RiLockPasswordLine,MdReportGmailerrorred,MdOutlinePublic];
const userTypeIndicatorsPlaceholdersObject={
    free:'F',
    premium:'P',
    enterprise:'E'
}
const stateText={
    "loading":"Getting things ready",
    "error":"Error occured! Try again later",
    "empty":"Nothing yet!"
}

const Home = () => {
    const {user,isNewGoogleAuthUser}=useUserAuthContext(); 
    const {userData,userDataState}=useGlobalUserDataContext();
    const router = useNavigate();

    if(userDataState === "loading" || userDataState === "empty" || userDataState === "error"){
            return <AsyncLoader text={stateText[userDataState]} ls={"70px"} type={userDataState} />
        }
       
    return ( 
        <div className='home-div'>
        <div className='container'>
            <div className='header'>
                <p>Welcome back,</p>
                <div className='user-type' style={{color:userTypeIndicatorsPlaceholdersColors[userData?.subscriptionPlan ?? 'free']}}>
                    {userTypeIndicatorsPlaceholdersObject[userData?.subscriptionPlan ?? 'free']}
                </div>
                <img src={userPic} />
                <h1 className={(user?.displayName?.length>10 || userData?.name?.length>10) && `small`}>{user?.displayName || userData?.name || "Figerland shanks"}</h1>
            </div>
            <div className='main'>
                <div className='parent'>
                <div onClick={()=>router('all-passwords')} className='bs'>
                    <div className='head-next'>
                        <p>All passwords</p>
                        <FaChevronRight/>
                    </div>
                    <div className='overview'>
                    <div>
                    <FaThList/>
                    {userData?.passwordsCount || 0} Entries
                    </div>
                    <div className='favs'>
                    <FaStar />
                    {userData?.favouritesCount || 0} Favourites
                    </div>
                    </div>
                </div>
                <div onClick={()=>router('password-health')} className='bs'>
                <div className='head-next'>
                        <p>Password Health</p>
                        <FaChevronRight/>
                    </div>
                    <div className='colors'>
                        <div className='green'></div>
                        <div className='yellow'></div>
                        <div className='red'></div>
                    </div>
                </div>
                </div>
                <div className='blocks'>
                {iconArray.map((Icon,index)=>{
                    let routeName = nameArray[index].replace(/\s/g,'-').toLowerCase();
                    // Special case for Compromised Passwords tile
                    if (routeName === 'compromised-passwords') routeName = 'compromised-passwords';
                    return <div key={`app-tile-spm-${index}`} className={`bs app-tile-${index}`} onClick={()=>router(routeName)}>
                        <div>
                            <Icon className='icon' />
                        </div>
                        <div className='name'>{nameArray[index]}</div>
                        <div className='angle'><FaChevronRight/></div>
                    </div>
                })}    
                </div>
            </div>
            </div>
            {(isNewGoogleAuthUser || !userData?.hasMasterPassword) && <AddPasswordDialog/>}
        </div>
     );
}
 
export default Home;