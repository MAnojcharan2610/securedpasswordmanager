import bcrypt from 'bcryptjs';

export const hashPassword=(password)=>{
    const salt= bcrypt.genSaltSync(10);
    return  bcrypt.hashSync(password,salt);
}

export const compareHashPassword=async(password,hash)=>{
   try{
    const match = await bcrypt.compare(password,hash);
    if(match){
        return "match"
    }else{
        return "unmatch"
    }
   }catch(e){
    console.error(e);
    return "error"
   }
}

export const arrayBufferToBase64=(buffer)=>{
    let binary='';
    const bytes = new Uint8Array(buffer);
    const len = bytes.length;
    for(let i=0;i<len;i++){
        binary+=String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const base64ToArrayBuffer=(base64)=>{
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for(let i=0;i<len;i++){
        bytes[i]=binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export const encryptData=async(plainText,key)=>{
    //gen random initialization vector - 12 bytes
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    //encrypt pass with AES-GCM 
    const cipherBuffer = await crypto.subtle.encrypt(
        {
            name:"AES-GCM",
            iv,
        },
        key,
        data
    );

    // converting iv and ciphertext to Base64
    return{
        iv:arrayBufferToBase64(iv),
        cipherText:arrayBufferToBase64(cipherBuffer),
    }
}

export const decryptData=async(cipherText,iv,key)=>{
    const ivBuffer = base64ToArrayBuffer(iv);
    const cipherBuffer = base64ToArrayBuffer(cipherText);
    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name:"AES-GCM",
            iv:new Uint8Array(ivBuffer)
        },
        key,
        cipherBuffer
    );
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}