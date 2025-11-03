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
import CompromisedPasswords from "./routes/compromised-passwords/compromised-passwords.component";

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
          <Route path="compromised-passwords" element={<CompromisedPasswords/>} />
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
