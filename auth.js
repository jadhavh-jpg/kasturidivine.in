(function () {
  if (!window.firebaseConfig) {
    console.error("Firebase config missing");
    return;
  }

  // Initialize (compat)
  if (!firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
  }
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  // Elements: IDs as in your HTML
  const statusEl  = document.getElementById('auth-state');   // "Not signed in" text
  const signInEl  = document.getElementById('google-signin');
  const signOutEl = document.getElementById('signout');

  function setStatus(msg){ if(statusEl) statusEl.textContent = msg || ''; }

  function on(el, fn){
    if(!el) return;
    el.addEventListener('click', (e)=>{
      if (e && e.preventDefault) e.preventDefault();
      fn();
    });
  }

  on(signInEl, async () => {
    try {
      setStatus('Signing in…');
      await auth.signInWithPopup(provider);
    } catch (e) {
      console.warn('Popup error:', e.code, e.message);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
        setStatus('Popup blocked — redirecting…');
        await auth.signInWithRedirect(provider);
      } else {
        setStatus('Sign-in failed: ' + e.message);
      }
    }
  });

  on(signOutEl, async () => {
    try { await auth.signOut(); }
    catch (e) { setStatus('Sign-out error: ' + e.message); }
  });

  auth.onAuthStateChanged(use
