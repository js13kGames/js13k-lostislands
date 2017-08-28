'use strict';

function _each(arr, func, thisArg) {
    for (var i = 0; i < arr.length; i++) {
        func.call(thisArg, arr[i]);
    }
}

function _remove(arr, element) {
    var index = arr.indexOf(element);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

function _contains(arr, element) {
    return arr.indexOf(element) !== -1;
}

function EventEmitter() {
    this.listeners = {};
}

EventEmitter.prototype.maxListeners = 10;

function _validateEventName(eventName) {
    if (typeof eventName !== 'string') {
        throw 'eventName is not a string';
    }
}

function _validateListener(listener) {
    if (typeof listener !== 'function') {
        throw 'listener is not a function';
    }
}

EventEmitter.prototype.on = function (eventName, listener) {
    _validateEventName(eventName);
    _validateListener(listener);
    this.listeners[eventName] = this.listeners[eventName] || [];
    if (this.listeners[eventName].length > this.maxListeners) {
        throw 'Exceeded maxListeners - You might have a memory leak';
    }
    if (!_contains(this.listeners[eventName], listener)) {
        this.listeners[eventName].push(listener);
        this.emit('on', {
            eventName: eventName,
            listener: listener
        });
    }
    return this;
};

EventEmitter.prototype.emit = function (eventName, event) {
    _validateEventName(eventName);
    var events = Array.prototype.slice.call(arguments, 1);
    _each(this.listeners[eventName] || [], function (listener) {
        listener.apply(this, events);
    }, this);
    return this;
};

EventEmitter.prototype.off = function (eventName, listener) {
    _validateEventName(eventName);
    _validateListener(listener);
    _remove(this.listeners[eventName] || [], listener);

    this.emit('off', {
        eventName: eventName,
        listener: listener
    });
    return this;
};

EventEmitter.prototype.clearListeners = function (eventName) {
    _validateEventName(eventName);
    this.listeners[eventName] = null;
    return this;
};

var index = EventEmitter;

/**
 * User session class
 * @param {Socket} socket

  status:
	0: standby
	1: ingame
 */
class User {
	constructor(socket){
		this.id = socket.id;
		this.socket = socket;
		this.info = {
			id: this.id,
      name: 'player',
      hair: 0,
      skin: 0,
			status: 0,
			game: null
    };
	}

	updateInfo(info){
		//console.log('updating info', this.id,  info)
    if(info.name) this.info.name = info.name
    if(info.hair > -1) this.info.hair = info.hair
    if(info.skin > -1) this.info.skin = info.skin
		if(info.status) this.info.status = info.status

		this.updateUser()
  }

	updateUser(){
		this.socket.nsp.to(this.socket.id).emit('updateInfo', this.info)
	}
}

class Area {
  constructor(map_size){
    let area = random(MAPS.areas, 3)
    this.id = area[0]
    this.x= getRandom(1, map_size - area[3] - 1)
    this.y= getRandom(1, map_size - area[3] - 1)
    this.w= getRandom(area[2], area[3])
    this.h= getRandom(area[2], area[3])
  }

  getRndPt(){
    return {
      x:　getRandom(this.x, this.r()),
      y: getRandom(this.y, this.b())
    }
  }

  mid(){
    return {
      x: this.x + (this.w/2),
      y: this.y + (this.h/2)
    }
  }

  r(){
    return this.x + this.w
  }

  b(){
    return this.y + this.h
  }
}

class Item{
    constructor(id, luk = 3, epv = 10){
      this.item = ITEMS.data[id]
      this.name = id
      this.eq = false
      this.pos = this.item.pos
      this.grade = this.getGrade(luk, epv)
      this.obj = this.item.obj + this.grade;
      this.bonus = this.item.factor * this.grade;
    }

    attr(key){
      return this.item.attrs[key] ? this.item.attrs[key] > 0 ? this.item.attrs[key] + this.bonus : this.item.attrs[key] :0
    }

    getGrade(luk, epv){
      let grade = 1;
      let min, max
      switch (true) {
        case (epv < 20):
          min = 1000;
          max = 2999;
          break;
        case (epv >= 20 && epv < 40):
          min = 2000;
          max = 4999;
          break;
        case (epv >= 40 && epv < 60):
          min = 4000;
          max = 6500;
          break;
        case (epv >= 60):
          min = 5000;
          max = 6999;
      }

      return ~~((getRandom(min, max) + (luk * 50)) / 1000) - 1;
    }
}

class Character{
  constructor(user, time = 0, id = -1){
    this.id = id
    this.status = {
      nextTime: time,
      rdy: false,
      attrs: {
        hp: 100,
        atk: getRandom(7,10),
        def: getRandom(2,5),
        spd: 4,
        luk: getRandom(3,4),
      },
      place: null,
      items: ['map', new Item('hemlet', 0, 10), new Item('armor', 0, 10), new Item('axe', 0, 10)],
      loc: { x: -1, y: -1},
    }

    this.info = {
      skin: user.info.skin,
      hair: user.info.hair,
      name: user.info.name
    }
  }

  attr(){
    return this.status.items.reduce((attrs, item)=> {
      if(typeof item === 'string') return attrs;
      let data = Object.assign({}, attrs)
      if(item.eq){
        Object.keys(this.status.attrs).forEach(atr=> {
          data[atr] = data[atr] + item.attr(atr)
        })
      }
      return data;
    }, this.status.attrs)
  }

  atk(p, cb){
    //calculate damage
    //critical token
    let crit = getRandom(1,25) < this.attr().luk
    let dmg = ~~(this.attr().atk + getRandom(1,5) - p.attr().def)

    p.status.attrs.hp = p.status.attrs.hp - dmg;

    cb(p, this)
  }
}

class Monster extends Character {
  constructor(epv = 10, type = 0){
    //type 0 orc
    super({
      info:{
        name: 'Monster',
        skin: 5,
        hair: 4
      }
    })

    this.status.items.forEach(i=>{
      if(typeof i !== 'string') i.eq = true
    })
  }
}

class Place {
  constructor(type, name, x=-1, y=-1){
    //console.log(type)
    this.name = name || type[1]
    this.type = type || random(MAPS.areas)
    this.x = x;
    this.y = y;
    this.monsters = [new Monster()]
    this.env = {
      back: random(this.type[7][0]),
      bottom: random(this.type[7][1]),
      backEls: this.genBackEls(4)
    }
  }

  genBackEls(x){
    let objs = []

    for(let i = 0; i < x; i++){
      objs.push(random(this.type[7][2]))
    }

    return objs
  }
}

class Map {
  constructor(size = 64){
    this.map = null;
    this.map_size = size
    this.areas = []
    this.places = []
    this.types = {}
  }

  generate(){
    this.map = []

    //console.log('world-init maps')
    for (let x = 0; x < this.map_size; x++) {
      this.map[x] = []
      for( let y = 0; y < this.map_size; y++) {
        this.map[x][y] = 0;
      }
    }

    let room_count = getRandom(10, 30);

    //console.log('world-creating areas')
    for(let i = 0; i < room_count; i++){
      let area = new Area(this.map_size)

      if(this.isCollide(area)) {
        i--;
        continue;
      }

      area.w--;
      area.h--;

      this.areas.push(area);
    }

    //console.log('world-squash areas')
    //this.squashRooms();

    //find path
    //console.log('world-make paths')
    this.areas.forEach( areaA => {
      let areaB = this.closestRoom(areaA)
      //console.log('world-pass close area', areaB)
      let ptA = areaA.getRndPt()
      let ptB = areaB.getRndPt()
      //console.log( 'rd pts', ptA, ptB)
      while( (ptB.x != ptA.x) || (ptB.y != ptA.y) ){
          if(ptB.x != ptA.x){
            if (ptB.x > ptA.x) ptB.x--
            else ptB.x++
          }else if(ptB.y != ptA.y){
            if(ptB.y > ptA.y) ptB.y--
            else ptB.y++
          }

          this.map[ptB.x][ptB.y] = 1;
      }
    })

    //console.log('world-fill rooms')
    //set room to 1
    this.areas.forEach( area=>{
      for(let x = area.x; x < area.r(); x++) {
        for(let y = area.y; y < area.b(); y++) {
          this.map[x][y] = area.id;
        }
      }
    })

    //console.log('world-build sand')
    //make america great again
    for( let x = 0; x < this.map_size; x++){
      for( let y = 0; y < this.map_size; y++){
        if(this.map[x][y] == 1){
          for( let _x = x-1; _x <=x + 1; _x++){
            for( let _y = y-1; _y<=y+1; _y++){
              if(this.map[_x][_y] == 0) this.map[_x][_y] = 2
            }
          }
        }
      }
    }

    //generate places
    for (let x = 0; x < this.map_size; x++) {
      this.places[x] = []
      for( let y = 0; y < this.map_size; y++) {
        this.places[x][y] = new Place(MAPS.areas[this.map[x][y]], null, x, y);
        if(!this.types[this.map[x][y]]){
          this.types[this.map[x][y]] = [this.places[x][y]]
        }else{
          this.types[this.map[x][y]].push(this.places[x][y])
        }
      }
    }
  }

  closestRoom(area) {
    let ptM = area.mid()

    let closet = null;
    let closetDst = 1000;

    this.areas.forEach( _area => {
      if(_area == area) return;
      let checkPtM = _area.mid();
      let dst = Math.abs(ptM.x - checkPtM.x) + Math.abs(ptM.y - checkPtM.y)
      if(dst < closetDst) {
        closetDst = dst
        closet = _area
      }
    })

    return closet
  }

  // squashRooms(){
  //   for(let i = 0; i < 10; i++) {
  //     this.areas.forEach( (area, j)=>{
  //       while(true){
  //         let ptOld = {
  //           x: area.x,
  //           y: area.y
  //         }
  //         if( area.x > 1) area.x--;
  //         if( area.y > 1) area.y--;
  //         if( (area.x == 1) && (area.y ==1) ) break;
  //         if( this.isCollide(area, j) ) {
  //           area.x = ptOld.x
  //           area.y = ptOld.y
  //           break;
  //         }
  //       }
  //     })
  //   }
  // }

  isCollide(area, ignore){
    for(let i = 0; i < this.areas.length; i++){
      if( i == ignore) continue;
      let check = this.areas[i]

      if(!(
        (area.r() < check.x) ||
        (area.x > check.b()) ||
        (area.b() < check.y) ||
        (area.y > check.r())
      )) return true;
    }

    return false;
  }
}

/*
  game status = {
    0: open
    1: starting
    2: playing
    3: end
  }
*/
console.log('maps', MAPS)
console.log('items', ITEMS.data)


class Game {
  constructor(emmiter, id){
    this.map = new Map();
    this.id = id;
    this.maxPlayers = 4;
    this.events = emmiter;
    this.players = {}
    this.status = 0;
    this.logs = []
    this.socket = null
    this.time = 0
    this.countdown = 5
    this.actions = {
      map: {
        req: p=> p.status.items.indexOf('map') > -1
      },
      ready: {
        req: p=> !p.status.rdy,
        act: pid=> {
          this.players[pid].status.rdy = true
          this.log(`${this.players[pid]['info'].name} is ready`)
          this.changeActions(pid)
        }
      },
      'go left': {
        req: p=> p.status.nextTime < this.time && p.status.loc.y > 0,
        act: pid=> this.changePlace(pid, this.players[pid], {y: this.players[pid].status.loc.y - 1})
      },
      'go right': {
        req: p=> p.status.nextTime < this.time && p.status.loc.y >= 0 && p.status.loc.y < 64 ,
        act: pid=> this.changePlace(pid, this.players[pid], {y: this.players[pid].status.loc.y + 1})
      },
      'go up': {
        req: p=> p.status.nextTime < this.time && p.status.loc.x > 0,
        act: pid=> this.changePlace(pid, this.players[pid], {x: this.players[pid].status.loc.x - 1})
      },
      'go down': {
        req: p=> p.status.nextTime < this.time && p.status.loc.x >= 0 && p.status.loc.x < 64 ,
        act: pid=> this.changePlace(pid, this.players[pid], {x: this.players[pid].status.loc.x + 1})
      },
      atk: {
        req: p=> p.status.nextTime < this.time,
        act: pid=> {

        }
      }
    }
    //generate map
    this.map.generate()
    //generate lobby
    this.lobby = new Place(null, 'game lobby')
    this.log(`Game ${id} created. `)
    this.events.on('remove-user', user => this.removePlayer(user.id))

    this.timer = setInterval(()=>this.tick(), 1000)
  }

  changeActions(id){
    if(!(id in this.players))return;
    this.comm('changeActions', Object.keys(this.actions).map(act=> {
      if(this.actions[act].req(this.players[id])) return act;
    }).filter(i=>i), id)
  }

  getMap() {
    return this.map.map
  }

  log(msg) {
    console.log(this.id+':'+msg)
    this.logs.push(msg)
    this.comm('gamemsg', this.logs)
  }

  tick() {
    this.time++

    if(this.status === 0){
      switch (this.time) {
        case 6:
          this.log('all players will be automatically ready in 10 seconds')
          break;
        case 11:
          this.eachPlayer(p=>p.status.rdy = true)
          break;
      }
    }

    if(this.status === 0 && !Object.keys(this.players).find(p=>!this.players[p].status.rdy)){
      this.status = 1;
    }

    //starting game
    if(this.status === 1){
      this.log('Game will start in ' + this.countdown);
      this.countdown--;
      if(this.countdown === 0) this.startGame();
    }

    if(this.status === 2){
      //in game logics


      //only act within player
      this.eachPlayer((p,pid)=>{

        //make monster atk players
        p.status.place.monsters.forEach(m=>{
          this.ai(m, p)
        })

        //update available actions
        this.changeActions(pid)
      })
    }

    this.comm('gameinfo', {time: this.time})
  }

  ai(monster, player, cb){
    //check monster is actable
    if(monster.status.nextTime > this.time) return;
    //atk the player
    monster.atk(player, (p, m)=>{
      //console.log(p, p.status.attrs)
      monster.status.nextTime = this.time + monster.attr().spd

      if(p.status.attrs.hp <= 0) this.death(p, m);
      else {
        this.changeAttr(p.id, p)
      }
    })
  }

  death(p, by){
    //end game for player
    this.log(`${p.info.name} is killed by ${by.info.name}`);
    this.removePlayer(p.id);

    this.comm('gg', `Game Over! You are killed by ${by.info.name}`)
  }

  eachPlayer(cb){
    Object.keys(this.players).forEach(pid=>{
      cb(this.players[pid], pid)
    })
  }

  comm(e, m, id){
    if(this.socket) this.socket.to(id || this.id).emit(e, m)
  }

  changePlace(pid, p, loc){
    Object.assign(p.status.loc, loc)
    p.status.place = this.map.places[p.status.loc.x][p.status.loc.y]

    this.comm('changeStage', {
      loc: p.status.loc,
      place: p.status.place
    }, pid)

    this.changeActions(pid)
  }

  startGame(){
    //set new point for each player
    this.status = 2
    this.comm('gameinfo', {status: this.status})
    this.log('Game has started')

    this.eachPlayer((p, pid)=>{
      let loc = random(this.map.areas).getRndPt()
      this.changePlace(pid, p, loc)
    })
  }

  initGame(id){
    this.socket.to(id).emit('initGame', {
      id: this.id,
      status:　this.status,
      lobby:　this.lobby,
      logs: this.logs,
      time: this.time,
      players: Object.keys(this.players).map(i=>{
        return {
          id: i,
          info:this.players[i].info,
          status: this.players[i].status
        }
      }),
      map: this.getMap()
    })
  }

  updatePlayers() {
    this.comm('changePlayers', Object.keys(this.players).map(i=>{
      return {
        id: i,
        info:this.players[i].info,
        status: this.players[i].status
      }
    }))
  }

  addPlayer(user) {
    //this.log(`game ${this.id} add user`, user.id);
    if(!this.socket) this.socket = user.socket.nsp

    this.players[user.id] = new Character(user, this.time, user.id)

    user.socket.join(this.id,()=> {
      this.log(`Player ${user.info.name} join the game.`);
    });

    user.socket.on('gamemsg',msg=> {
      this.log(`${user.info.name}:${msg}`)
    })

    user.socket.on('gameaction', act=>{
      this.players[user.id].status.nextTime = this.time + (8 - this.players[user.id].attr().spd)
      if(typeof act === 'object'){
        this.actions[act.id].act(user.id, act)
      }else{
        this.actions[act].act(user.id)
      }
    })

    user.socket.on('useitem', key=>{
      let item = this.players[user.id].status.items[key]
      if(typeof item  === 'string') return;
      if(item.eq) item.eq = false
      else {
        //set everything else to false
        this.players[user.id].status.items.filter(i=>typeof i !== 'string').forEach(i=> {
          if(i.pos === item.pos) i.eq = false
        })
        item.eq = true
      }

      this.updatePlayers()
      this.changeAttr(user.id, this.players[user.id])
      this.changeItems(user.id, this.players[user.id])
    })

    user.updateInfo({ status: 1})

    this.initGame(user.id)
    this.changeActions(user.id)
    this.updatePlayers()
    this.changeAttr(user.id, this.players[user.id])
    this.changeItems(user.id, this.players[user.id])
    //if full squad
    if(this.full()){
      this.status = 1
    }

  }

  changeAttr(pid, p){
    this.comm('changeAttr', p.attr(), pid)
  }

  changeItems(pid, p){
    this.comm('changeItems', p.status.items, pid)
  }

  removePlayer(uid) {
    if(uid in this.players) {
      this.log(`Removed ${this.players[uid].info.name} from game`);
      delete this.players[uid];

    }

    //close game before cron jobs remove
    if(this.empty()) {
       this.status = 3;
    }else{
      this.updatePlayers()
    }
  }

  full() {
    return Object.keys(this.players).length >= this.maxPlayers
  }
  empty(){
    return Object.keys(this.players).length === 0;
  }
  end(){
    clearInterval(this.timer)
  }
}

class ServerApp {
	constructor(){
		this.events = new index();
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

Array.prototype.removeItem = function(item){
	return this.splice(this.indexOf(item), 1);
}

const App = new ServerApp();
module.exports = App.router.bind(App)

//# sourceMappingURL=server.js.map
