<script>
(function () {
  if (!window.firebaseConfig) return console.error("Firebase config missing");
  const app = firebase.initializeApp(window.firebaseConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const signInEl  = document.getElementById('googleSignInBtn');
  const signOutEl = document.getElementById('googleSignOutBtn');
  const statusEl  = document.getElementById('accessStatus');
  const userEl    = document.getElementById('userName');

  function setStatus(msg){ if(statusEl) statusEl.textContent = msg || ''; }

  function onClick(el, fn){
    if(!el) return;
    el.addEventListener('click', (e)=>{
      if (e && typeof e.preventDefault === 'function') e.preventDefault(); // stops <a> navigation
      fn();
    });
  }

  onClick(signInEl, async () => {
    try {
      setStatus('Signing in…');
      await auth.signInWithPopup(provider);
    } catch (e) {
      console.warn('Popup error:', e.code, e.message);
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user') {
        setStatus('Popup blocked—redirecting…');
        await auth.signInWithRedirect(provider);  // fallback
      } else {
        setStatus('Error: ' + e.message);
      }
    }
  });

  onClick(signOutEl, async () => {
    await auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      if (userEl) userEl.textContent = user.displayName || user.email;
      if (signInEl)  signInEl.style.display  = 'none';
      if (signOutEl) signOutEl.style.display = 'inline-flex';
      setStatus('Signed in ✅');
    } else {
      if (userEl) userEl.textContent = 'Not signed in';
      if (signInEl)  signInEl.style.display  = 'inline-flex';
      if (signOutEl) signOutEl.style.display = 'none';
      setStatus('');
    }
  });
})();
</script>
