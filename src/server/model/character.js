import Item from './item';
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

export default Character;
