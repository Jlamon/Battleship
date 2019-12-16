$(document).ready(function(){
    player = players[1];
    var gameInfo; 
    var board;
    var row, col;
    var value = false;
    var gameExit = false;
    webSocket = new WebSocket("ws://localhost:3001/");

    var elem = document.documentElement;

    function updateSubtitle(text){
        $("#subTitle").html(text);
    }

    function g(value) {
        var returnValuetCookiee= value + "=";
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
    function setCookie(timesVisited ,value ,exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = timesVisited + "=" +  value + ";" + expires + ";path=/";
  }

/* View in fullscreen */
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
          console.log(document.webkitExitFullscreen());
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
        }
      }

    $("#fullScreen").click(function(){
        closeFullscreen();
        openFullscreen(); 
    });

    function takeTurn(x){
        if(x == 0){
            updateSubtitle("Its Your Turn, Click Enemy Board")
            value = true;
        }else if(x == 2){
            updateSubtitle("Invalid Move, Please go again");
            value = true;
        }
    }

    function sendBoard(){
        gameInfo.board = board;
        webSocket.send(JSON.stringify(gameInfo));
    }

    $("#grid2 td").click(function(){
        if(!gameExit){
            currentRow = $($(this).parent()).index();
            currentCol = $(this).index();

            if(value){
                row = currentRow;
                col = currentCol;
                res = currentRow+""+currentCol;
                webSocket.send(res);
                value = false;
            }else{
                updateSubtitle("It's not your turn, please wait!");
            }
        }
    });
    function boardToDisplay(gameBoard){
        var table = document.getElementById('grid1');
        // Iterates over the array and paints the board yellow according to where there is a 1
        for(var i = 0; i < gameBoard.length; i++){
            for(var x = 0; x < gameBoard[i].length; x++){
                var tCell = table.rows[i].cells[x];
                // If there is a 1, paint it black
                if(gameBoard[i][x]==1){
                    $(tCell).removeClass("emptyCell");
                    $(tCell).addClass("setted");  
  
                }else if(gameBoard[i][x]==2){

                    $(tCell).removeClass("emptyCell");
                    $(tCell).addClass('hit')
                }else if(gameBoard[i][x]==3){

                    $(tCell).removeClass("emptyCell");
                    $(tCell).addClass('miss');
                }else{
                    $(tCell).removeClass("setted");
                }
            }
        }
    }

    function updateEnemyBoard(change){
        var table = document.getElementById('grid2');
        var cell = table.rows[row].cells[col];

        //change is 0 when it is a hit
        if(change == 0){
            $(cell).removeClass("emptyCell");
            $(cell).addClass('hit');
        }else{
            $(cell).removeClass("emptyCell");
            $(cell).addClass('miss');
        }
    }

    webSocket.onopen = function(){
        updateSubtitle("Please wait while we find another Player");
        webSocket.send("hi");
    }

    //When server sends a message
    webSocket.onmessage = function incoming(str){
        console.log("String is: "+ str.data);
        
        if(str.data == "won"){
            value = false;
            updateSubtitle("Congratulations! You Won!");
            var gamesWon = getCookie('gamesWon');

            gamesWon = parseInt(gamesWon,10);
            gamesWon++;
            setCookie("gamesWon", gamesWon , 30);
            
            gameExit = true;
        }else if(str.data == "lost"){
            value = false;
            updateSubtitle("Game Over - You Lost");
            var gamesLost = getCookie('gamesLost');

            gamesLost = parseInt(gamesLost,10);
            gamesLost++;
            setCookie("gamesLost", gamesLost , 30);

            gameExit = true;

        }else if(str.data == "yourTurn"){
            takeTurn(0);

       }else if(str.data == "invalid"){
            takeTurn(2);

       }else if(str.data == "hit"){
            updateSubtitle("That was a hit!");
            updateEnemyBoard(0);
            sendBoard();

       }else if(str.data == "miss"){
            updateSubtitle("You missed!");
            updateEnemyBoard(1);
            sendBoard();

       }else if(str.data.substring(0,8) == "boardhit"){

          updateSubtitle("Opponenet Hit Your Ship!");
          var values = str.data.substring(8).split(',');
           myRow = parseInt(values[0],10);
           myCol = parseInt(values[1],10);
           board[myRow][myCol] = 2;
           boardToDisplay(board);
        
       }else if(str.data.substring(0,9) == "boardmiss"){

           updateSubtitle("Opponenet Missed!");
           var values = str.data.substring(9).split(',');
           myRow = parseInt(values[0],10);
           myCol = parseInt(values[1],10);
           board[myRow][myCol] = 3;
           boardToDisplay(board);

       }else if(typeof JSON.parse(str.data) == 'object'){
            gameInfo = JSON.parse(str.data);
            console.log(gameInfo);
            board = gameInfo.board;
            console.log("Board "+board);
            boardToDisplay(board);
        }

    }
    
    webSocket.onclose = function(){
        setTimeout(function(){
        window.location.href = "http://localhost:3001/";
        },5000);
    }
    
});