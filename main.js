
// //FACEBOOK AUTH SDK 
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
var map;
var infoWindow;
var pos;
var userVisted;
var userKey;

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


//delete when LIVE
  // userID = 999999;
  //  checkIfUserExists(userID) //coded after push on ready
  //  initMap();

//UNCOMMENT FOR FACEBOOK LOGIN

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
                   userID = response.id;
                   console.log(userID);
                   checkIfUserExists(userID) //coded after push on ready
                   initMap();

              
              });

                });
            }
        });

    }
);


  //if user is in DB move on, 
  function userExistsCallback(userID, exists) {
    if (exists) {
     database.ref().child("decisionless").orderByChild("ID").equalTo(userID).once("value", function(snapshot) {
          snapshot.forEach(function(snap){
             userKey = snap.key;
          });
          var userVisted = snapshot.child(userKey+'/visted').val();
          console.log(userKey);
          console.log(userVisted);
          beenThere(userVisted);        
      });

    

    } else {

        database.ref("/decisionless").push({
          ID: userID,
          visted: [userID,100002,10003]//beenTo Array
        });

      alert('user ' + userID + ' does not exist!');
    }
  }


  // Tests to see if /users/<userId> has any data. 
  function checkIfUserExists(userId) {
    database.ref().child("decisionless").orderByChild("ID").equalTo(userID).once("value", function(snapshot) {
      var exists = snapshot.val();
      userExistsCallback(userID, exists);
    });
  }


  function beenThere(userVisted){
    console.log(userVisted);
    console.log(Object.keys(userVisted).length);

    for (var i = Object.keys(userVisted).length - 1; i >= 0; i--) {
      console.log(userVisted[i]);

      //api call to google for places ID name and rating etc


      //write to UI
      $('.collection').append('<li>', userVisted[i]);
    }

  }




  //Map API load on page
  function initMap() {
    map = new google.maps.Map(document.getElementById('dynMap'), {
      center: {lat: 0.000, lng: 0.000},
      zoom: 14
    });
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: Geolocation failed.' :
                          'Error: User browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }



});
