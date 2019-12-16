

$(document).ready(function(){
    var webSocket;
    function generateRandomID(){
        return Math.floor(Math.random() * Math.floor(100000));
    }

    function game(id, player1, player2, board1, board2, webSocket1, webSocket2) {
        // id of the game
        this.id = id;
        //Player Name
        this.player1 = player1;
        this.player2 = player2;
        this.board1 = board1;
        this.board2 = board2;
        this.webSocket1 = webSocket1;
        this.webSocket2 = webSocket2;
    }

    //Checks if the game needs to continue or has ended(P1 / P2 has won)
    function gameState(board1, board2) {
        var exitStatus = 0;
        //Return 0, if No one has won (User Left)
        //Return 1 if Player1 has won
        //Return 2 if Player2 has won
        var value = true;

        //Evaluates if there is a ship still standing in board1
        for(var i = 0; i <board1.length; i++){
            if(board1[i].indexOf(1) != -1){
                value = false;
                break;
            }
        
        }

        if(value){
            exitStatus = 1;
            return exitStatus;
        }

        value = true;

        //Evaluates if there is a ship still standing in board2 
        for(var i = 0; i <board2.length; i++){
            if(board2[i].indexOf(1) != -1){
                value = false;
                break;
            }
        
        }

        if(value){
            exitStatus = 2;
            return exitStatus;
        }

        return exitStatus;
    };

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

    var board1 = createBoard();
    var board2 = createBoard();

    //Checks the state of the game

    //Creates a new game (When all the information is available)
    //new game();

    //Function that starts the game
    //gameStart(id);

    function start(game){

        //If player 2 is a computer (Single Player)
        if(game.player2 == "Computer"){
            
            

            
        }else if(game.player2 != "Computer"){
            //If player 2 is an online Player 
                
        }

    }

    $("#singlePlayer").click(function(){
        window.open("setup.html", "_blank");
    });

    $("#finishedYes").click(function(){
        //window.open("Game.html", "_blank");
        webSocket = new WebSocket("ws://localhost:3001/");
        
        webSocket.onopen = function(){
            var player1ID = generateRandomID();
            board2 = autoGenerateBoard();
            var gameInfo = new game(generateRandomID(),player1ID, "Computer", board1, board2, webSocket, "");
            var resp = JSON.stringify(gameInfo);
            console.log("Connection Established");
            webSocket.send(resp);
            
        }

        webSocket.onmessage = function(event){
            console.log(""+event.data);       
        }
    });   

    function generateRandomNumber(n){
        return Math.floor(Math.random() * n);
    }

    function checkIfAvailable(randomBoard,orientationOfShip,rand1,rand2){
        var status = true;
        // If 0, Big ship is 4x1 otherwise 1x4
        if(orientationOfShip == 0){

            if(rand2 < 6){
                for(var i = rand2; i < rand2+4; i++){
                    if(randomBoard[rand1][i] == 1){
                        status = false;
                        return status;
                    }
                }
            }else{
                for(var i = rand2; i > rand2-4; i--){
                    if(randomBoard[rand1][i] == 1){
                        status = false;
                        return status;
                    }
                }
            }

        }else{
            if(rand1 < 6){
                for(var i = rand1; i < rand1+4; i++){
                    if(randomBoard[rand1][i] == 1){
                        status = false;
                        return status;
                    }
                }
            }else{
                for(var i = rand1; i > rand1-4; i--){
                    if(randomBoard[rand1][i] == 1){
                        status = false;
                        return status;
                    }
                }
            }

        }

        return status;
    }

    // Tells the player that it is an invalidMove and to consider another move
    function invalidMove(){

    }

    function placeShip(randomBoard, shipSize , orientationOfShip, rand1, rand2, player){
        var status = checkIfAvailable(randomBoard,orientationOfShip, rand1, rand2);
        console.log(rand1, rand2);
        console.log(status);
        if(status){
            
            if(orientationOfShip == 0){
                if(rand2 < 6){
                    for(var i = rand2; i < rand2+shipSize; i++){
                        randomBoard[rand1][i] = 1;
                    }
                }else{
                    for(var i = rand2; i > rand2-shipSize; i--){
                        randomBoard[rand1][i] = 1;
                    }
                }

            }else{
                if(rand1 < 6){
                    for(var i = rand1; i < rand1+shipSize; i++){
                        randomBoard[i][rand2] = 1;
                    }
                }else{
                    for(var i = rand1; i > rand1-shipSize; i--){
                        randomBoard[i][rand2] = 1;
                    }
                }

            }
        }else{
            if(player == "Computer"){
                rand1 = generateRandomNumber(10);
                rand2 = generateRandomNumber(10);
                placeShip(randomBoard, shipSize, orientationOfShip, rand1, rand2, "Computer");
            }else{
                invalidMove();
            }
        }
    }

    //Add a big Ship (4x1 or 1x4)
    function addBiggestShip(board, player, numb1, numb2){
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
    };

    function addBigShip(board, player, numb1, numb2){
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

        placeShip(board, 3, orientationOfShip, x, y, player);
    }

    function addSmallShip(board, player, numb1, numb2){
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

        placeShip(board, 2, orientationOfShip, x, y, player);
    }

    function addSmallestShip(board, player, numb1, numb2){
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
        console.log("Before Smallest Ship");
        console.log(board);
        placeShip(board, 1, orientationOfShip, x, y, player);
        console.log("After");
        console.log(board);
    }

    function autoGenerateBoard(){
        randomBoard = createBoard();
        //Adds a 4x1 or 1x4 Ship
        addBiggestShip(randomBoard, "Computer");
        //Adds a 3x1 or a 1x3 Ship
        addBigShip(randomBoard, "Computer");
        //Adds a 2x1 or a 1x2 Ship
        addSmallShip(randomBoard, "Computer");
        // Adds a 1x1 Ship;
        addSmallestShip(randomBoard, "Computer");
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
                    $(tCell).addClass("shipOnCell");
                }else{
                    $(tCell).removeClass("shipOnCell");
                    $(tCell).addClass("emptyCell");
                }

            }

        }
    }

    $("#resetBoard").click(function(){
        board1 = createBoard();
        boardToDisplay(board1);
    });

    $("#randomBoard").click(function(){
        board1 = createBoard();
        board1 = autoGenerateBoard();
        console.log("Auto Generated Board ");
        console.log(board1);
        boardToDisplay(board1);
    });
    
    var sz = 0;

    $('#finished').click(function(){
        sz = 4;
    });
    //Function that will hover a specific number of cell in the table
    
    $("#multiplayer").click(function(){
        webSocket = new WebSocket("ws://localhost:3000/");
        console.log(webSocket);
    });

    $("td").hover(function(){
        
    });
    
    $("td").hover(function(){
        if(sz > 0){
            var table = document.getElementById('grid1');
            
            var row = $($(this).parent()).index();
            var col = $(this).index();
            
            if(row < 7){
                for(var i = row; i < (row+sz);i++){
                    var cell = table.rows[i].cells[col];
                    console.log("Success");
                    $(cell).toggleClass('hovered').trigger('hoverActive');
                }
            }else{
                var cell = table.rows[row].cells[col];
                $(cell).toggleClass('fail');
                console.log("Invalid Move");
            }
            
            
        }

    }); 
});

