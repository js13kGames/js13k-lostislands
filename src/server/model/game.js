import Map from './map';
import Place from './place';
import Item from './item';
import Character from './character';
import Mosnter from './monster';
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
    this.boss = {
      x: getRandom(0,64),
      y: getRandom(0,64),
      mon: new Mosnter(10)
    }
    this.map = new Map(64, this.boss);
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
        req: p=> p.status.rdy && p.status.nextTime < this.time,
        act: (pid, atk)=> {
          let target = this.map.places[atk.loc.x][atk.loc.y].monsters[atk.mid]
          this.players[pid].atk(target, ()=>{
            console.log(target.status.attrs)
            //if target dead drop all the items in the map
            if(target.status.attrs.hp <= 0){
              target.status.items.forEach(item=>{
                if(typeof item !== 'string'){
                  item.eq = false
                  this.players[pid].status.items.push(item)
                }
              })
              this.map.places[atk.loc.x][atk.loc.y].monsters = []
            }
            this.updatePlace(this.map.places[atk.loc.x][atk.loc.y])
            this.changeAttr(pid, this.players[pid], pid)
            this.changeItems(pid, this.players[pid])
          })
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

        //add recover
        if(p.status.attrs.hp < 100) p.status.attrs.hp += 1
        this.changeAttr(pid, p)
        //update available actions
        this.changeActions(pid)
      })

      //check game end
      if(this.boss.mon.status.attrs.hp <= 0){
        this.eachPlayer((p, pid)=>{
          this.comm('gg', `Congratuation! You won! Socre: ${this.time}`)
        })
      }
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
        this.changeAttr(p.id, p, monster.id)
      }
    })
  }

  death(p, by){
    //end game for player
    this.log(`${p.info.name} is killed by ${by.info.name}`);
    this.removePlayer(p.id);

    this.comm('gg', `Game Over! You are killed by ${by.info.name}`, p.id)
  }

  eachPlayer(cb){
    Object.keys(this.players).forEach(pid=>{
      cb(this.players[pid], pid)
    })
  }

  comm(e, m, id){
    if(this.socket) this.socket.to(id || this.id).emit(e, m)
  }

  updatePlace(place){
      this.eachPlayer((p, pid)=>{
        if(p.status.place.x == place.x && p.status.place.y === place.y){
          this.comm('updatePlace', place, pid)
        }
      })
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
      boss: this.boss,
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
    this.players[user.id].status.items.push(new Item('sword', 0, 10))
    user.socket.join(this.id,()=> {
      this.log(`Player ${user.info.name} join the game.`);
    });

    user.socket.on('gamemsg',msg=> {
      this.log(`${user.info.name}:${msg}`)
    })

    user.socket.on('gameaction', act=>{
      if(typeof act === 'object'){
        if(this.actions[act.id].req(this.players[user.id])) {
          this.actions[act.id].act(user.id, act)
          this.players[user.id].status.nextTime = this.time + (5 - this.players[user.id].attr().spd)
        }
      }else{
        this.actions[act].act(user.id)
        this.players[user.id].status.nextTime = this.time + (5 - this.players[user.id].attr().spd)
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

  changeAttr(pid, p, by=false){
    if(by){
      this.comm('changeAttr', {
        by,
        attrs:p.attr()
      }, pid)
    }else{
      this.comm('changeAttr', p.attr(), pid)
    }
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

export default Game;
