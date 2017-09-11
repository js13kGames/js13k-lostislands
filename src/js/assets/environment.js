import { h,m } from '../classes/dom.js';
import { prefix, random } from './utils.js';
import { pos } from '../constant';
import { person } from './characters';
import objects from './object';

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

export const genSide = (setting, className= 'bottom') => {
    let floor = h('div', { className } )
    floor.style.backgroundColor = setting.color
    prefix(floor, 'backgroundImage', patterns[setting.pattern](setting.opt))
    floor.style.backgroundSize = setting.size
    return floor;
}

export const stage = (place, gameContainer, players, name ="") => {
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
