var express = require("express");
var http = require("http");
var ws = require("ws");

var port = 3001;
var app = express();

// var webSocketId = 0;
// var activeWebSocketId = 0;
// var activeGamesId = 0;
// var gameBoardId = 0;
// var tempGameBoardsId = 0;

var webSockets = [];
var activeGames = [];
var activeWebSockets = [];
var gameInfo;
var gameBoards = [];
var tempGameBoards = [];
var endGameValue = [];
var playerInfo = [];

function player(id, won, lost){
    this.id = id;
    this.won = won;
    this.lost = lost;
}

app.use(express.static(__dirname + "/public")); 

// app.get("/", function(req, res){
//     res.sendFile("Splash.html", {root: "./public"});
// });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get("/", function(req, res){
    res.render('Splash', {activeGames: activeGames.length});
});

// Object.size = function(obj) {
//     var size = 0, key;
//     for (key in obj) {
//         if (obj.hasOwnProperty(key)) size++;
//     }
//     return size;
// };

var server = http.createServer(app);
const wss = new ws.Server({server});

function checkPlayer(playerI){
        var found = false;
        for(var i = 0; i < playerInfo.length; i++){
            if(playerInfo[i].id == playerI){
                found = true;
            }
        }
        if(!found){
            var newPlayer = new player(playerI, 0 , 0);
            playerInfo.push(newPlayer);
            return false;
        }else{
            return true;
        }
}

wss.on("connection", function(ws){
    ws.on("message",function incoming(str){
        console.log("str = "+str);
        //When page loads Game.html, Game.html sends message "hi"
        if(str.substring(0,2) == "ho"){
            str = str.substring(2);
            gameInfo = JSON.parse(str);
            tempGameBoards.push(gameInfo.board);
            //connectPlayers();
        }else if(str == "hi"){
            checkPlayer(gameInfo.id);
            ws.playerID = gameInfo.id;
            webSockets.push(ws);
            ws.send(JSON.stringify(gameInfo));

            connectPlayers();
        }

     });
        //If the server has two websockets waiting create a game, then it stores them together in the activeWebSocketsObject
        //after which it stores that entire object in activeGames in one Object, so activeGames[0][0], reveals websocket of first game, first player
        //Resets activeWebSocketsObject to empty and resets id
        //(Object.size(webSockets)%2 == 0) && (Object.size(webSockets) > 0  
});

function gameState(board1, board2) {
    var exitStatus = 0;
    //Return 0, if game need continues
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

function webSocketIdFinder(webS){
    var id = [];
    for(var x = 0; x < activeGames.length; x++){
        for(var i = 0; i < activeGames[x].length; i++){
            if(activeGames[x][i] == webS){
                id = [x,i];
            }
        }

    }
    return id;
}

function endGame(ws1, ws2){
    webS1Index = webSocketIdFinder(ws1);

    ws1.close()
    ws2.close();
    //Problem is they are not deleting as they should when game is closed
    //Hence splash screen is not displayed properly
    activeGames.splice([webS1Index[0]],1);
    gameBoards.splice([webS1Index[0]],1);
    
}

function findPlayerIndex(ws){
    for(var i = 0; i < playerInfo.length; i++){
        if(playerInfo[i].id == ws.playerID){
            return i;
        }
    }
}
//When a player wins
function playerWon(player, ws1, ws2){
//If player == 0, player 1 won
    var playerIndex1 = findPlayerIndex(ws1);
    var playerIndex2 = findPlayerIndex(ws2);
    if(player == 1){        
        ws1.send("won");
        playerInfo[playerIndex1].won++;

        ws2.send("lost");
        playerInfo[playerIndex2].lost++;

        endGame(ws1,ws2);

    }else if(player == 0){

        ws2.send("won");
        playerInfo[playerIndex2].won++;

        ws1.send("lost");
        playerInfo[playerIndex1].lost++;

        endGame(ws1, ws2);
    }
//If player === 1, player 2 won
}

function connectPlayers(){   
    if(webSockets.length == 2) {
        for(var i = 0; i < webSockets.length; i++){
            activeWebSockets.push(webSockets[i]);
        }
        //Stores activeWebSockets Object activeGames
        activeGames.push(activeWebSockets);
        endGameValue.push(false);
        
        gameBoards.push(tempGameBoards);
        tempGameBoards = [];

        // activeWebSockets[0].send("player 1 sent");
        // activeWebSockets[2].send("player 2 sent");
        startGame(activeWebSockets[0],activeWebSockets[1]);
        activeWebSockets = [];
        webSockets = [];
        
    }
};

function moveCheck(str,ws1, ws2){
    var row = parseInt(str[0],10);
    var col = parseInt(str[1],10);

    var boardIndex = webSocketIdFinder(ws2);
    var board = gameBoards[boardIndex[0]][boardIndex[1]];

    //If what is hit is a Ship
    if(board[row][col] == 1){
        board[row][col] = 2;
        ws1.send("hit");
        ws2.send("boardhit"+row+","+col);
    }else if(board[row][col] == 0){
        board[row][col] = 3;
        ws1.send("miss");
        ws2.send("boardmiss"+row+","+col);
    }else{
        ws1.send("invalid");
    }
}

function startGame(ws1, ws2){
    //ws1 Turn
    ws1.send("yourTurn");
    
    //Wait for ws1 response
    ws1.on("message",function incoming(str){
        //ws1 replies with the board Information
        if(str.split("").length == 2){
            str = str.split("");

            //Checks the move and updates the board
            moveCheck(str,ws1,ws2);


        }else if(typeof JSON.parse(str) == 'object'){
            var temp = webSocketIdFinder(ws2);
            var currentGameState = gameState(JSON.parse(str).board, gameBoards[temp[0]][temp[1]]);
            //If no one has won, game continue
            
            if(currentGameState == 0){
                //player2 Turn
                ws2.send("yourTurn");

            //IF player 1 has won
            }else if(currentGameState == 1){
                //IF player 1 has won
                playerWon(0, ws1, ws2);
            }else{
                playerWon(1, ws1, ws2);
            }
        }
    });

    ws2.on('message', function incoming(str){
        if(str.split("").length == 2){
            str = str.split("");

            //Checks the move and updates the board
            moveCheck(str,ws2,ws1);


        }else if(typeof JSON.parse(str) == 'object'){
            var temp = webSocketIdFinder(ws1);
            var currentGameState = gameState(gameBoards[temp[0]][temp[1]],JSON.parse(str).board);
            
            //If no one has won, game continue when GameState = 0
            if(currentGameState == 0){
                //player2 Turn
                ws1.send("yourTurn");
            }else if(currentGameState == 1){
                //IF player 1 has won
                playerWon(0, ws1, ws2);
            }else{
                playerWon(1, ws1, ws2);
            }
        }
    });

    
    var webS1Index;
    
    ws1.on('close', function(){
        webS1Index = webSocketIdFinder(ws1);
        if(endGameValue[webS1Index[0]] == false){
            endGameValue[webS1Index[0]] = true;
            endGame(ws1, ws2);
        }
    });

    ws2.on('close', function(){
        webS1Index = webSocketIdFinder(ws1);
        if(endGameValue[webS1Index[0]] == false){
            endGameValue[webS1Index[0]] = true;
            endGame(ws1, ws2);
            
        }
    });
    //Process Information
    //Check gameState
    //ws2 Turn
    
    //wait for ws2 response
    //Process Information
    //Check gameState
    //Call function startGame();
}
//Checks if the game needs to continue or has ended(P1 / P2 has won)


server.listen(port);

