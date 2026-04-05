import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { onMessage } from "firebase/messaging";

export const setupForegroundNotification = () => {

  onMessage(messaging, (payload) => {

    console.log("📩 Message received:", payload);

    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/logo192.png"
    });

  });

};

const firebaseConfig = {
  apiKey:  "AIzaSyDrJXbDm2tOyVMc3Pgq4YhYfPgipZlobhM",
  authDomain:  "smart-task-manager-33340.firebaseapp.com",
  projectId: "smart-task-manager-33340",
  storageBucket: "smart-task-manager-33340.appspot.com",
  messagingSenderId: "48769083227",
  appId: "1:48769083227:web:766d46923f5ffb7ad6dc7e"
};

const app = initializeApp(firebaseConfig);

// ✅ THIS LINE IS IMPORTANT
export const messaging = getMessaging(app);