import { h, d } from '../classes/dom.js';
import { transform } from './utils';
import * as images from './spirits.js';

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

export default objects;
