import { createElement, useEffect } from 'react';
import './info-docs.styles.scss';
import { steps } from '../../utils/helpers/helpers';
import { useDocsContext } from '../../contexts/docs.context';

const classNames=['blue','purple','green','red','yellow','orange','indigo'];
const InfoDocs = () => {

    // const [activeStep,setActiveStep]=useState(0);
    const {activeStep,handleSetActiveStep}=useDocsContext();

      const handleNext = () => {
        if (activeStep < steps.length - 1) {
          handleSetActiveStep(activeStep + 1);
        }
      };
      const handlePrev = () => {
        if (activeStep > 0) {
          handleSetActiveStep(activeStep - 1);
        }
      };

      useEffect(()=>{
        handleSetActiveStep(0)
      },[])

      return (
        <div className="info-docs-div">
          <h1 className="security-title">How We Protect Your Passwords</h1>
          
          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => handleSetActiveStep(index)}
                  className={`progress-step ${
                    index === activeStep 
                      ? 'active' 
                      : index < activeStep 
                        ? 'completed' 
                        : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
    
          <div className="step-card">
            <div className="step-header">
              <div className={`icon-container ${classNames[activeStep]}`}>
                {createElement(steps[activeStep].icon)}
              </div>
              <h2 className="step-title">{steps[activeStep].title}</h2>
            </div>
            <p className="step-description">{steps[activeStep].description}</p>
            <p className="step-detail">{steps[activeStep].detail}</p>
          </div>
    
          <div className="navigation-buttons">
            <button 
              onClick={handlePrev}
              disabled={activeStep === 0}
              className={`nav-button ${activeStep === 0 ? 'disabled' : 'prev'}`}
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className={`nav-button ${activeStep === steps.length - 1 ? 'disabled' : 'next'}`}
            >
              Next
            </button>
          </div>
        </div>
      );
}
 
export default InfoDocs;