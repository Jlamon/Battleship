$(document).ready(function(){
    
  function generateRandomID(){
    return Math.floor(Math.random() * Math.floor(1000000)); 
  }
  function setCookie(timesVisited ,value ,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = timesVisited + "=" +  value + ";" + expires + ";path=/";
  }
    
  function getCookie(value) {
        var returnValue= value + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(returnValue) == 0) {
            return c.substring(returnValue.length, c.length);
          }
      }
      return "";
  
  }
      
  function checkCookieTimeVisited() {
        var timesVisited = getCookie("timesVisited");
        console.log("TimesVisited " + timesVisited);
        if (timesVisited != "") {
           timesVisited = parseInt(timesVisited,10);
           timesVisited++;
           timesVisited = timesVisited+"";
           console.log(timesVisited);
           console.log("Hey its u again "+ timesVisited);
           setCookie("timesVisited", timesVisited , 30);
           var x = document.getElementById('timesPlayed');
           x.innerHTML = "<h2>Times You Have Played : "+timesVisited+"</h2>"; 
        } else {
             setCookie("timesVisited", 1, 30);
           }
  }
      
  function checkCookiePlayerID() {
    var playerID = getCookie("playerID");
    console.log("PlayerID : "+ playerID);
    if (playerID != "") {
      console.log("Hey "+playerID);
    } else {
        setCookie("playerID", generateRandomID(), 30);
    }
  }

  function checkCookieGamesWon() {
    var gamesWon = getCookie("gamesWon");
    if (gamesWon!= "") {
      var x = document.getElementById('gamesWon');
      x.innerHTML = "Games Won: "+gamesWon;
    } else {  
         setCookie("gamesWon", 0, 30);
       }
}

function checkCookieGamesLost() {
  var gamesLost = getCookie("gamesLost");
  if (gamesLost!= "") {
    var x = document.getElementById('gamesLost');
    x.innerHTML = "Games Lost: "+gamesLost;
  } else {  
       setCookie("gamesLost", 0, 30);
     }
}
  checkCookieTimeVisited();
  checkCookiePlayerID();
  checkCookieGamesWon();
  checkCookieGamesLost();

});
