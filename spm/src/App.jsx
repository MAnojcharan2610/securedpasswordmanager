import { Fragment,useEffect, useState } from "react"
import { Routes,Route,Navigate } from "react-router-dom"
import { auth, signOutUser } from "./utils/firebase/firebase";
import {useUserAuthContext} from './contexts/user-auth.context';
import { onAuthStateChanged } from "firebase/auth";
import Home from './routes/home/home.component';
import Intro from './routes/intro/intro.component'
import CreateUser from "./routes/create-user/create-user.component";
import Auth from "./routes/auth/auth.component";
import Menubar from "./components/menubar/menubar.component";
import PropTypes from "prop-types";
import User from "./routes/user/user.component";
import PasswordHealth from './routes/password-health/password-health.component'
import AllPasswords from "./routes/all-passwords/all-passwords.component";
import AuthLoader from './components/auth-loader/auth-loader.component';
import GeneratePasswords from './routes/generate-passwords/generate-passwords.component';
import CheckPasswordStrength from './routes/check-password-strength/check-password-strength.component';
import AddPasswords from './routes/add-passwords/add-passwords.component';
import SecuritySettings from "./routes/security-settings/security-settings.component";
import InfoDocs from "./routes/info-docs/info-docs.component";
import PasswordEntry from "./routes/password-entry/password-entry.component";
import ChangeMasterPassword from "./routes/change-master-password/change-master-password.component";
import { useGlobalDataContext } from './contexts/global-data.context';
import { useKeyGenerationContext } from "./contexts/key-generation.context";
import { isPasswordPwned } from "./utils/helpers/breachCheck";

const CompromisedPasswordsDynamic = () => {
  const { globalPasswordData } = useGlobalDataContext();
  const { userKeys } = useKeyGenerationContext();
  const [compromisedPasswords, setCompromisedPasswords] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkPasswords = async () => {
      setIsChecking(true);
      const results = [];
      for (const item of globalPasswordData) {
        try {
          if (!userKeys) continue;
          const { handleKeySelectionAndDecryptionProcess } = await import("./utils/helpers/globalFunctions");
          const decrypted = await handleKeySelectionAndDecryptionProcess(item, userKeys);
          const isCompromised = await isPasswordPwned(decrypted);
          const { ref, update, get } = await import("firebase/database");
          const { realtimeDb } = await import("./utils/firebase/firebase");
          const userPasswordRef = ref(realtimeDb, `userPasswords/${item.userId || item.uid || ''}/${item.key}`);

          // Always fetch the latest password details
          const snapshot = await get(userPasswordRef);
          const passwordData = snapshot.val();

          if (isCompromised) {
            // Persist flag in Firebase
            await update(userPasswordRef, {
              isCompromised: true,
            });
            results.push({
              ...item,
              isCompromised: true,
            });
          } else if (passwordData?.isCompromised) {
            // If password is no longer compromised (changed by user), clear flag
            await update(userPasswordRef, {
              isCompromised: null,
            });
          }
        } catch {
          // Ignore errors for individual passwords
        }
      }
      setCompromisedPasswords(results);
      setIsChecking(false);
    };
    if (globalPasswordData.length && userKeys) {
      checkPasswords();
    }
  }, [globalPasswordData, userKeys]);

  const handleChangePassword = async (item) => {
    const newPassword = prompt(`Enter a new password for ${item.inputSite}:`);
    if (!newPassword) {
      alert("Password change canceled.");
      return;
    }
    await updatePasswordInFirebase(item.key, newPassword);
    alert("Password changed successfully.");
  };

  const updatePasswordInFirebase = async (key, newPassword) => {
    try {
      const { ref, update } = await import("firebase/database");
      const { realtimeDb } = await import("./utils/firebase/firebase");
      const userPasswordRef = ref(realtimeDb, `userPasswords/${auth.currentUser.uid}/${key}`);

      // Update the password in Firebase
      await update(userPasswordRef, {
        password: newPassword,
        isCompromised: null, // Clear the compromised flag
      });

      console.log("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="compromised-passwords-div">
      <h1>Compromised Passwords</h1>
      <p>Below are passwords that have been compromised in the past or are at risk in the future.</p>
      {isChecking ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <span>Checking passwords against breach database...</span>
        </div>
      ) : (
        <table className="compromised-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {compromisedPasswords.length === 0 ? (
              <tr>
                <td colSpan={3}>No compromised passwords found.</td>
              </tr>
            ) : (
              compromisedPasswords.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.inputSite}</td>
                  <td>{item.inputUsername}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                      onClick={() => handleChangePassword(item)}
                    >
                      Change Password
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuthContext();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useUserAuthContext();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const {user,handleSetUser}=useUserAuthContext();
  const [isLoading,setIsLoading]=useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user){
          handleSetUser(user);
          setIsLoading(false);
        }else{
          setIsLoading(false);
          handleSetUser(null);
        }
      });
      return () => unsubscribe();
    };
    setIsLoading(true);
    checkAuthState();      
  }, [handleSetUser]);

  if(isLoading){
    return <AuthLoader/>
  }

  return (
    <Fragment>
    <Routes>
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Menubar />
            </ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="generate-passwords" element={<GeneratePasswords/>} />
          <Route path="check-password-strength" element={<CheckPasswordStrength/>} />
          <Route path="security-settings" element={<SecuritySettings/>} />
          <Route path="add-passwords" element={<AddPasswords/>} />
          <Route path="user" element={<User/>} />
          <Route path="password-health" element={<PasswordHealth/>} />
          <Route path="all-passwords" element={<AllPasswords/>} />
          <Route path="public-information" element={<InfoDocs/>} />
          <Route path="password-entry/:key" element={<PasswordEntry/>} />
          <Route path="change-master-password" element={<ChangeMasterPassword/>} />
          <Route path="compromised-passwords" element={<CompromisedPasswordsDynamic/>} />
        </Route>

        <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute> }/>

        <Route path="/create-user" element={
            <PublicRoute>
              <CreateUser />
            </PublicRoute>}/>

        <Route path="/" element={
            <PublicRoute>
              <Intro />
            </PublicRoute>}/>

        <Route path="/signout" element={<button onClick={signOutUser}>Sign Out</button>} />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Fragment>
  )
}
ProtectedRoute.propTypes={
  children:PropTypes.node,
}
PublicRoute.propTypes={
  children:PropTypes.node,
}
export default App
