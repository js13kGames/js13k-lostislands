//stage boundry
export const s = {
  t: 42,
  l: 15
}

//spawn position in the map
export const pos = {
  //back
  b:[1,2,3,4,5].map(i=>[i*(s.l)+(i-1)*(i==1?0:5), s.t]),
  m:[1,2,3,4,5,6].map(i=>[i*10+(i-1)*(i==1?0:10), 50]),
  f:[1,2,3,4,5,6].map(i=>[i*10+(i-1)*(i==1?0:10), 70]),
}
