import React, { useEffect } from 'react';
import firebase from 'firebase/compat/app';

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

// Import Firebase Configuration file
import { initFirebaseBackend } from "./helpers/firebase_helper";
import { useDispatch } from 'react-redux';
import { profileSuccess } from './slices/auth/profile/reducer';
import { loginSuccess } from './slices/auth/login/reducer';

const firebaseConfig = {
  apiKey: "AIzaSyAWl41GWOVUThH8StZim3WgeRBR1sIYOCM",
  authDomain: "salespulse-3d214.firebaseapp.com",
  projectId: "salespulse-3d214",
  storageBucket: "salespulse-3d214.appspot.com",
  messagingSenderId: "1015654820596",
  appId: "1:1015654820596:web:e8abcb245e090c82748ca1",
  measurementId: "G-GHDYNNNVVM"
};


// init firebase backend
initFirebaseBackend(firebaseConfig);

function App() {
  const dispatch = useDispatch();

  const storeUserObject = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // After authentication with Firebase
        // a non plain JS object is sent.
        // see this https://github.com/maxmantz/redux-oidc/issues/169
        localStorage.setItem("authUser", JSON.stringify(user));
        dispatch(profileSuccess(JSON.stringify(user)));
        dispatch(loginSuccess(JSON.stringify(user)));
      } else {
        localStorage.removeItem("authUser");
      }
    });
  };

  useEffect(() => {
    storeUserObject();
  }, [firebase]);

  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
