import Character from './character';
import Item from './item';
 class Monster extends Character {
  constructor(epv = 10, type = 0){
    //type 0 orc
    super({
      info:{
        name: 'Monster',
        skin: 5,
        hair: 4
      }
    }, 0, uuid(), 'monster')

    this.status.items.push(new Item('hemlet', 0, epv), new Item('armor', 0, epv))
    if(epv > 10) this.status.items.push(random([new Item('axe', 0, epv), new Item('sword', 0, epv)]))

    this.status.items.forEach(i=>{
      if(typeof i !== 'string') i.eq = true
    })

    this.status.attrs.hp = epv * 2
  }
}

export default Monster;
