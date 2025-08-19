import { FaLock,FaKey,FaDatabase,FaShield,FaUser,FaEye, } from 'react-icons/fa6';
import { FiRefreshCw } from "react-icons/fi";
export const separatorArray=['!','@','#','$','%','^','&','*','-',')','(','+','_','.','/'];
export const userTypeIndicatorsPlaceholdersColors={
    free:'lightgray',
    premium:'rgb(244, 228, 47)',
    enterprise:'rgb(244, 162, 47)'
}
export const baseInfo={
    Password:"None",
    Guesses:"None",
    Guesses_log10:"None",
    Pattern:"None",
    Matched_word:"None",
    Dictionary_name:"None"
}
export const defaultChecklist={
    has8Characters:false,
    hasUpperCase:false,
    hasLowercase:false,
    hasNumbers:false,
    hasSymbols:false
}
export const passwordCriteriaArray=['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','0123456789','!@#$%^&*()_+=-`~[]\\{}|;\':",./<>?'];
export const statusColors=["rgb(252, 121, 121)","orange","rgb(235, 230, 75)","rgb(192, 236, 73)","rgb(113, 225, 52)","rgb(122, 121, 121)"];
export const progressDotColors=['rgb(156, 7, 7)','rgb(156, 72, 7)','rgb(156, 131, 7)','rgb(114, 156, 7)','rgb(34, 156, 7)'];
export const statusCodeName=['very weak','weak','moderate','strong','very Strong','status'];
export const crackTimeCodeNames={
    online_throttling_100_per_hour:"Unknown time",
    online_no_throttling_10_per_second:"Unknown time",
    offline_slow_hashing_1e4_per_second:"Unknown time",
    offline_fast_hashing_1e10_per_second:"Unknown time"
}
export const crackTimeInterfaceNames=["Online, limited attempts","Online, no limits","Offline, slow hashing","Offline, fast hashing"];
export const passwordCheckList=['Contains atleast 8 characters','Contains uppercase letters (A-Z)','Contains lowercase letters (a-z)','Contains numbers (0-9)','Contains symbols (`~!@#$%^&*()=+-*/|.,_?)'];
export const steps = [
    {
        title: "Master Password Creation",
        icon: FaUser,
        description: "Your master password is the key to your vault. It's never stored anywhere in our application - not even in encrypted form. We only use it to derive your unique encryption key.",
        detail: "We recommend using a strong, memorable passphrase that's at least 10 characters long with a mix of words, numbers, and special characters."
    },
    {
        title: "Key Derivation",
        icon: FaKey,
        description: "When you enter your master password, we use PBKDF2 with 1,25,000+ iterations to create your encryption key.",
        detail: "This process happens in an isolated Web Worker thread to keep the application responsive. A unique random salt is generated for each password to ensure maximum security."
    },
    {
        title: "Password Encryption",
        icon: FaLock,
        description: "Your passwords are encrypted using AES-256, the industry standard encryption algorithm trusted by governments and security experts worldwide.",
        detail: "Each password is encrypted independently, meaning even if one password was somehow compromised, your other passwords remain secure."
    },
    {
        title: "Secure Storage",
        icon: FaDatabase,
        description: "Only encrypted data is ever stored. We never save your master password or the encryption key derived from it.",
        detail: "Each encrypted password is stored with its unique salt. Without your master password, the encrypted data is just random characters - impossible to decrypt even with direct database access."
    },
    {
        title: "Password Retrieval",
        icon: FaEye,
        description: "When you need to view a password, we temporarily derive your encryption key again and decrypt only that password.",
        detail: "Decrypted passwords are never stored persistently. They exist in memory only for the moment you need them, then are cleared."
    },
    {
        title: "Security Timeouts",
        icon: FiRefreshCw,
        description: "Your encryption key is automatically cleared after 7 minutes of inactivity.",
        detail: "You can also manually lock your vault at any time for immediate security. After a timeout, you'll need to enter your master password again to view any passwords."
    },
    {
        title: "Zero-Knowledge Architecture",
        icon: FaShield ,
        description: "Our application is built on zero-knowledge principles. Even we can't access your passwords.",
        detail: "All encryption and decryption happens locally on your device. Your master password and encryption keys never leave your computer."
    }
];