// REQUEST command
const SWAP_GEM = "Battle.SWAP_GEM";
const USE_SKILL = "Battle.USE_SKILL";
const SURRENDER = "Battle.SURRENDER";
const FINISH_TURN = "Battle.FINISH_TURN";
const I_AM_READY = "Battle.I_AM_READY";

const ENEMY_PLAYER_ID = 0;
const BOT_PLAYER_ID = 2;

var sfs;
var room;

var botPlayer;
var enemyPlayer;
var currentPlayerId;
var grid;

// Connect to Game server
initConnection();

function initConnection()
{
	document.getElementById("log").innerHTML = "";

	trace("Connecting...");

	// Create configuration object
	var config = {};
	config.host = "172.16.100.112";
	config.port = 8080;
	// config.host = "172.16.15.54";
	// config.port = 8888;
	//config.debug = true;
	config.useSSL = false;

	// Create SmartFox client instance
	sfs = new SFS2X.SmartFox(config);

	// Set logging
	sfs.logger.level = SFS2X.LogLevel.INFO;
	sfs.logger.enableConsoleOutput = true;
	sfs.logger.enableEventDispatching = true;

	sfs.logger.addEventListener(SFS2X.LoggerEvent.DEBUG, onDebugLogged, this);
	sfs.logger.addEventListener(SFS2X.LoggerEvent.INFO, onInfoLogged, this);
	sfs.logger.addEventListener(SFS2X.LoggerEvent.WARNING, onWarningLogged, this);
	sfs.logger.addEventListener(SFS2X.LoggerEvent.ERROR, onErrorLogged, this);

	sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
	sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);

	sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
	sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);

	sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, OnRoomJoin, this);
	sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, OnRoomJoinError, this);
	sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, OnExtensionResponse, this);	

	// Attempt connection
	sfs.connect();
}

function onDisconnectBtClick()
{
	// Log message
	trace("Disconnecting...");

	// Disconnect
	sfs.disconnect();
}

//------------------------------------
// LOGGER EVENT HANDLERS
//------------------------------------

function onDebugLogged(event)
{
	trace(event.message, "DEBUG", true);
}

function onInfoLogged(event)
{
	trace(event.message, "INFO", true);
}

function onWarningLogged(event)
{
	trace(event.message, "WARN", true);
}

function onErrorLogged(event)
{
	trace(event.message, "ERROR", true);
}

//------------------------------------
// SFS EVENT HANDLERS
//------------------------------------

function onConnection(event)
{
	if (event.success)
	{
		trace("Connected to SmartFoxServer 2X!<br>SFS2X API version: " + sfs.version + "<br> IP: " + sfs.config.host);
	}
	else
	{
		trace("Connection failed: " + (event.errorMessage ? event.errorMessage + " (" + event.errorCode + ")" : "Is the server running at all?"));

		// Reset
		reset();
	}
}

function onConnectionLost(event)
{
	trace("Disconnection occurred; reason is: " + event.reason);

	reset();
}

//------------------------------------
// OTHER METHODS
//------------------------------------

function trace(message, prefix, isDebug)
{
	var text = document.getElementById("log").innerHTML;

	var open = "<div" + (isDebug ? " class='debug'" : "") + ">" + (prefix ? "<strong>[SFS2X " + prefix + "]</strong><br>" : "");
	var close = "</div>";

	if (isDebug)
		message = "<pre>" + message.replace(/(?:\r\n|\r|\n)/g, "<br>") + "</pre>";

	document.getElementById("log").innerHTML = text + open + message + close;
}

function reset()
{
	// Remove SFS2X listeners
	sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION, onConnection);
	sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost);
	
	sfs.logger.removeEventListener(SFS2X.LoggerEvent.DEBUG, onDebugLogged);
	sfs.logger.removeEventListener(SFS2X.LoggerEvent.INFO, onInfoLogged);
	sfs.logger.removeEventListener(SFS2X.LoggerEvent.WARNING, onWarningLogged);
	sfs.logger.removeEventListener(SFS2X.LoggerEvent.ERROR, onErrorLogged);
	
	sfs = null;
}

function onLoginBtnClick()
{
	let uName = document.getElementById("accountIn").value;
	trace("Try login as " + uName);

	let data = new SFS2X.SFSObject();
	data.putUtfString("BATTLE_MODE", "NORMAL");
	data.putUtfString("ID_TOKEN", "bot");
	data.putUtfString("NICK_NAME", uName);

	var isSent = sfs.send(new SFS2X.LoginRequest(uName, "", data, "gmm"));

	if (isSent) trace("Sent");
}

function onLoginError(event)
{
	var error = "Login error: " + event.errorMessage + " (code " + event.errorCode + ")";
	trace(error);
}

function onLogin(event)
{
	trace("Login successful!" +
		  "\n\tZone: " + event.zone +
		  "\n\tUser: " + event.user);

	document.getElementById("loginBtn").style.visibility = "hidden";
	document.getElementById("findBtn").style.visibility = "visible";
}

function findGame(){
	var data = new SFS2X.SFSObject();
	data.putUtfString("type", "");
	data.putUtfString("adventureId", "");
	sfs.send(new SFS2X.ExtensionRequest("LOBBY_FIND_GAME", data));
}

function OnRoomJoin(event)
{
	trace("OnRoomJoin " + event.room.name);

	room = event.room;
}

function OnRoomJoinError(event)
{
	trace("OnRoomJoinError");
	console.error(event);
}

function OnExtensionResponse(event)
{
	let evtParam = event.params;
	var cmd = event.cmd;
	trace("OnExtensionResponse " + cmd);

	switch (cmd){
		case "START_GAME":
			let gameSession = evtParam.getSFSObject("gameSession");
			StartGame(gameSession, room);
			break;
		case "END_GAME":
			//endGame();
			break;
		case "START_TURN":
			//StartTurn(evtParam);
			break;
		case "ON_SWAP_GEM":
			//SwapGem(evtParam);
			break;
		case "ON_PLAYER_USE_SKILL":
			//HandleGems(evtParam);
			break;
		case "PLAYER_JOINED_GAME":
			sfs.send(new SFS2X.ExtensionRequest(I_AM_READY, new SFS2X.SFSObject(), room));
			break;
	}
}

function StartGame(gameSession, room)
{
	// Assign Bot player & enemy player
	AssignPlayers(room);

	// Player & Heroes
	let objBotPlayer = gameSession.getSFSObject(botPlayer.displayName);
	let objEnemyPlayer = gameSession.getSFSObject(enemyPlayer.displayName);

	let botPlayerHero = objBotPlayer.getSFSArray("heroes");
	let enemyPlayerHero = objEnemyPlayer.getSFSArray("heroes");

	for (let i = 0; i < botPlayerHero.size(); i++)
	{
		botPlayer.heroes.push(new Hero(botPlayerHero.getSFSObject(i)));
	}

	for (let i = 0; i < enemyPlayerHero.size(); i++)
	{
		enemyPlayer.heroes.push(new Hero(enemyPlayerHero.getSFSObject(i)));
	}

	// Gems
	grid = new Grid(gameSession.getSFSArray("gems"), botPlayer.getRecommendGemType());
	currentPlayerId = gameSession.getInt("currentPlayerId");
	trace("StartGame ");

	// SendFinishTurn(true);
	//taskScheduler.schedule(new FinishTurn(true), new Date(System.currentTimeMillis() + delaySwapGem));
	//TaskSchedule(delaySwapGem, _ => SendFinishTurn(true));
}

function AssignPlayers(room) {
	let user1 = room.getPlayerList()[0];
	trace("id user1: " + user1.name);

	if (user1.IsItMe) {
		botPlayer = new Player(user1.PlayerId, "player1");
		enemyPlayer = new Player(ENEMY_PLAYER_ID, "player2");
	} else {
		botPlayer = new Player(BOT_PLAYER_ID, "player2");
		enemyPlayer = new Player(ENEMY_PLAYER_ID, "player1");
	}
}