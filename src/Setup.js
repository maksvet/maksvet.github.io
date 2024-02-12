import React, { useState } from 'react';
import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_SECRET_KEY;

export const Setup = ({ onKeySubmit }) => {
    const [key, setKey] = useState('');

    const handleSubmit = () => {
        const encryptedKey = CryptoJS.AES.encrypt(key, secretKey).toString();
        localStorage.setItem('accessKey', encryptedKey);
        onKeySubmit();
    };

    return (
        <div>
            <input type="text" value={key} onChange={e => setKey(e.target.value)} />
            <button onClick={handleSubmit}>Submit Key</button>
        </div>
    );
};

export const checkKey = () => {
    const encryptedKey = localStorage.getItem('accessKey');
    if (!encryptedKey) return false;

    const bytes  = CryptoJS.AES.decrypt(encryptedKey, secretKey);
    const originalKey = bytes.toString(CryptoJS.enc.Utf8);

    // Add your own logic to validate the key
    return originalKey && originalKey.length > 0;
};