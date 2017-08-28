import { m, h } from './classes/dom';
import { person } from './assets/characters'
import { floor, stage } from './assets/environment'
import { prefix, centerEl, waterfall, p } from './assets/utils'
import ui from './assets/ui'
import objects from './assets/object'

class ClientApp{
  constructor(socket){
    //state
    this.socket = socket
    this.init = false
    this.info = {}
    this.game = null
    this.width = 1024
    this.height = 768
    this.scale = 10
    this.character = null
    this.stage = null
    this.controls = null
    this.statusui = {}
    this.container = h('div', {className: 'game', width: this.width+'px', height: this.height+'px'})
    this.itemOpen = false
    //init
    this.initComm(socket)
    this.resize()
    this.err = false
  }

  bindKeys(){
    //TODO: use areaay to handle it dynamically
    document.onkeydown = e => {
      e = e || window.event;
      switch (e.which || e.keyCode) {
        case 13: //enter
          this.controls.submitEl.click()
          break;
      }
    }
  }

  home(){
    this.character = person(this.info)
    m(this.character.el, this.container);

    centerEl(this.character.el, this.character.width, this.character.height, 'em')
    this.character.el.style.left = "20%"
    m(this.container)
    const { skins, hairs } = DATA.COLORS;
    const { stories } = DATA
    waterfall([
      //ask name
      p( next=> m(
        ui.ask(
          'your name',
          name => this.emit('updateInfo', {name}, ()=>next()) ),
          this.container
        )
      ),
      //skin
      p( next=> m(
        ui.pick(
          'skin',
          skins.map( s=> h('div', { className:'opt-color', background: s})),
          skin => this.emit('updateInfo', {skin}),
          skin => this.emit('updateInfo', {skin}, ()=>next()) ),
          this.container
        )
      ),
      //hair
      p( next=> m(
        ui.pick(
          'hair',
          hairs.map( s=> h('div', {className:'opt-color', background: s})),
          hair => this.emit('updateInfo', {hair}),
          hair => this.emit('updateInfo', {hair}, ()=>next()) ),
          this.container
        )
      ),
      //open games
      p(
        next=> m(
          ui.alert(
            stories[0],
            'start game',
            ()=> this.emit('queueGame', {}, ()=>next())
          )
        )
      )
    ]).then(()=>console.log('waiting game'))
  }

  initGame(){
    //initialize stage
    console.log('Init game', this.game)

    //initialize player
    this.player = this.game.players.find(p=>p.id == this.info.id)
    console.log('This Player', this.player)

    //hide avatar
    this.character.el.hide();

    this.stage = stage(
      this.game.lobby.env, //env
      this.container, //container
      this.game.players, //players
      this.game.lobby.name
    )
    //control content
    this.controls = ui.controls(m=>this.emit('gamemsg', m));

    //chat and log
    this.socket.on('gamemsg', logs=>{
      this.controls.logs(this.game.logs = logs)
    })

    //on stage change
    this.socket.on('changeStage', d=>{
      console.log('changesatege', d)
      this.player.status.loc = d.loc
      this.player.status.place = d.place
      this.stage.changeStage(this.game, this.player)
      this.stage.changePlayers(this.game.players)
      this.map.update(d.loc)
    })

    //playerchagne
    this.socket.on('changePlayers', p=>{
      this.game.players = p;
      console.log('change paleyrs', p)
      this.stage.changePlayers(this.game.players)

    })

    //game status
    this.socket.on('gameinfo', info=>Object.assign(this.game, info))

    this.bindKeys()

    //render game
    m(this.controls.el, this.container)
    m(this.stage.el, this.container)
    this.renderStatus();
    this.renderActions();
  }

  renderStatus(){
    const updateAttr = () => {
      let attrs = h('div', 'attrs')
      for(let attr in this.player.status.attrs){
        if(attr === 'hp'){
          this.statusui.hp = ui.progress('hp', 3, 30, this.player.status.attrs[attr])
          m(this.statusui.hp.el, this.controls.statusBox)
        }else{
          m(ui.text(`${attr}: ${this.player.status.attrs[attr]}`), attrs)
        }
      }
      return attrs;
    }

    this.socket.on('changeAttr', attrs=>{
      console.log('new attr', attrs)
      this.controls.statusBox.empty()
      if(attrs.hp < this.player.status.attrs.hp) this.stage.hurt()
      this.player.status.attrs = attrs
      m(updateAttr(), this.controls.statusBox)
    })
  }

  renderActions(){
    this.controls.actionBox.empty()
    ui.removeAll('ui dialog')

    //function action map
    let btnMap = ui.button('map')
    this.map = ui.map(this.game.map, this.player.status.loc, (x,y)=>console.log('map:', x,'-', y))

    m(this.map.el)
    this.map.el.hide()
    btnMap.click(()=>this.map.el.show())

    //function action items
    const updateItems = items=>{
      this.player.status.items = items;
      let el = ui.pick(
        'Items',
        this.player.status.items.map( item=> {
          let str = typeof item === 'string' ? item : `${item.name}${item.grade > 0 ? '+'+item.grade: ''} ${item.eq ? '[Equiped]': ''}`
          let el = h('div', {className:'opt-item'}, str)
          el.style.color = grades[item.grade]
          return el;
        }),
        i => this.emit('useitem', i),
        ()=>this.itemOpen = false,
        'items'
      )

      m(el)
      if(this.itemEl){
        this.itemEl.parentNode.removeChild(this.itemEl)
        this.itemEl = el;
      }else{
        this.itemEl = el;
      }
      if(!this.itemOpen) this.itemEl.hide()
    }

    //updateItems(this.player.status.items)

    let btnItem = ui.button('item')
    btnItem.click(()=>{
      this.itemOpen = true
      this.itemEl.show()
    })

    this.socket.on('changeItems', updateItems)

    const updateBtns = (acts = []) => {
      //console.log('actions', acts)
      this.controls.actionBox.empty()
      const fnAct = {
        'map': btnMap
      }

      m(acts.map( act=>{
        if(act in fnAct){
          return fnAct[act]
        }else{
          let btn = ui.button(act)
          btn.click(()=>this.emit('gameaction', act))
          return btn;
        }
      } ).concat(btnItem), this.controls.actionBox)
    }

    this.socket.on('changeActions', updateBtns)
  }

  emit(e, m, cb){
    this.socket.emit(e, m, cb)
  }

  initComm(socket){
    socket.on('initGame', info=>{
      this.game = info
      this.initGame();
    })

    socket.on('updateInfo', info=> {
      this.info = info
      if(!this.init){
        this.init = true;
        this.home()
      }
      this.character.updateInfo(this.info)
    })

    socket.on('connect', id => {

    });

    socket.on('disconnect', this.onErr);
    socket.on('connect_error', this.onErr);
    socket.on('error', this.onErr);

    socket.on('gg', msg=>this.onErr(msg))
  }

  onErr(msg){
    if(!this.err) m(ui.alert(msg || 'You are disconnected', 'ok', ()=>window.location.reload(true) ))
  }

  resize(){
    centerEl(this.container, this.width, this.height)
    this.container.style.fontSize= `${this.scale}px`
  }
}

prefix(document.body, 'background', 'radial-gradient(ellipse at center, #b5bdc8 0%,#828c95 36%,#28343b 100%)')


const socket = io({ upgrade: false, transports: ["websocket"] });

let App = new ClientApp(socket);
