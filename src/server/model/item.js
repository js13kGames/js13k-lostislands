class Item{
    constructor(id, luk = 3, epv = 10){
      this.item = ITEMS.data[id]
      this.name = id
      this.eq = false
      this.pos = this.item.pos
      this.grade = this.getGrade(luk, epv)
      this.obj = this.item.obj + this.grade;
      this.bonus = this.item.factor * this.grade;
    }

    attr(key){
      return this.item.attrs[key] ? this.item.attrs[key] > 0 ? this.item.attrs[key] + this.bonus : this.item.attrs[key] :0
    }

    getGrade(luk, epv){
      let grade = 1;
      let min, max
      switch (true) {
        case (epv < 20):
          min = 1000;
          max = 2999;
          break;
        case (epv >= 20 && epv < 40):
          min = 2000;
          max = 4999;
          break;
        case (epv >= 40 && epv < 60):
          min = 4000;
          max = 6500;
          break;
        case (epv >= 60):
          min = 5000;
          max = 6999;
      }

      return ~~((getRandom(min, max) + (luk * 50)) / 1000) - 1;
    }
}

export default Item;
