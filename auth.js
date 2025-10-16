<script>
(function () {
  if (!window.firebaseConfig) {
    console.error("Firebase config missing");
    return;
  }

  // Firebase (compat)
  const app = firebase.initializeApp(window.firebaseConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  // Grab elements (IDs exactly as in your HTML)
  const statusEl  = document.getElementById('auth-state');
  const signInEl  = document.getElementById('google-signin');
  const signOutEl = document.getElementById('signout');

  function setStatus(msg) { if (statusEl) statusEl.textContent = msg || ''; }

  function on(el, fn){
    if(!el) return;
    el.addEventListener('click', (e)=>{
      if (e && e.preventDefault) e.preventDefault(); // stop <button>/<a> default
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
    try {
      await auth.signOut();
    } catch (e) {
      setStatus('Sign-out error: ' + e.message);
    }
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      setStatus('Signed in ✅ ' + (user.displayName || user.email));
      if (signInEl)  signInEl.classList.add('hidden');
      if (signOutEl) signOutEl.classList.remove('hidden');
    } else {
      setStatus('Not signed in');
      if (signInEl)  signInEl.classList.remove('hidden');
      if (signOutEl) signOutEl.classList.add('hidden');
    }
  });
})();
</script>
