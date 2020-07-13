(function () {
  const appEl = document.getElementById('app');
  const loaderTemplateScriptEl = document.getElementById('loader-template');
  // const appContainerEl = document.getElementById('app-container');
  // const loginContainerEl = document.getElementById('login-container');
  // const genericLoginErrorEl = document.getElementById('generic-login-error');
  // const appLoaderEl = document.getElementById('app-loader');


  // const userEmailEl = document.getElementById('user-email');
  // const logoutBtn = document.getElementById('logout-btn');

  // const registerBtn = document.getElementById('register-btn');
  // const loginBtn = document.getElementById('login-btn');
  // const emailInputEl = document.getElementById('email');
  // const passwordInputEl = document.getElementById('password');

  // function toggleLoader() {
  //   if (appLoaderEl.classList.contains('hidden')) {
  //     appLoaderEl.classList.remove('hidden');
  //     return;
  //   }
  //   appLoaderEl.classList.add('hidden');
  // }

  // loginBtn.addEventListener('click', function loginHandler() {
  //   genericLoginErrorEl.textContent = '';
  //   const email = emailInputEl.value;
  //   const password = passwordInputEl.value;
  //   if (!email || !password) { alert('Please provide credentials!'); return; }

  //   toggleLoader();
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //     .then(function () { toggleLoader(); })
  //     .catch(function (error) {
  //       toggleLoader();
  //       genericLoginErrorEl.textContent = error.message;
  //     });
  // });

  function afterLoginRegisterRenderFactory({ loginRegisterTemplate, loaderTemplate }) {
    return function afterLoginRegisterRender() {
      const registerBtn = document.getElementById('register-btn');
      const loginBtn = document.getElementById('login-btn');
      const emailInputEl = document.getElementById('email');
      const passwordInputEl = document.getElementById('password');

      registerBtn.addEventListener('click', function registerHandler() {
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        if (!email || !password) { alert('Please provide credentials!'); return; }
        render(loaderTemplate);
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .catch(function (error) {
            render(loginRegisterTemplate, { error: error.message, email, password }, afterLoginRegisterRender)
          });
      });

      loginBtn.addEventListener('click', function loginHandler() {
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        if (!email || !password) { alert('Please provide credentials!'); return; }
        render(loaderTemplate);
        firebase.auth().signInWithEmailAndPassword(email, password)
          .catch(function (error) {
            render(loginRegisterTemplate, { error: error.message, email, password }, afterLoginRegisterRender)
          });
      });
    }
  }

  function afterAuthContentRenderFactory() {
    return function afterAuthContentRender() {
      const logoutBtn = document.getElementById('logout-btn');
      logoutBtn.addEventListener('click', function logoutHandler(e) {
        e.preventDefault();
        firebase.auth().signOut().catch(function (error) {
          console.error(error);
        });
      });
    }
  }

  function render(template, data, ...cbs) {
    appEl.innerHTML = template(data);
    cbs.forEach(fn => fn());
  }

  function init() {
    const generateTemplate = str => Handlebars.compile(str);
    const loaderTemplate = generateTemplate(loaderTemplateScriptEl.innerHTML);
    render(loaderTemplate);

    Promise.all([
      fetch('./templates/auth-content.hbs').then(res => res.text()),
      fetch('./templates/login-register-form.hbs').then(res => res.text())
    ]).then(templateStrings => templateStrings.map(generateTemplate))
      .then(([authContentTemplate, loginRegisterTemplate]) => {

        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            render(authContentTemplate, { email: user.email }, afterAuthContentRenderFactory());
          } else {
            render(loginRegisterTemplate, {}, afterLoginRegisterRenderFactory({
              authContentTemplate,
              loginRegisterTemplate,
              loaderTemplate
            }));
          }
        });
      });
  }

  init();
}());