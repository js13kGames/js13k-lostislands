import { green, brown, grades } from './colors';

const gears = [
  //head
  [
    [
      //hemlet 1-7
      8,8,
      [
        ['hemlet']
      ],
      1,1,4,-3
    ]
  ],
  //body
  [
    [
      //hemlet 8-14
      11,8,
      [
        ['armor']
      ],
      1.5,1.5,2.1,4.5
    ]
  ],
  //hand
  [
    [
      //hemlet 15-21
      11,8,
      [
        ['sword']
      ],
      1,
      1.5,
      14,-4,45
    ],
    [
      //hemlet 22-28
      11,8,
      [
        ['axe']
      ],
      1,
      1.5,
      14,-4,45
    ],
  ],
]

export const data = [
  //height, width, assets, sx, sy, tx, ty, rotate
  //assets: [name, color, left, top, sx, sy, tx, ty]
  [
    //0: tree
    18,
    9,
    [
      ['triangle',green, 0,0 ],
      ['triangle',green, 0,3, 1.2, 1.2, -.5],
      ['triangle',green, 0,6, 1.4, 1.4, -.7],
      ['rect', brown[0], 2, 10],
      ['rect', brown[0], 2, 14],
    ],
    2,
    2
  ]
]

gears.forEach(part=> {
  part.forEach(h=>{
    grades.forEach(c=>{
      data.push([
        h[0], h[1],
        h[2].map(p=>[p[0], c, p[1],p[2],p[3],p[4]]),
        h[3], h[4], h[5], h[6], h[7]
      ])
    })
  })
})
