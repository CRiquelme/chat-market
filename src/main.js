import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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
