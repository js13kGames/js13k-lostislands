
import Area from './area';
import Place from './place';

class Map {
  constructor(size = 64, boss){
    this.boss = boss;
    this.map = null;
    this.map_size = size
    this.areas = []
    this.places = []
    this.types = {}
  }

  generate(){
    this.map = []

    //console.log('world-init maps')
    for (let x = 0; x < this.map_size; x++) {
      this.map[x] = []
      for( let y = 0; y < this.map_size; y++) {
        this.map[x][y] = 0;
      }
    }

    let room_count = getRandom(10, 30);

    //console.log('world-creating areas')
    for(let i = 0; i < room_count; i++){
      let area = new Area(this.map_size)

      if(this.isCollide(area)) {
        i--;
        continue;
      }

      area.w--;
      area.h--;

      this.areas.push(area);
    }

    //console.log('world-squash areas')
    //this.squashRooms();

    //find path
    //console.log('world-make paths')
    this.areas.forEach( areaA => {
      let areaB = this.closestRoom(areaA)
      //console.log('world-pass close area', areaB)
      let ptA = areaA.getRndPt()
      let ptB = areaB.getRndPt()
      //console.log( 'rd pts', ptA, ptB)
      while( (ptB.x != ptA.x) || (ptB.y != ptA.y) ){
          if(ptB.x != ptA.x){
            if (ptB.x > ptA.x) ptB.x--
            else ptB.x++
          }else if(ptB.y != ptA.y){
            if(ptB.y > ptA.y) ptB.y--
            else ptB.y++
          }

          this.map[ptB.x][ptB.y] = 1;
      }
    })

    //console.log('world-fill rooms')
    //set room to 1
    this.areas.forEach( area=>{
      for(let x = area.x; x < area.r(); x++) {
        for(let y = area.y; y < area.b(); y++) {
          this.map[x][y] = area.id;
        }
      }
    })

    //console.log('world-build sand')
    //make america great again
    for( let x = 0; x < this.map_size; x++){
      for( let y = 0; y < this.map_size; y++){
        if(this.map[x][y] == 1){
          for( let _x = x-1; _x <=x + 1; _x++){
            for( let _y = y-1; _y<=y+1; _y++){
              if(this.map[_x][_y] == 0) this.map[_x][_y] = 2
            }
          }
        }
      }
    }

    //generate places
    for (let x = 0; x < this.map_size; x++) {
      this.places[x] = []
      for( let y = 0; y < this.map_size; y++) {
        this.places[x][y] = new Place(MAPS.areas[this.map[x][y]], null, x, y, this.boss);
        if(!this.types[this.map[x][y]]){
          this.types[this.map[x][y]] = [this.places[x][y]]
        }else{
          this.types[this.map[x][y]].push(this.places[x][y])
        }
      }
    }
  }

  closestRoom(area) {
    let ptM = area.mid()

    let closet = null;
    let closetDst = 1000;

    this.areas.forEach( _area => {
      if(_area == area) return;
      let checkPtM = _area.mid();
      let dst = Math.abs(ptM.x - checkPtM.x) + Math.abs(ptM.y - checkPtM.y)
      if(dst < closetDst) {
        closetDst = dst
        closet = _area
      }
    })

    return closet
  }

  // squashRooms(){
  //   for(let i = 0; i < 10; i++) {
  //     this.areas.forEach( (area, j)=>{
  //       while(true){
  //         let ptOld = {
  //           x: area.x,
  //           y: area.y
  //         }
  //         if( area.x > 1) area.x--;
  //         if( area.y > 1) area.y--;
  //         if( (area.x == 1) && (area.y ==1) ) break;
  //         if( this.isCollide(area, j) ) {
  //           area.x = ptOld.x
  //           area.y = ptOld.y
  //           break;
  //         }
  //       }
  //     })
  //   }
  // }

  isCollide(area, ignore){
    for(let i = 0; i < this.areas.length; i++){
      if( i == ignore) continue;
      let check = this.areas[i]

      if(!(
        (area.r() < check.x) ||
        (area.x > check.b()) ||
        (area.b() < check.y) ||
        (area.y > check.r())
      )) return true;
    }

    return false;
  }
}

export default Map
