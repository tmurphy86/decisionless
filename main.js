var userID;


function checkLoginState() {
  FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
  console.log(response);
  });
  }

$(function(){

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

// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=816250271863348";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

FB.api('/me', {fields: 'id'}, function(response) {
  userID = response;
});



});