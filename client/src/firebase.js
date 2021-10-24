// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    api_Key: process.env.REACT_APP_APIKEY,
    auth_Domain: process.env.REACT_APP_AUTHDOMAIN,
    project_Id: process.env.REACT_APP_PROJECT_ID,
    storage_Bucket: process.env.REACT_APP_STORAGE_BUCKET,
    messaging_SenderId: process.env.REACT_APP_MESSAGESENDERID,
    app_Id: process.env.REACT_APP_APPID,
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
export default firebaseapp;
