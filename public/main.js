(function () {
'use strict';

//mount function
const m = (el, p = document.body) => Array.isArray(el) ? el.forEach( _el=>m(_el, p)): p.appendChild(el);

//dom manimulpating
const h = (type, props = {}, ...children) => {
    const node = document.createElement(type)
    const _m = (child, node) => {
      if(child instanceof Element){
        m(child, node)
      }else{
        if(!child) return;
        let text = document.createTextNode(child);
        m(text, node)
      }
    }

    if(typeof props === 'string'){
      node.className = props
    }else{
      const { className, bs, top, left, width, height, background } = props;
      node.className = className || 'pix'
      node.style.background = background || ''
      node.style.top = top || ''
      node.style.left = left || ''
      node.style.width = width || ''
      node.style.height = height || ''
      node.style.boxShadow = bs || ''
    }

    if(children.length){
      if(Array.isArray(children[0])) children = children[0]
      children.forEach( child => {
        if( Array.isArray(child) ) {
          child.forEach( _child => _m(_child, node))
        }else{
          _m(child, node)
        }
      })
    }

    //poly fills
    node.prependChild = newel => node.insertBefore(newel, node.firstChild);
    node.$m = el => m(el, node);
    node.hide = () => node.style.display = 'none';
    node.show = (p = 'inherit') => node.style.display = p;
    node.html = html => node.innerHTML = html;
    node.empty = ()=> node.html('')
    node.on = (e,cb) => node.addEventListener(e, cb)
    node.click = cb => {
      if(cb){
        node.on('click', cb)
      }else{
        const evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
        false, false, false, false, 0, null);
        node.dispatchEvent(evt)
      }
    }
    node.change = cb => node.on('change', cb)


     return node;
}


function dk(color, percent) {
    var f=parseInt(color.slice(1),16),
        t=percent<0?0:255,
        p=percent<0?percent*-1:percent,
        R=f>>16,
        G=f>>8&0x00FF,
        B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const d = (hex, color= '#080', l=0,t=0, s=8, shadow = false, cs = -.05) => {
  //hex to binary string then to 0,1 array
  try{
    let ilb = i => i%s < i/s -1
    let bin = hex.split('').reduce((acc, i) => acc + ('000' + parseInt(i, 16).toString(2)).substr(-4, 4), '')
    let str =  bin.split('').reduce( (bits, bit, i) => bits + (parseInt(bit) ? `${i%s}em ${(i/s)|0}em ${shadow && ilb(i) ? dk(color, cs) : color},` : '') , '').slice(0,-1)
    return h('div', { bs: str, className:"pix", left: l+'em', top: t+'em' });
  }catch(e){
    return;
  }

}

const a = '183c66667e7e6642'
const armor = '0044eceefefefefe7ceeee'
const axe = '0416173f3f171614101010'
const b = '7c66667e6466667c'
const bodyleft = '3f7fffdfdfdfdfdfdfdfdfdfdf'
const bodyright = 'fcfefffbfbfbfbfbfbfbfbfbfb'
const c = '3c6260606060623c'
const colon = '0000006060006060'
const comma = '0000000000303060'
const d$1 = '7c6666666666667c'
const dot = '0000000000006060'
const e = '7e60607c7c60607e'
const exc = '1818181818001818'
const f = '7e60607c7c606060'
const g = '7e6260606e66667e'
const h$1 = '6666667e7e666666'
const hair1 = '7f7fc0c0'
const hair2 = '3c7effe3c1c0'
const head = '7efefefefee0'
const heart = '48fcfc7830'
const hemlet = '003e7efee0f2f2f2'
const i = '7e7e181818187e7e'
const j = '0606060666667e7e'
const k = '66666c78786c6666'
const l = '6060606060607e7e'
const legleft = '1c1c1c1c1c1c1c1c1c1c1c7c7c'
const legright = '1c1c1c1c1c1c1c1c1c1c1c1f1f'
const longhat = '787878fcfc'
const m$1 = '4163777f7f6b6363'
const n = '63737b7f7f6f6763'
const n0 = '3c6262626262623c'
const n1 = '387818181818187e'
const n2 = '3c7e660c1830627e'
const n3 = '3c66460c0c46663c'
const n4 = '2c6c6c6c7f0c0c0c'
const n5 = '7e6060607e06467e'
const n6 = '7e6060607e62627e'
const n7 = '7e6606060c0c1818'
const n8 = '3c66663c6666663c'
const n9 = '3c4646463e06463c'
const o = '3c6666666666663c'
const p = '3c666666667c6060'
const q = '3c424242424a463d'
const qes = '3c66460e1c180018'
const r = '7c62627c786c6663'
const rect = '70707070'
const s = '3c626230184e463c'
const shorthat = '3cffff'
const slash = '0c0c181830306060'
const sword = '10101010101010387c1010'
const t = '7e7e181818181818'
const triangle = '183c7eff'
const u = '6666666666667e3c'
const v = '4266666666663c18'
const w = '6363636b7f7f7763'
const x = '6363363e1c367763'
const y = '6666667e3c181818'
const z = '7e7e0e1c38707e7e'


var images = Object.freeze({
	a: a,
	armor: armor,
	axe: axe,
	b: b,
	bodyleft: bodyleft,
	bodyright: bodyright,
	c: c,
	colon: colon,
	comma: comma,
	d: d$1,
	dot: dot,
	e: e,
	exc: exc,
	f: f,
	g: g,
	h: h$1,
	hair1: hair1,
	hair2: hair2,
	head: head,
	heart: heart,
	hemlet: hemlet,
	i: i,
	j: j,
	k: k,
	l: l,
	legleft: legleft,
	legright: legright,
	longhat: longhat,
	m: m$1,
	n: n,
	n0: n0,
	n1: n1,
	n2: n2,
	n3: n3,
	n4: n4,
	n5: n5,
	n6: n6,
	n7: n7,
	n8: n8,
	n9: n9,
	o: o,
	p: p,
	q: q,
	qes: qes,
	r: r,
	rect: rect,
	s: s,
	shorthat: shorthat,
	slash: slash,
	sword: sword,
	t: t,
	triangle: triangle,
	u: u,
	v: v,
	w: w,
	x: x,
	y: y,
	z: z
});

function prefix(el, property, value){
  let p = ['', '-webkit-', '-moz-', '-ms-', '-o-']
  p.forEach( _p => el.style[property] = _p+value)
}

const centerEl = (el, w, h, u='px') => {
  el.style.left="50%"
  el.style.top="50%"
  el.style.marginLeft = `-${w/2 + u}`
  el.style.marginTop = `-${h/2 + u}`
}

const transform = (e, sx=1,sy=1, tx=0, ty=0, r=0) => e.style.transform = `rotate(${r}deg) scale(${sx}, ${sy}) translate(${tx}em, ${ty}em) translateZ(1000px)`

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

function waterfall(list) {
  // malformed argument
  list = Array.prototype.slice.call(list);
  if (!Array.isArray(list)                    // not an array
      || typeof list.reduce !== "function"    // update your javascript engine
      || list.length < 1                      // empty array
     ) {
    return Promise.reject("err"); //Array with reduce function is needed.
  }

  if (list.length == 1) {
    if (typeof list[0] != "function")
      return Promise.reject("err " );//First element of the array should be a function, got+ typeof list[0]
    return Promise.resolve(list[0]());
  }

  return list.reduce(function(l, r){
    // first round
    // execute function and return promise
    var isFirst = (l == list[0]);
    if (isFirst) {
      if (typeof l != "function")
        return Promise.reject("err");//List elements should be function to call.

      var lret = l();
      if (!isPromise(lret))
        return Promise.reject("err");//Function return value should be a promise.
      else
        return lret.then(r);
    }

    // other rounds
    // l is a promise now
    // priviousPromiseList.then(nextFunction)
    else {
      if (!isPromise(l))
        Promise.reject("err");//Function return value should be a promise.
      else
        return l.then(r);
    }
  });
}

//turn into promise function
const p$1 = func => () => new Promise( res=> func(res))

const { data } = DATA.OBJS;

console.log('objs', data)
const objects = {
  get: (id, shadow = false) => {
    let item = data[id];
    let children = item[2].reverse().map(asset=>{
      let c = Array.isArray(asset[1]) ? random(asset[1]) : asset[1]
      let _el = d(images[asset[0]],c, asset[2], asset[3], 8, true);
      transform(_el, asset[4], asset[5], asset[6], asset[7])
      return _el
    })

    let el = h('div', { className: 'pix obj', height: item[0]+'em', width: item[1]+'em'}, children)
    if(shadow) el.prependChild(  h('div', 'shadow') )
    transform(el, item[3], item[4], item[5], item[6], item[7])

    return {
      el,
      size: [item[1], item[0]]//width , height
    };
  },
  text: (str, color="#fff", props={})=> {
    str = str.toLowerCase()
    return h('div', Object.assign({},{className: 'pix text', height: '8em', width: 8*str.length+'em'}, props ), str.split('').map((c,i)=> {
      let dicts = {
        '.': 'dot',
        ',': 'comma',
        '!': 'exc',
        '?': 'qes',
        ':': 'colon',
        '/': 'slash'
      }
      if(c in dicts) c = dicts[c]
      if(/^\d+$/.test(c)) c = 'n'+c
      return c == " " ? h('div', {width: 1+'em'}): d(images[c], color, i*8)
    } ))
  }
}

const dialogInner = (c, a) => h('div', `dialog-inner ${a}`, c ? c : null)
const dialog = (c, a) => {

  let el = h('div', 'ui dialog')
  el.$innerBox = dialogInner(c, a || 'popup')
  m(el.$innerBox, el)

  return el;
}
const dialogWithButton = (title, content, cb, btns=[], btnTxt = "ok", a = false) =>{
  let $el = dialog([objects.text(title)], a)
  if(btns.length > 0){

  }else{
    btns =  button(btnTxt)
    btns.click(()=>{
      cb()
      $el.hide()
    })
  }
  m([h('div', 'dialog-content', content), btns],$el.$innerBox)
  return $el
}
const button = (str, clz)=> h('div', clz||'btn blue', objects.text(str));
const alert = (str, btnTxt, cb) => dialogWithButton(str, [], cb, [], btnTxt);
const ask = (title, cb)=>{
  let value = ''
  let $input = h('input', 'input')
  $input.type = 'text'
  $input.change(e=>value=e.target.value)
  return dialogWithButton(title, $input, ()=>cb(value));
}
const pick = (title, options, onChange, cb, clz='', a = false) => {
  let pick = 0

  let $els = options.map( (option,i)=> {
    let el = h('span', `ui option ${clz}`, option)
    el.click(()=>{
      onChange(pick = i)
      $els.forEach( (e, i) => pick === i ? e.style.border="1px solid #fff" : e.style.border = 'none')

    })
    return el
  })

  return dialogWithButton(title, $els, ()=>cb(pick), [], 'ok', a)
}

const controls = (onNewMsg) => {
  const logEl = h('div', 'chat')
  const inputEl = h('input', 'chat-input')
  inputEl.type = "text"
  const submitEl = button('send', 'chat-btn')
  submitEl.on('click', ()=>{
    onNewMsg(inputEl.value)
    inputEl.value = ""
  })

  //chat section
  const chatBox = h('div', 'chat-box', logEl, inputEl, submitEl)
  const logs = msgs => {
    logEl.empty();
    m(msgs.map(i=>h('p','', i)), logEl)
  }
  const getMsg = () => {
    inputEl.value = ""
    return msg;
  }

  //chat fn
  let userScroll = false
  logEl.on('scroll', ()=> userScroll = true)

  setInterval(()=>{
    if(!userScroll)logEl.scrollTop = logEl.scrollHeight;
    else if(logEl.scrollHeight - logEl.scrollTop === logEl.clientHeight) userScroll = false
  }, 100)

  // status section
  const statusBox = h('div', 'status-box')


  // ability section
  const actionBox = h('div', 'action-box')

  const el = h('div', 'controls', chatBox, statusBox, actionBox)
  return {
    el,
    logs,
    submitEl,
    actionBox,
    statusBox
  }
}

const map = (mapData, pt, boss)=>{

  const { areas } = DATA.MAPS
  const elData = []
  let _pt = pt

  let $text = h('div', 'map-text')
  let $detail = h('div', 'map-detail')
  let $map = h('div', 'map', $text, $detail)


  mapData.forEach( (row, y)=> {
    let $row = h('div', { className: 'map-row', width: row.length+'em', height: '1em'})
    elData[y] = []
    row.forEach( (col, x)=> {
      let node = h('div', {
        className: `map-node`,
        width: '1em',
        height: '1em',
        background: areas[col][4]
      })

      elData[y][x] = node;

      node.on('mouseover', ()=>{
        $text.empty()
        $text.$m(objects.text(`${areas[col][1]} x:${x} y:${y}`))
        $text.show()
      })
      $row.$m(node)
    })

    $detail.$m( $row );
  })

  elData[boss.x][boss.y].className = 'map-node active'

  $detail.on('mouseout', ()=> $text.hide())
  let el = dialogWithButton('map', $map, ()=>el.hide())

  const update = pt => {
    if(_pt.y > -1) elData[_pt.x][_pt.y].className = 'map-node'
    elData[pt.x][pt.y].className = 'map-node active'
    _pt = pt
  }

  return {
    el,
    update
  };
}

const progress = (title='', height = 1, width = 10, val = 70, max = 100, color="red") => {
  let _max = max;

  const inner = h('div', {className:'progress-bar' , background: color})
  const text = objects.text(`${title}:${val}/${max}`, '#fff')
  const el = h('div', {
    className: 'progress',
    width: width+'em',
    height: height+'em'
  }, inner, text)

  const setVal = (p) => {
    inner.style.width = (p/_max)*100 + '%'
  }

  const setMax = p => _max = p

  setVal(val)

  return {
    el,
    setVal,
    setMax
  }
}

const removeAll = clz => Array.prototype.forEach.call(document.getElementsByClassName(clz), c=>c.parentNode.removeChild(c))

var ui = {
  button,
  dialog,
  progress,
  ask,
  pick,
  alert,
  controls,
  text: objects.text,
  map,
  removeAll
};

const { skins, hairs } = DATA.COLORS;
const width = 13
const height = 31
const genSkin = (s, _h, items = []) => {
  const body = h('div', 'pix upAndDown',
    d(bodyleft, skins[s], 0, 5.5, 8, true),
    d(bodyright, skins[s], 5, 5.5),
    items.filter(i=>i.pos===2 || i.pos === 3).map(i=>i.el)
  )

  const leg = h('div', {},
    d(legleft, skins[s], 0, 18, 8, true),
    d(legright, skins[s], 4, 18)
  )

  const head$$ = h('div', 'pix upAndDown',
    d(head, skins[s], 4),
    d(hair2, hairs[_h], 4, -3, 8),
    items.filter(i=>i.pos===1).map(i=>i.el)
  )

  return [head$$, leg, body]
}

const person = (info, items = [], rev = false) => {

  const name = h('div', {className: '', top: -7+'em'} , ui.text(info.name))
  const itemEls = items.map(i=>{
    if(typeof i === 'string') return h('div')
    if(!i.eq) return h('div')
    return {
      el:objects.get(i.obj).el,
      pos: i.pos
    }
  })

  let skin = genSkin(info.skin, info.hair, itemEls)

  const character = h('div',
    {
      className: `character ${rev?'rev':''}`,
      height: height+'em',
      width: width+'em'
    },
    name,
    h('div', 'shadow'),
    skin
  )

  const updateInfo = (_info, _items = []) => {
    if(_info.name != info.name) {
      name.html('')
      info.name = _info.name
      m(ui.text(info.name), name)
    }

    if(_info.skin != info.skin || _info.hair != info.hair) {
      info.skin = _info.skin
      info.hair = _info.hair
      skin.forEach(el=>character.removeChild(el))
      skin = genSkin(info.skin, info.hair)
      m(skin, character)
    }
  }

  const changePos = (pt) => {
    character.style.left = pt[0]+'em';
    character.style.top = pt[1]+'em'
  }

  const atk = (rev) => {
    character.className = `character ${rev?'rev':''} atk`
    setTimeout(()=>character.className = `character ${rev?'rev':''}`, 500 )
  }

  const scale = (p) => character.style.fontSize = p/100+'em'

  return {
    el: character,
    info,
    width,
    height,
    updateInfo,
    scale,
    changePos,
    atk
  };
}

//stage boundry
const s$1 = {
  t: 42,
  l: 15
}

//spawn position in the map
const pos = {
  //back
  b:[1,2,3,4,5].map(i=>[i*(s$1.l)+(i-1)*(i==1?0:5), s$1.t]),
  m:[1,2,3,4,5,6].map(i=>[i*10+(i-1)*(i==1?0:10), 50]),
  f:[1,2,3,4,5,6].map(i=>[i*10+(i-1)*(i==1?0:10), 70]),
}

const { grounds, sky } = DATA.COLORS;

const patterns = [
  //stripe
  (deg=45) => `linear-gradient(${deg}deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent)`,
  //none
  () => ''
]

const sides = [
  {
    //0 grass
    size: '50px 50px',
    color: grounds[3],
    pattern: 0
  },
  {
    //1 river
    size: '6px 102px',
    color: grounds[4],
    pattern: 0
  },
  {
    //2 sky noon
    size: '',
    color: sky[0],
    pattern: 1
  },
  {
    //3 sand
    size: '',
    color: grounds[5],
    pattern: 0
  },
  {
    //4 water
    size: '',
    color: 'blue',
    pattern: 0,
    opt: 0
  }
]

const genSide = (setting, className= 'bottom') => {
    let floor = h('div', { className } )
    floor.style.backgroundColor = setting.color
    prefix(floor, 'backgroundImage', patterns[setting.pattern](setting.opt))
    floor.style.backgroundSize = setting.size
    return floor;
}

const stage = (place, gameContainer, players, name ="") => {
  let env = place.env;
  let loc = {
    x: place.x,
    y: place.y
  }
  let playerEls = []
  let enemyEls = []
  let genBackEls = env => env.backEls.map( (elid, i)=> {
    if(elid < 0) return h('div');

    let pt = pos.b[i]
    let item =  objects.get(env.backEls[elid], true)
    let el = h('div', { className:'pix obj popup', left: pt[0]+'em', top: (pt[1] - item.size[1])+'em' }, item.el)
    el.style.animationDelay = .1*i+'s'
    return el;
  })

  const makeStage = env => [genSide(sides[env.back], 'back'), genSide(sides[env.bottom])]

  let el = h(
    'div',
    { className: 'stage'},
    makeStage(env)
  )

  //mount back els
  let backEls = genBackEls(env)
  m(backEls, gameContainer)
  mPlayers(players);

  //name
  let placeName = h('div', 'env-name centerX', objects.text(name))
  m(placeName, gameContainer)

  //transition overlays
  let overlay = h('div', 'env-overlay fadeInOut')
  overlay.hide()

  let overlayDmg = h('div', 'env-overlay hp fadeInOut')
  overlayDmg.hide()

  m([overlay, overlayDmg], gameContainer)

  function mPlayers(players, enemy = false){
    players.forEach( (player, i)=>{
      let $player = person(player.info, player.status.items, enemy)
      $player.scale(80)
      $player.changePos(pos.m[i + (enemy ? 3: 0)])
      $player.__id = player.id

      if(enemy){
        enemyEls.push($player)
      }else{
        playerEls.push($player)
      }

    })
    if(enemy){
      m(enemyEls.map(p=>p.el), gameContainer)
    }else{
      m(playerEls.map(p=>p.el), gameContainer)
    }

  }

  function changePlayers(players){
    //lobby
    //remove players
    playerEls.forEach((p,i)=>{
      gameContainer.removeChild(p.el)
    })

    playerEls = [];
    //add players
    mPlayers(players)
  }

  function changeStage(game, player){

      console.log('change stage', loc, player.status.place.env)
      if(player.status.place.x !== loc.x || player.status.place.y !== loc.y){
        overlay.show()
        setTimeout(()=>overlay.hide(), 1000)
        loc = Object.assign({},{x:player.status.place.x, y: player.status.place.y})
        //in game
        el.empty()
        el.$m(makeStage(player.status.place.env))

        //change name
        placeName.empty()
        placeName.$m(objects.text(player.status.place.name))

        //els
        backEls.forEach(bEl=>gameContainer.removeChild(bEl))
        backEls = genBackEls(player.status.place.env)
        m(backEls, gameContainer)
      }

      enemyEls.forEach((p,i)=>{
        gameContainer.removeChild(p.el)
      })

      enemyEls = [];
      mPlayers(player.status.place.monsters, true)


  }

  function atk(id){
    playerEls.forEach((p,i)=>{
      if(p.__id === id) p.atk()
    })
    enemyEls.forEach((p,i)=>{
      if(p.__id === id) p.atk(true)
    })
  }


  //change character
  return {
    el,
    changePlayers,
    changeStage,
    hurt: ()=>{
      overlayDmg.show()
      setTimeout(()=>overlayDmg.hide(), 1000)
    },
    atk
  };
}

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
    this.targetOpen = false
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
      p$1( next=> m(
        ui.ask(
          'your name',
          name => this.emit('updateInfo', {name}, ()=>next()) ),
          this.container
        )
      ),
      //skin
      p$1( next=> m(
        ui.pick(
          'skin',
          skins.map( s=> h('div', { className:'opt-color', background: s})),
          skin => this.emit('updateInfo', {skin}),
          skin => this.emit('updateInfo', {skin}, ()=>next()) ),
          this.container
        )
      ),
      //hair
      p$1( next=> m(
        ui.pick(
          'hair',
          hairs.map( s=> h('div', {className:'opt-color', background: s})),
          hair => this.emit('updateInfo', {hair}),
          hair => this.emit('updateInfo', {hair}, ()=>next()) ),
          this.container
        )
      ),
      //open games
      p$1(
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
      this.game.lobby, //env
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
      let _attrs = attrs.by ? attrs.attrs : attrs
      if(attrs.by){
        this.stage.atk(attrs.by)
      }
      this.controls.statusBox.empty()
      if(_attrs.hp < this.player.status.attrs.hp) this.stage.hurt()
      this.player.status.attrs = _attrs
      m(updateAttr(), this.controls.statusBox)
    })
  }

  renderActions(){
    this.controls.actionBox.empty()
    ui.removeAll('ui dialog')

    //function action map
    let btnMap = ui.button('map')
    this.map = ui.map(this.game.map, this.player.status.loc, this.game.boss)

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
        'items',
        this.itemOpen ? ' ' : false
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

    //functional action attacks

    const updateAtk = () => {
      if(!this.player.status.place) return;
      //get all monsters
      //get all players beside current
      this.targetable = this.player.status.place.monsters

      let el = ui.pick(
        'Chose Target',
        this.targetable.map( target=> {
          let str = `${target.info.name}: ${target.status.attrs.hp}/100`
          let el = h('div', {className:'opt-item'}, str)
          return el;
        }),
        i => this.emit('gameaction', {
          id: 'atk',
          loc: this.player.status.loc,
          mid: i
        }),
        ()=> this.targetOpen = false,
        'items',
        this.targetOpen ? ' ' : false
      )

      m(el)
      if(this.targetEl){
        this.targetEl.parentNode.removeChild(this.targetEl)
        this.targetEl = el;
      }else{
        this.targetEl = el;
      }
      if(!this.targetOpen) this.targetEl.hide()
    }


    let btnAtk = ui.button('attack')
    btnAtk.click(()=>{
      this.targetOpen = true;
      this.targetEl.show()
    })

    this.socket.on('updatePlace', place=>{
      console.log('update place', place)
      this.player.status.place = place
      updateAtk()
      this.stage.changeStage(this.game, this.player)
    })

    const updateBtns = (acts = []) => {
      //console.log('actions', acts)
      this.controls.actionBox.empty()
      const fnAct = {
        'map': btnMap,
        'atk': () => {
          updateAtk()
          return btnAtk
        }
      }

      m(acts.map( act=>{
        if(act in fnAct){
          if(typeof fnAct[act] === 'function') return fnAct[act]()
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

}());

//# sourceMappingURL=main.js.map
