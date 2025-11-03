import { useGlobalDataContext } from '../../contexts/global-data.context';
import './compromised-passwords.styles.scss';
import {isPasswordPwned} from '../../utils/helpers/breachCheck';
import { useEffect, useState } from 'react';
import { handleKeySelectionAndDecryptionProcess } from '../../utils/helpers/globalFunctions';
import { useKeyGenerationContext } from '../../contexts/key-generation.context';
import { useUserAuthContext } from '../../contexts/user-auth.context';
import AuthenticationForm from '../../components/authentication-form/authentication-form.component';

const CompromisedPasswords = () => {
  const { globalPasswordData } = useGlobalDataContext();
  const {userKeys}=useKeyGenerationContext();
  const [compromisedPasswords, setCompromisedPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const {isAuthenticatedWithPassword}=useUserAuthContext();
  
  useEffect(()=>{
    if(isAuthenticatedWithPassword && userKeys){
      checkPasswords();
    }
  },[userKeys,isAuthenticatedWithPassword])

  const checkPasswords = async () => {
    
    setLoading(true);
    setChecking(true);
    const results = [];

    try {
      for (const passwordEntry of globalPasswordData) {
        try {
          const decryptedPassword = await handleKeySelectionAndDecryptionProcess(
            passwordEntry,
            userKeys
          );
          const isPwned = await isPasswordPwned(decryptedPassword);
          if (isPwned) {
            results.push({
              service: passwordEntry.inputSite,
              username: passwordEntry.inputUsername,
              timestamp: passwordEntry.timestamp,
              status: 'Compromised',
            });
          }
        } catch (error) {
          console.error(
            `Error checking password for ${passwordEntry.inputSite}:`,
            error
          );
        }
      }

      setCompromisedPasswords(results);
    } catch (error) {
      console.error('Error checking passwords:', error);
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleRefresh = () => {
    if(isAuthenticatedWithPassword && userKeys){
      checkPasswords();
    }
  };
  if(!isAuthenticatedWithPassword){
        return <AuthenticationForm />
    }

  return (
    <div className="compromised-passwords-div">
      <div className="header-section">
        <div className="header-content">
          <h1>Compromised Passwords</h1>
          <p>
            Passwords found in data breaches are checked against the Have I Been
            Pwned database.
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={checking}
        >
          <svg
            className={checking ? 'spinning' : ''}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          {checking ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Checking passwords for breaches...</p>
        </div>
      ) : compromisedPasswords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h3>All Clear!</h3>
          <p>None of your passwords were found in known data breaches.</p>
        </div>
      ) : (
        <>
          <div className="alert-banner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              {compromisedPasswords.length} password
              {compromisedPasswords.length > 1 ? 's' : ''} found in data breaches
            </span>
          </div>

          <div className="table-container">
            <table className="compromised-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Username</th>
                  <th>Added Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {compromisedPasswords.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="service-cell">
                        <div className="service-icon">
                          {item.service.charAt(0).toUpperCase()}
                        </div>
                        <span className="service-name">{item.service}</span>
                      </div>
                    </td>
                    <td className="username-cell">{item.username}</td>
                    <td className="date-cell">{formatDate(item.timestamp)}</td>
                    <td>
                      <span className="status-badge status-compromised">
                        <span className="status-dot"></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="recommendation-box">
            <h3>Recommended Actions</h3>
            <ul>
              <li>Change these passwords immediately</li>
              <li>Use unique passwords for each service</li>
              <li>Enable two-factor authentication where available</li>
              <li>Consider using a password generator for stronger passwords</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CompromisedPasswords;
