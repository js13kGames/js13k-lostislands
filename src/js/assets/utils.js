export function prefix(el, property, value){
  let p = ['', '-webkit-', '-moz-', '-ms-', '-o-']
  p.forEach( _p => el.style[property] = _p+value)
}

export const centerEl = (el, w, h, u='px') => {
  el.style.left="50%"
  el.style.top="50%"
  el.style.marginLeft = `-${w/2 + u}`
  el.style.marginTop = `-${h/2 + u}`
}

export const transform = (e, sx=1,sy=1, tx=0, ty=0, r=0) => e.style.transform = `rotate(${r}deg) scale(${sx}, ${sy}) translate(${tx}em, ${ty}em) translateZ(1000px)`

export const random = arr => arr[Math.floor(Math.random()*arr.length)];

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

export function waterfall(list) {
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
export const p = func => () => new Promise( res=> func(res))
