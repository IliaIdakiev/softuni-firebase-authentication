(function () {
  const appContainerEl = document.getElementById('app-container');
  const loginContainerEl = document.getElementById('login-container');
  const genericLoginErrorEl = document.getElementById('generic-login-error');
  const appLoaderEl = document.getElementById('app-loader');


  const userEmailEl = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');

  const registerBtn = document.getElementById('register-btn');
  const loginBtn = document.getElementById('login-btn');
  const emailInputEl = document.getElementById('email');
  const passwordInputEl = document.getElementById('password');

  function toggleLoader() {
    if (appLoaderEl.classList.contains('hidden')) {
      appLoaderEl.classList.remove('hidden');
      return;
    }
    appLoaderEl.classList.add('hidden');
  }

  loginBtn.addEventListener('click', function loginHandler() {
    genericLoginErrorEl.textContent = '';
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    if (!email || !password) { alert('Please provide credentials!'); return; }

    toggleLoader();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function () { toggleLoader(); })
      .catch(function (error) {
        toggleLoader();
        genericLoginErrorEl.textContent = error.message;
      });
  });

  logoutBtn.addEventListener('click', function logoutHandler(e) {
    e.preventDefault();
    firebase.auth().signOut().catch(function (error) {
      console.error(error);
    });
  });

  registerBtn.addEventListener('click', function registerHandler() {
    genericLoginErrorEl.textContent = '';
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    if (!email || !password) { alert('Please provide credentials!'); return; }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function () { toggleLoader(); })
      .catch(function (error) {
        toggleLoader();
        genericLoginErrorEl.textContent = error.message;
      });
  });

  function init() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        loginContainerEl.classList.add('hidden');
        appContainerEl.classList.remove('hidden');
        userEmailEl.textContent = user.email;
      } else {
        appContainerEl.classList.add('hidden');
        loginContainerEl.classList.remove('hidden');
      }
      appLoaderEl.classList.add('hidden');
    });

  }

  init();
}());