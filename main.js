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
var map;
var infoWindow;
var pos;
var userVisited;
var userKey;
var selectedLoc;
var arraySearch = [];


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

//Uncomment to dummy FB connectivity, be sure to comment out the Facebook login checker!
  // userID = 999999;
  //  checkIfUserExists(userID) //coded after push on ready
  //  initMap();

function checkLoginState() {
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  console.log(response, userID);
  });
}

//This is a custom event that waits for Facebook to connect and load.
//Calls the initMap function when Facebook is good to go.
$(document).on('fbload',
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

  //Checks to see if user is in the database. If so, it recalls their ID and recalls their session. If not, it assigns a new ID.
  function userExistsCallback(userID, exists) {
    if (exists) {
     database.ref().child("decisionless").orderByChild("ID").equalTo(userID).once("value", function(snapshot) {
          snapshot.forEach(function(snap){
             userKey = snap.key;
          });
          var userVisited = snapshot.child(userKey+'/visited').val();
          console.log(userKey);
          console.log(userVisited);
          beenThere(userVisited);
          //start timer until next randomization to reduce replay        
      });
    } else {
        database.ref("/decisionless").push({
          ID: userID,
          time: true,
          visited: []//beenTo Array
        });
      console.log('user ' + userID + ' does not exist!');
    }
  }

  // Tests to see if /users/<userId> has any data. 
  function checkIfUserExists(userId) {
    database.ref().child("decisionless").orderByChild("ID").equalTo(userID).once("value", function(snapshot) {
      var exists = snapshot.val();
      userExistsCallback(userID, exists);
    });
  }


  function beenThere(userVisited){
    console.log(userVisited);
    console.log(Object.keys(userVisited).length);

    for (var i = Object.keys(userVisited).length - 1; i >= 0; i--) {
      console.log(userVisited[i]);
      //write to UI
      $('.collection').append('<li>', userVisited[i]);
    }
  }
  //Map API, loads on page, default center on 0,0. To be overwritten by geolocate if no problems.
  function initMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {lat: 0.000, lng: 0.000},
      zoom: 14
    });
    infoWindow = new google.maps.InfoWindow;
    service = new google.maps.places.PlacesService(map);
    map.addListener('idle', performSearch);

     google.maps.event.addListener(map, "idle", function(){
        console.log("resize function kicking off for the map");
        google.maps.event.trigger(map, 'resize'); 
    });

    //HTML5 Geolocation stuff, asks user if it can use their location.
    //Then it sets their Lat/Lng and sets the center point of map on them.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        //stores location of user in global variable pos
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //Sets a marker on the location of pos that reads 'Location found'
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      //If there's been a problem, kick down to error handler.
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
//The actual search query, checks the bounds of the map and polls Google's Places API
//to find a restaurant that's within a 2.5 mile radius of the user and is open at the 
//time the search is logged.
function performSearch() {
  var request = {
    bounds: map.getBounds(),
    keyword: 'best view',
    types: ['restaurant'],
    opennow: true,
    radius: 4024,
  };
  //After query is logged, calls back to a for loop to log in results.
  //Look at the function below.
  service.radarSearch(request, callback);
  }

function callback(results, status) {
  //Did things not turn out okay? Report the status to console.
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //If things turned out okay, add a marker for each result(See function below). Then call the arrayRandomizer 
  //function to make the decision.
  for (var i = 0, result; result = results[i]; i++) {
    addMarker(result);
    console.log(result);
    arrayRandomizer(result);
  }
}
//Adds in a marker for a place returned by Google. 
function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });
  //Listens for a click, on a map marker. When it detects one, it creates a small popup for what
  //the icon is. 
  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      //Is the result reported on click?
      //If not, write the status to the console.
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      //If there are no issues, create a little popup to display the location name.
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}
//The actual array randomizer, takes a series of results and selects a single one via the random function.
function arrayRandomizer(result) {
 console.log("entering arrayRandomizer");
 console.log(result.place_id);
 arraySearch.push(result.place_id);
 // console.log(arraySearch);

}
//Rolls for a number between 1 and the array's length to determine a location to highlight
$('.randomizeBtn').on('click', function(){ 
  var locationValue = Math.floor((Math.random()* arraySearch.length) + 1);
    console.log(arraySearch[locationValue]);
    console.log("have selected a random location");
  //   service.getDetails(place, function((arraySearch[locationValue])) {
  //   // database.ref("/decisionless").userKey.visited.set({
          
  //   //       visited: []//beenTo Array
  // });
});


//Has something gone wrong with geolocation?
//Either the geolocation has failed for an unspecified reason, or the user's browser
//doesn't support the use of the HTML 5 geolocate feature.
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
        'Error: Geolocation failed.' :
        'Error: User browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
});
