import EventEmitter from 'micro-events';
import User from './model/user';
import Game from './model/game';

class ServerApp {
	constructor(){
		this.events = new EventEmitter();
		this.events.maxListeners = 999;
		this.users = []
		this.games = []

		setInterval(this.crons.bind(this), 5000)
	}

	crons(){
		//status
			//console.log('online users', this.users)
			//console.log('online games', this.games)

		//remove empty games
		this.games.forEach( game=> {
			if(game.empty()) this.removeGame(game)
		})

		//check all open games and start them


	}

	createNewGame(user, id=uuid()){
		let game = new Game(this.events, id);
		game.addPlayer(user);
		this.addGame(game);
		//user.socket.nsp.to(room).emit('map', game.getMap());

		return id;
	}

	queueGame(user){
		if(this.noGames()){
			this.createNewGame(user)

		}else{
			//join existing game
			let openGames = this.openGames()
			openGames[0].addPlayer(user)
		}
	}

	noGames(){
		return this.openGames().length === 0
	}

	openGames(){
		return this.games.filter(g=>g.status == 0)
	}

	addGame(game){
		this.games.push(game)
	}

	removeGame(game){
		game.end()
		console.log('remove game: ', game.id)
		this.games.removeItem(game)
	}

	removeUser(user){
		this.users.removeItem(user);
		this.events.emit('remove-user', user)
	}

	addUser(user){
		this.users.push(user)
	}

	router(socket) {
		let user = new User(socket)
		this.addUser(user)

		socket.on("disconnect", ()=> {
			console.log("Disconnected: " + socket.id);
			this.removeUser(user)
		});

		socket.on('updateInfo', (info, cb)=>{
			user.updateInfo(info)
			console.log('updated user: ', user.info)
			if(cb)cb()
		})

		socket.on('queueGame', (req, cb)=> {
			this.queueGame(user)
			cb()
		})

		socket.on('newgame', ()=> {
			if(user.game) {
				return console.log('Already in game')
			}else{
				this.createNewGame('abc123', user)
			}
		})

		console.log("Connected: " + socket.id);
		user.updateUser()
	}
}

export default ServerApp
