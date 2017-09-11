import Monster from './monster';

class Place {
  constructor(type, name, x=-1, y=-1, boss = false){
    //console.log(type)
    this.name = name || type[1]
    this.type = type || random(MAPS.areas)
    this.x = x;
    this.y = y;
    this.monsters = [] //new Monster()
    if(boss && this.x == boss.x && this.y == boss.y) {
      this.monsters.push(boss.mon)
      boss.mon.name = 'Black General'
      console.log('boss', this.x, this.y)
    }else{
      let mon = random(this.type[5])
      if(mon > -1)this.monsters.push(new Monster(mon))
    }
    this.env = {
      back: random(this.type[7][0]),
      bottom: random(this.type[7][1]),
      backEls: this.genBackEls(4)
    }
  }

  genBackEls(x){
    let objs = []

    for(let i = 0; i < x; i++){
      objs.push(random(this.type[7][2]))
    }

    return objs
  }
}

export default Place;
