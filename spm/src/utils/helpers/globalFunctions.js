import { realtimeDb } from "../firebase/firebase";
import { update,ref } from "firebase/database";
import { auth } from "../firebase/firebase";
import { encryptData,decryptData } from "./hash";

const updateDb=async(isFavourite,key,favCount)=>{
        try {
            const currentCount = favCount || 0;
            const favouritesCount = isFavourite ? currentCount - 1 : currentCount + 1;
            const updates = {};
            updates[`users/${auth.currentUser.uid}/favouritesCount`] = favouritesCount;
            updates[`userPasswords/${auth.currentUser.uid}/${key}/isFavourite`] = !isFavourite;
            await update(ref(realtimeDb), updates);
          } catch (error) {
            console.error("Error updating favourites:", error);
            throw error;
          }
    }

export const handleFavClick=async(isFavourite,key,favCount)=>{
        try{
            await updateDb(isFavourite,key,favCount)
            return 1;
        }catch(e){
            console.error(e)
            return 0;
        }
    }

export const handleKeySelectionAndEncryptionProcess=async(userKeys,encryptionMethod,inputPassword)=>{
    const key = encryptionMethod === "AES-128" ? await crypto.subtle.importKey(
        "raw",
        userKeys.userAes128Key,
        {name:"AES-GCM"},
        true,
        ["encrypt","decrypt"]
    ) : await crypto.subtle.importKey(
        "raw",
        userKeys.userAes256Key,
        {name:"AES-GCM"},
        true,
        ["encrypt","decrypt"]
    );
    const {iv,cipherText}= await encryptData(inputPassword,key);
    return {iv,cipherText};
}

export const handleKeySelectionAndDecryptionProcess=async(passwordEntry,userKeys)=>{
    const decryptionKey = passwordEntry.encryptionMethod === "AES-128"
    ? await crypto.subtle.importKey(
        "raw",
        userKeys.userAes128Key,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
        )
    : await crypto.subtle.importKey(
        "raw",
        userKeys.userAes256Key,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
        );
    const decrypted = await decryptData(passwordEntry.cipherText, passwordEntry.iv, decryptionKey);
    return decrypted;
}