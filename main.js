var userID;


function checkLoginState() {
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  console.log(response);
  });
  }

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

$('.fb-login-button').on('click', function(){

    FB.api('/me', {fields: 'id'}, function(response) {
      userID = response;
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



      console.log(userID);

});