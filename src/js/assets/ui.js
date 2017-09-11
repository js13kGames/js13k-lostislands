import { h, m } from '../classes/dom.js';
import objects from './object';

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

export default{
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
