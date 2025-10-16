<script>
(function () {
  if (!window.firebaseConfig) return alert("Firebase config missing!");

  const app = firebase.initializeApp(window.firebaseConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const signIn = document.getElementById("googleSignInBtn");
  const signOut = document.getElementById("googleSignOutBtn");
  const status = document.getElementById("accessStatus");
  const userName = document.getElementById("userName");

  function setStatus(msg) { if (status) status.textContent = msg; }

  if (signIn) signIn.onclick = async () => {
    try {
      setStatus("Signing in…");
      await auth.signInWithPopup(provider);
    } catch (e) {
      setStatus("Error: " + e.message);
      console.error(e);
    }
  };

  if (signOut) signOut.onclick = async () => { await auth.signOut(); };

  auth.onAuthStateChanged(user => {
    if (user) {
      userName.textContent = user.displayName || user.email;
      signIn.style.display = "none";
      signOut.style.display = "inline-flex";
      setStatus("Signed in ✅");
    } else {
      userName.textContent = "Not signed in";
      signIn.style.display = "inline-flex";
      signOut.style.display = "none";
      setStatus("");
    }
  });
})();
</script>
