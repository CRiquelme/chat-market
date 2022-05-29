import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoBy5jilV8vK3_-TQskRB_C8XAveDlG38",
  authDomain: "fin-calendario-vue.firebaseapp.com",
  projectId: "fin-calendario-vue",
  storageBucket: "fin-calendario-vue.appspot.com",
  messagingSenderId: "356422000152",
  appId: "1:356422000152:web:2996fad76f07b438e02d6d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
auth.languageCode = 'es';

async function login(){
    try {
        const response = await auth.signInWithPopup(provider);
        console.log(response);
        return response.user;
    } catch (error) {
        throw new Error(error);
    }
}

function logout() {
    auth.signOut();
}

const btnLogin = document.querySelector('#btn-login');
const btnLogout = document.querySelector('#btn-logout');
const hiUser = document.querySelector('#hi-user');
const calendario = document.querySelector('#calendario');
const solicitudes = document.querySelector('#tablaSolicitudes');
export let currentUser;

firebase.auth().onAuthStateChanged(user => {
  if (user){
    currentUser = user;
    init();
  }
});

btnLogin.addEventListener("click", async () => {
  try {
     currentUser = await login();
     console.log(currentUser);
  } catch (error) {console.log(error);}
});

btnLogout.addEventListener('click', () => {
  logout();
  btnLogin.classList.remove('d-none');
  btnLogout.classList.add('d-none');
  hiUser.innerHTML = "";
  hiUser.classList.add('d-none');
  calendario.classList.add('d-none');
  solicitudes.classList.add('d-none');
});

function init(){
  btnLogin.classList.add('d-none');
  btnLogout.classList.remove('d-none');

  hiUser.innerHTML = `<h4 class="me-2 d-inline">Hola, ${currentUser.displayName}</h4><img class="rounded-circle mt-2" src="${currentUser.photoURL}" width="40"/>`;
  hiUser.classList.remove('d-none');
  calendario.classList.remove('d-none');
  solicitudes.classList.remove('d-none');
}
