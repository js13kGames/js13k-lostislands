
class Area {
  constructor(map_size){
    let area = random(MAPS.areas, 3)
    this.id = area[0]
    this.x= getRandom(1, map_size - area[3] - 1)
    this.y= getRandom(1, map_size - area[3] - 1)
    this.w= getRandom(area[2], area[3])
    this.h= getRandom(area[2], area[3])
  }

  getRndPt(){
    return {
      x:　getRandom(this.x, this.r()),
      y: getRandom(this.y, this.b())
    }
  }

  mid(){
    return {
      x: this.x + (this.w/2),
      y: this.y + (this.h/2)
    }
  }

  r(){
    return this.x + this.w
  }

  b(){
    return this.y + this.h
  }
}

export default Area;
