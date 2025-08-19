import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const DocsContext = createContext();
export const DocsProvider=({children})=>{
    const [activeStep,setActiveStep]=useState(0);
    const handleSetActiveStep=(val)=>setActiveStep(val);
    return(
        <DocsContext.Provider value={{activeStep,handleSetActiveStep}}>
            {children}
        </DocsContext.Provider>
    )
}
DocsProvider.propTypes={
    children:PropTypes.node,
}
export const useDocsContext =()=>useContext(DocsContext);