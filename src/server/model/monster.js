import Character from './character';
 class Monster extends Character {
  constructor(epv = 10, type = 0){
    //type 0 orc
    super({
      info:{
        name: 'Monster',
        skin: 5,
        hair: 4
      }
    })

    this.status.items.forEach(i=>{
      if(typeof i !== 'string') i.eq = true
    })
  }
}

export default Monster;
