
//FACEBOOK AUTH SDK 
window.fbAsyncInit = function() {
  FB.init({
    appId      : '816250271863348',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  $(document).trigger('fbload');
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



//global variables
var userID;


//on document load function
$(function(){


//FIREBASE CONFIG
var config = {
    apiKey: "AIzaSyBuEVQcL8R7uPoLiDrobj5HJVMfGI4UnX8",
    authDomain: "murphytech-6f573.firebaseapp.com",
    databaseURL: "https://murphytech-6f573.firebaseio.com",
    projectId: "murphytech-6f573",
    storageBucket: "murphytech-6f573.appspot.com",
    messagingSenderId: "158805281949"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
var database = firebase.database();
// All of our connections will be stored in this directory.
var fbDB = database.ref("/decisionless");

function checkLoginState() {
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  console.log(response, userID);
  });
}

$(document).on('fbload',  //  <---- HERE'S OUR CUSTOM EVENT for FB load
   
    function(){
        FB.getLoginStatus(function(res){
          console.log(res.status);
            if( res.status == "connected" ){
              console.log("working");
                FB.api('/me', function(fbUser) {
                    console.log(fbUser);
                FB.api('/me', {fields: 'id'}, function(response) {
                   userID = response;
                   checkIfUserExists(userID) //coded after push on ready




              console.log(userID);
              });

                });
            }
        });

    }
);



function userExistsCallback(userID, exists) {
  if (exists) {

    alert('user ' + userID + ' exists!');

  } else {

      database.ref("/decisionless").push({
        ID: userID,
        visted: userID//beenTo Array
      });

    alert('user ' + userID + ' does not exist!');
  }
}

// Tests to see if /users/<userId> has any data. 
function checkIfUserExists(userId) {
  fbDB.child(userID).once('value', function(snapshot) {
    console.log("checking if user is there" + snapshot);
    var exists = (snapshot.val() !== null);
    userExistsCallback(userID, exists);
  });
}









      console.log(userID);

});