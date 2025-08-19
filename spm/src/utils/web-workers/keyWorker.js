self.onmessage=async(event)=>{
    const {password,salt}=event.data;
    try{
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            {name:"PBKDF2"},
            false,
            ["deriveKey"]
        );
        // const iterations = navigator.hardwareConcurrency > 4 ? 200000 : 100000;
        const iterations = 125000;

        const aes128Key = await crypto.subtle.deriveKey(
            {
                name:"PBKDF2",
                salt:encoder.encode(salt+"128"),
                iterations:iterations,
                hash:"SHA-256",
            },
            keyMaterial,
            {name:"AES-GCM",length:128},
            true,
            ["encrypt","decrypt"]
        );

        const aes256Key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt + "256"),
                iterations: iterations,
                hash: "SHA-256",
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedAes128Key = await crypto.subtle.exportKey("raw",aes128Key);
        const exportedAes256Key = await crypto.subtle.exportKey("raw",aes256Key);

        self.postMessage({
            aes128Key:exportedAes128Key,
            aes256Key:exportedAes256Key
        });
    }catch(e){
        self.postMessage({error:e.message});
    }
}