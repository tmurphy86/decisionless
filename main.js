var userID;


function checkLoginState() {
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  console.log(response, userID);
  });
  }
$(document).on(
    'fbload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
    function(){
        //some code that requires the FB object
        //such as...
        FB.getLoginStatus(function(res){
          console.log(res.status);
            if( res.status == "connected" ){
              console.log("working");
                // FB.api('/me', function(fbUser) {
                //     console.log("Open the pod bay doors, " + fbUser.name + ".");
                // });
            }
        });

    }
);

$(function(){


    //FACEBOOK AUTH SDK 
    window.fbAsyncInit = function() {
        FB.init({
          appId      : '816250271863348',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.8'
        });
        FB.AppEvents.logPageView();   
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

      $(document).trigger('fbload');



      // checkLoginState(); still causing an undefined error

//checking FB login status
// console.log(checkLoginState);
// if(checkLoginState) {

//    FB.api('/me', {fields: 'id'}, function(response) {

//       userID = response;

//    database.ref("/decisionless").push({
//         ID: userID,
//         visted: userID//beenTo Array
//       });

//       console.log(userID);

//   }); //.bind(this) pulled out
// }


$('.fb-login-button').on('click', function(){

    FB.api('/me', {fields: 'id'}, function(response) {
      userID = response;

   database.ref("/decisionless").push({
        ID: userID,
        visted: userID//beenTo Array
      });

      console.log(userID);


    });
});

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




      console.log(userID);

});