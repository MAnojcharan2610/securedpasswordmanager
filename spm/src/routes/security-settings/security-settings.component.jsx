import './security-settings.styles.scss'
import { useUserAuthContext } from '../../contexts/user-auth.context';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';
import AsyncLoader from '../../components/async-loader/async-loader.component';
import { MdPassword } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const dataArray=[
    {
        Icon:MdPassword,
        description:'Change your master password to enhance account security. This password controls access to all your saved data.',
        route:'change-master-password',
        sText:'Change password',
        // backgroundImageColor:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImageColor:'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'
    },
    // {
    //     Icon:MdPassword,
    //     description:'Change your master password to enhance account security. This password controls access to all your saved data.',
    //     route:'change-master-password',
    //     sText:'Change password',
    //     backgroundImageColor:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    //     // backgroundImageColor:'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)'
    // },
]

const SecuritySettings = () => {
    const {isAuthenticatedWithPassword}=useUserAuthContext();
    const router = useNavigate();

    if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

        // return <AsyncLoader text={"Nothing Yet!"} type={"empty"} />
    
    
    return ( 
        <div className='security-settings-div'>
            <h1>Security settings</h1>
            <div className='main'>
                {dataArray.map((d,i)=>{
                    return <div key={`security-settings-option-${i}`} className='tile' style={{backgroundImage:d.backgroundImageColor}} onClick={()=>router(`/dashboard/${d.route}`)}>
                        <d.Icon/>
                        <p>{d.description}</p>
                        <span>{d.sText}</span>
                    </div>
                })}
            </div>
        </div>
     );
}
 
export default SecuritySettings;