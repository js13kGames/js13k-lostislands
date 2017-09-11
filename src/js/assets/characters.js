import * as images from './spirits.js';
import objects from './object';
import { h, d, m } from '../classes/dom.js';
import ui from './ui';

const { skins, hairs } = DATA.COLORS;
const width = 13
const height = 31
const genSkin = (s, _h, items = []) => {
  const body = h('div', 'pix upAndDown',
    d(images.bodyleft, skins[s], 0, 5.5, 8, true),
    d(images.bodyright, skins[s], 5, 5.5),
    items.filter(i=>i.pos===2 || i.pos === 3).map(i=>i.el)
  )

  const leg = h('div', {},
    d(images.legleft, skins[s], 0, 18, 8, true),
    d(images.legright, skins[s], 4, 18)
  )

  const head = h('div', 'pix upAndDown',
    d(images.head, skins[s], 4),
    d(images.hair2, hairs[_h], 4, -3, 8),
    items.filter(i=>i.pos===1).map(i=>i.el)
  )

  return [head, leg, body]
}

export const person = (info, items = [], rev = false) => {

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
