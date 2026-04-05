importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDrJXbDm2tOyVMc3Pgq4YhYfPgipZlobhM",
  authDomain: "smart-task-manager-33340.firebaseapp.com",
  projectId: "smart-task-manager-33340",
  storageBucket: "smart-task-manager-33340.appspot.com",
  messagingSenderId: "48769083227",
  appId: "1:48769083227:web:766d46923f5ffb7ad6dc7e"
});

const messaging = firebase.messaging();

// 🔥 THIS SHOWS BACKGROUND NOTIFICATION
messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
  });
});