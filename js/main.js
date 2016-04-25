import SlovaregPage from './SlovaregPage';
import FirebaseDict from './FirebaseDict';

import React from 'react';
import ReactDOM from 'react-dom';

var fb = new FirebaseDict(new Firebase('https://slovareg.firebaseio.com/'));
var ref = fb.getRef();

const handleLogin = (login, password) =>
  new Promise((resolve, reject) => {
    ref.authWithPassword({
      email: login,
      password: password
    }, resolve);
  });

const handleLogout = () => {
  ref.unauth();
};

ref.onAuth(authData => {
  ReactDOM.render(<SlovaregPage fb={fb}
                                onLogin={handleLogin}
                                onLogout={handleLogout}/>,
                  document.getElementById('content'));
});
