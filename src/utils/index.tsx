const CryptoJS = require("crypto-js");
export function encryptPassword(password: string) {
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;
    return CryptoJS.AES.encrypt(password, privateKey).toString();
}