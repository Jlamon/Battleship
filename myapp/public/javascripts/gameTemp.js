
$(document).ready(function(){
    window.player1ID = generateRandomID();
    window.gameID = generateRandomID();
    window.webSocket;
    window.board1 = createBoard();
    window.sz = 0;
    window.orientation = 0;
    window.table = document.getElementById('grid1');
    window.cell, window.row, window.col;
    window.players = ["singlePlayer", "multiPlayer", "Computer"];
    window.player, window.gameInfo;
    window.gameInfo;
    
    function generateRandomID(){
        return Math.floor(Math.random() * Math.floor(100000));
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

    function game(id ,board, webSocket) {
        this.id = id;
        this.board = board;
        this.webSocket = webSocket;
    }

    function createBoard(){
        var x =  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        
        return x;
    }
    
    //Checks the state of the game

    //Creates a new game (When all the information is available)
    //new game();

    //Function that starts the game
    //gameStart(id); 

    function generateRandomNumber(n){
        return Math.floor(Math.random() * n);
    }

    function checkIfAvailable(randomBoard,rand1,rand2){
        if(randomBoard[rand2][rand1] == 1){
            return false;
        }else{
            return true;
        }
        
    }

    function checkIfAvailableShip(randomBoard,rand1,rand2,orientationOfShip,shipSize){
        var status = true;
        
        borderLimit = 10 - shipSize;

        if(orientationOfShip == 0){
            if(rand2 <= borderLimit){
                for(var i = rand2; i < rand2+shipSize; i++){
                    if(!checkIfAvailable(randomBoard,rand1, i)){
                        status = false;
                        break;
                    }
                }
            }else{
                status = false;
            }
        }else{
            if(rand1 <= borderLimit){
                for(var i = rand1; i < rand1+shipSize; i++){
                    if(!checkIfAvailable(randomBoard, i, rand2)){
                        status = false;
                        break;
                    }
                }
            }else{
                status = false;
            }

        }

        return status;
    }
    
    //Rewrite Code
    function placeShip(randomBoard, shipSize , orientationOfShip, rand1, rand2, player){
      var available = checkIfAvailableShip(randomBoard, rand1, rand2, orientationOfShip, shipSize);

      if(available){
        if(orientationOfShip == 0){
            for(var i = rand2; i < rand2+shipSize; i++){
                randomBoard[i][rand1] = 1;
            }
        }else{
            for(var i = rand1; i < rand1+shipSize; i++){
                randomBoard[rand2][i] = 1;
            }
        }
      }else{
          if(player == "Computer"){
            rand1 = generateRandomNumber(10);
            rand2 = generateRandomNumber(10);
            placeShip(randomBoard,shipSize,orientationOfShip, rand1, rand2, "Computer");
          }else{
              invalidMove();
          }
      }
    }

    function shipCheck(board){
        var value = 0;
        for(var i = 0; i < board.length; i++){
            for(var x = 0; x < board[i].length;x++){
                if(board[i][x]==1){
                    value++;
                }
            }
        }
        return value;
    }

    //Add the Battleship (5x1 or 1x5)
    function addBattleship(board, player, numb1, numb2){
        var x, y;

        if(player == "Computer"){
            x = generateRandomNumber(10);
            y = generateRandomNumber(10); 
        }else{
            x = numb1;
            y = numb2;
        }
        // If 0, Big ship is 5x1 otherwise 1x5
        var orientationOfShip = generateRandomNumber(2); 

        placeShip(board, 5, orientationOfShip, x, y, player);
    };  

    $("#finished").click(function(){
        gameInfo = new game(getCookie("playerID"), board1, "");
        wss = new WebSocket("ws://localhost:3001/");
        
        wss.onopen = function(){
            wss.send("ho"+JSON.stringify(gameInfo));
        }
    });
    
    //Add the Aircraft 4x1 or 1x4
    function addAircraft(board, player, numb1, numb2){
        var x, y;

        if(player == "Computer"){
            x = generateRandomNumber(10);
            y = generateRandomNumber(10); 
        }else{
            x = numb1;
            y = numb2;
        }
        // If 0, Big ship is 4x1 otherwise 1x4
        var orientationOfShip = generateRandomNumber(2); 

        placeShip(board, 4, orientationOfShip, x, y, player);
    }

    //Add the submarine, which is a 3x1 or 1x3
    function addSubmarine(board, player, numb1, numb2){
        var x, y;

        if(player == "Computer"){
            x = generateRandomNumber(10);
            y = generateRandomNumber(10); 
        }else{
            x = numb1;
            y = numb2;
        }
        // If 0, Big ship is 3x1 otherwise 1x3
        var orientationOfShip = generateRandomNumber(2); 

        placeShip(board, 3, orientationOfShip, x, y, player);
    }

    //Add the small ship, which is a 2x1 or 1x2        
    function addSmallShip(board, player, numb1, numb2){
        var x, y;

        if(player == "Computer"){
            x = generateRandomNumber(10);
            y = generateRandomNumber(10); 
        }else{
            x = numb1;
            y = numb2;
        }
        // If 0, Big ship is 2x1 otherwise 1x2
        var orientationOfShip = generateRandomNumber(2); 
        placeShip(board, 2, orientationOfShip, x, y, player);
    }

    function autoGenerateBoard(){
        randomBoard = createBoard();
        //Adds a 5x1 or 1x5 Ship
        addBattleship(randomBoard, "Computer");
        //Adds a 4x1 or a 1x4 Ship
        addAircraft(randomBoard, "Computer");
        //Adds a 3x1 or a 1x3 Ship
        addSubmarine(randomBoard, "Computer");
        // Adds a 2x1 or 1x2 Ship;
        addSmallShip(randomBoard, "Computer");
        addSmallShip(randomBoard, "Computer");
        return randomBoard;
    };

    //Perhaps a constructor for the ships

    function boardToDisplay(gameBoard){
        var table = document.getElementById('grid1');
        // Iterates over the array and paints the board black according to where there is a 1
        for(var i = 0; i < gameBoard.length; i++){
            for(var x = 0; x < gameBoard[i].length; x++){
                var tCell = table.rows[i].cells[x];
                // If there is a 1, paint it black
                if(gameBoard[i][x]==1){
                    $(tCell).removeClass("emptyCell");
                    $(tCell).addClass("setted");  
  
                }else{
                    $(tCell).removeClass("setted");
                }
            }
        }
    }


    $("#resetBoard").click(function(){
        board1 = createBoard();
        boardToDisplay(board1);
        $("#battleship").prop('disabled',false);
        $("#aircraft").prop('disabled',false);
        $("#submarine").prop('disabled',false);
        $("#destroyer").prop('disabled',false);
        $("#small").prop('disabled',false);
    });

    $("#randomBoard").click(function(){
        board1 = createBoard();
        board1 = autoGenerateBoard();
        boardToDisplay(board1);
        $("#battleship").prop('disabled',true);
        $("#aircraft").prop('disabled',true);
        $("#submarine").prop('disabled',true);
        $("#destroyer").prop('disabled',true);
        $("#small").prop('disabled',true);
    });
    
    $("#multiplayer").click(function(){        
        //Do something when the connection is open
        window.location.href = ("http://localhost:3001/setup.html");
    });

    //Function that will hover a specific number of cell in the table
    //hover the specific number of cells needed for a specific ship
    //Variables out of the function because of the scope
    function placeWork(size){
        if(orientation == 0){
            for(var i = row; i < (row+size);i++){
                cell = table.rows[i].cells[col];
                $(cell).toggleClass('setupHovered');
            }
        }else{
            for(var i = col; i < (col+size);i++){
                cell = table.rows[row].cells[i];
                $(cell).toggleClass('setupHovered');
        }
    }
    }

    function placeNotWork(){
        cell = table.rows[row].cells[col];
        $(cell).toggleClass('fail');      
    } 
           
    $("td").hover(function(){
        row = $($(this).parent()).index();
        col = $(this).index();
        if(sz > 0){
            if((row < 6 && sz == 5) || (col < 6 && sz==5)) {
                placeWork(sz);
            }else if (row < 7 && sz == 4 || (col < 7 && sz==4)){
                placeWork(sz);
            }else if(row < 8 && sz == 3 || (col < 8 && sz==3)){
                placeWork(sz);
            }else if(row < 9 && sz == 2 || (col < 9 && sz==2)){
                placeWork(sz);                                
            }else{
                placeNotWork();                
            }
        }
    });
    
    //Gives a color when clicked
    $("td").click(function(){
        if(!checkIfAvailableShip(board1,col, row, orientation, sz)){
            return;
            
        }else{
            
            if(orientation == 0){
                for(var i = row; i < (row+sz);i++){
                    cell = table.rows[i].cells[col];
                    $(cell).toggleClass('setted');
                    $(cell).toggleClass('setupHovered');
                    board1[i][col] = 1;
                }
            }else{
                for(var i = col; i < (col+sz);i++){
                    cell = table.rows[row].cells[i];
                    $(cell).toggleClass('setted');
                    $(cell).toggleClass('setupHovered');
                    board1[row][i] = 1;
                }
            }
            sz = 0;
        }
    });

    //gives specific attributes when a button is clicked
    $("#battleship").click(function(){
            $(this).prop('disabled',true);
            sz = 5;
        
    });
    $("#aircraft").click(function(){
        sz = 4;
        $(this).prop('disabled',true);
    });
    $("#submarine").click(function(){
        sz = 3;
        $(this).prop('disabled',true);
    });
    $("#destroyer").click(function(){
        sz = 2;
        $(this).prop('disabled',true);
    });
    $("#small").click(function(){
        sz = 2;
        $(this).prop('disabled',true);
    });
    
    //Orientation of ship changed when switch button clicked
    $("input[type='checkbox']").click(function(){
        var chkBox = document.getElementById('myonoffswitch');
        if (chkBox.checked){
            orientation = 0;
        }else{
            orientation = 1;
        }
        
    });
    
    //Modals
    //When user clicks the button, open the modal
    $("#about").click(function() {
        $("#aboutPrompt").css("display","block");
    });
    $('#surrender').click(function(){
        $("#surrenderPrompt").css("display","block"); 
    });
    $('#backMenu').click(function(){
        $("#backMenuPrompt").css("display","block"); 
    });
    $('#exitGame').click(function(){
        $("#exitGamePrompt").css("display","block"); 
    });
    $('#finished').click(function(){
        $("#finishedPrompt").css("display","block"); 
    });

    //when user clicks on button no, or span, close the modal
    $("#closeButton").click(function(){
        $("#aboutPrompt").css("display","none");
    });
    $("#surrenderNo").click(function(){
        $("#surrenderPrompt").css("display","none");
    });
    $("#backMenuNo").click(function(){
        $("#backMenuPrompt").css("display","none");
    });
    $("#exitGameNo").click(function(){
        $("#exitGamePrompt").css("display","none");
    });
    $("#finishedNo").click(function(){
        $("#finishedPrompt").css("display","none");
    })

    //When user clicks out of the modal, the modal closes
    $(window).click(function(event){
        var modal = document.getElementById("aboutPrompt");
        if(event.target == modal){
            $("#aboutPrompt").css("display", "none");
        }
    });
    $(window).click(function(event){
        var modal = document.getElementById("surrenderPrompt");
        if(event.target == modal){
            $("#surrenderPrompt").css("display","none");
        }
    });
    $(window).click(function(event){
        var modal = document.getElementById("backMenuPrompt");
        if(event.target == modal){
            $("#backMenuPrompt").css("display","none");
        }
    });
    $(window).click(function(event){
        var modal = document.getElementById("exitGamePrompt");
        if(event.target == modal){
            $("#exitGamePrompt").css("display","none");
        }
    });
    $(window).click(function(event){
        var modal = document.getElementById("finishedPrompt");
        if(event.target == modal){
            $("#finishedPrompt").css("display","none");
        }
    });
    
    //When YES is clicked (surrender)
    $('#surrenderYes').click(function() {
        window.location.href = 'http://localhost:3001';
    });
    $('#backMenuYes').click(function() {
        window.location.href = 'http://localhost:3001';
    });

    $('#finishedYes').click(function() {
        if(shipCheck(board1) == 16){
            window.location.href = 'Game.html';
        }else{
            $("#finishedPrompt").css("display","none");
            alert("Please finish placing all the ships");
        }
        
    });

    $('#exitGameYes').click(function() {
        window.location.href = 'http://localhost:3001';
    });

    //When How To Play is clicked 
    $("#howToPlay").click(function(){
        var url = "https://en.wikipedia.org/wiki/Battleship_(game)";
        window.open(url, '_blank'); 
    });
    $("#howToPlaySplash").click(function(){
        var url = "https://en.wikipedia.org/wiki/Battleship_(game)";
        window.open(url, '_blank'); 
    });
});