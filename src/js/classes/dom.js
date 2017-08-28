//mount function
export const m = (el, p = document.body) => Array.isArray(el) ? el.forEach( _el=>m(_el, p)): p.appendChild(el);

//dom manimulpating
export const h = (type, props = {}, ...children) => {
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

export const d = (hex, color= '#080', l=0,t=0, s=8, shadow = false, cs = -.05) => {
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
