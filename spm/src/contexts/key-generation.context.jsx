import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useState } from "react";
import { useUserAuthContext } from "./user-auth.context";
import { useToast } from "./toast-context.context";

const KeyGenerationContext=createContext();
export const KeyGenerationProvider=({children})=>{

    const [userKeys,setUserKeys]=useState(null);
    const {handleSetIsAuthenticatedWithPassword}=useUserAuthContext();
    const {showToast}=useToast();
    const [timeoutId,setTimeoutId]=useState(null);
    const handleSetUserKeys=(val)=>setUserKeys(val)

    const generateKeysFromPassword = useCallback((password,salt)=>{
        return new Promise((resolve,reject)=>{
            const worker = new Worker(new URL("../utils/web-workers/keyWorker.js",import.meta.url))
            
            worker.postMessage({password,salt});
            worker.onmessage=(event)=>{
                if(event.data.error){
                    reject(event.data.error);
                }else{
                    const timeout =setTimeout(()=>{
                        setUserKeys(null);
                        handleSetIsAuthenticatedWithPassword(false)
                        showToast("security reset")
                    },420000)
                    setTimeoutId(timeout);
                    setUserKeys({
                        userAes128Key:event.data.aes128Key,
                        userAes256Key:event.data.aes256Key
                    })
                    resolve({
                        aes128Key:event.data.aes128Key,
                        aes256Key:event.data.aes256Key,
                        cancelTimeout:()=>{
                            clearTimeout(timeout);
                            setTimeoutId(null);
                        }
                    });
                }
                worker.terminate();
            }
            worker.onerror=(error)=>{
                reject(error.message);
                worker.terminate();
            }
        })
    },[]);

    return(
        <KeyGenerationContext.Provider value={{
            userKeys,
            generateKeysFromPassword,
            handleSetUserKeys
        }}>
            {children}
        </KeyGenerationContext.Provider>
    )
}
KeyGenerationProvider.propTypes={
    children:PropTypes.node,
}
export const useKeyGenerationContext=()=>useContext(KeyGenerationContext);