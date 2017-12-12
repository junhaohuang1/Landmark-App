// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)        
  var config = {
    apiKey: "AIzaSyASbVX_gv0iAkSm36ZvvFnCBVHNc9vyAlc",
    authDomain: "landmark-dd23e.firebaseapp.com",
    databaseURL: "https://landmark-dd23e.firebaseio.com",
    projectId: "landmark-dd23e",
    storageBucket: "landmark-dd23e.appspot.com",
    messagingSenderId: "139284071210"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();



// // // --------- Authentication code ------ // // //
// Track the UID of the current user.  
     var currentUid = null;  
     firebase.auth().onAuthStateChanged(function(user) {  
      // onAuthStateChanged listener triggers every time the user ID token changes.  
      // This could happen when a new user signs in or signs out.  
      // It could also happen when the current user ID token expires and is refreshed.  
      if (user && user.uid != currentUid) {  
       // Update the UI when a new user signs in.  
       // Otherwise ignore if this is a token refresh.  
       // Update the current user UID.  
       currentUid = user.uid;
       console.log(user.uid); 
       // document.body.innerHTML = '<h1> Congrats ' + user.displayName + ', you are done! </h1> <h2> Now get back to what you love building. </h2> <h2> Need to verify your email address or reset your password? Firebase can handle all of that for you using the email you provided: ' + user.email + '. <h/2>';  
      } else {  
       // Sign out operation. Reset the current user UID.  
       currentUid = null;  
       console.log("no user signed in");  
       window.location.href = "signin.html";
      }  
     });  
