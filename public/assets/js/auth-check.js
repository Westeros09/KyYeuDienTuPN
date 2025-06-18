import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo3wgNxCadkszkEP6ymnjFi4HIvVVktbU",
    authDomain: "kyyeu-phunhuan.firebaseapp.com",
    projectId: "kyyeu-phunhuan",
    storageBucket: "kyyeu-phunhuan.firebasestorage.app",
    messagingSenderId: "440890277287",
    appId: "1:440890277287:web:f00fcf9b017978f94c4a82",
    measurementId: "G-JVX3GKQ32P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Nếu chưa đăng nhập → chuyển trang
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

window.logout = function () {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};
