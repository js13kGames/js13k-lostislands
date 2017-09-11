const skins = [
  //friendly
  '#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524',
  //enemy
  '#5e672f',//orge
];
const hairs = ['#FFEAAE', 'yellow', '#090806', '#B55239']
const grades = ['#9d9d9d', '#ece1d5', '#1eff00', '#0070dd', '#a335ee', '#ff8000', '#e6cc80']
const grounds = [
  '#D9D5C5', //0 sand
  '#B5874B', //1 brown
  '#60A095', //2 jungle
  '#ac0', //3 grassfloor,
  '#00b0cc', //4 river,
  'rgb(255, 232, 180)' //5 better sand
]

const green = [
  '#DDE663', //light
  '#BDCE39', //medium
  '#A4A741', //dark
]

const brown = [
  '#72422B' // medium
]

const sky = [
  '#89e9ff', //noon blue
  '#74d1e6', //after noon/monring
  '#4c91a0', //night/ early monring
  '##132529', //full night
]


var COLORS = Object.freeze({
  skins: skins,
  hairs: hairs,
  grades: grades,
  grounds: grounds,
  green: green,
  brown: brown,
  sky: sky
});

const areas = [
  /* properties
    0 id
    1 name
    2 min_size
    3 max_size
    4 color
    5 monsters
    6 loot
    7 environment
      7.0 back
      7.1 bottom
      7.2 back objects
      7.3 front objects
  */
  [
    0,
    'water',
    5,
    15,
    'blue',
    [-1, -1, -1, 10, 20, 30, 40,50],
    [],
    [
      [2],
      [4],
      [-1],
      []
    ]
  ],
  [
    1,
    'path',
    5,
    15,
    'green',
    [-1, -1, -1, 10, 10, 20],
    [],
    [
      [2],
      [0],
      [-1],
      []
    ]
  ],
  [
    2,
    'sand',
    5,
    15,
    '#EDC9AF',
    [5, 5, 5, 10, 10, 20],
    [],
    [
      [2],
      [3],
      [-1],
      []
    ]
  ],
  [
    3,
    'forest',
    5,
    15,
    green[2],
    [-1, 10, 10, 10, 10, 30, 40, 50, 60],
    [],
    [
      [2],
      [0],
      [0],
      []
    ]
  ],
  [
    4,
    'desert',
    10,
    20,
    grounds[0],
    [-1, 10, 10, 10, 20, 30, 40, 50,60],
    [],
    [
      [2],
      [3],
      [-1],
      []
    ]
  ],
  [
    5,
    'river',
    4,
    5,
    grounds[4],
    [-1, -1, -1, 30, 40, 60],
    [],
    [
      [2],
      [1],
      [-1],
      []
    ]
  ]
]


var MAPS = Object.freeze({
  areas: areas
});

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

const data = [
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


var OBJS = Object.freeze({
  data: data
});

const data$1 = {
  hemlet:  {
    obj: 1, // 1 - 7
    attrs: {
      def: 2
    },
    factor: 1,
    pos: 1// 1 head 2 body 3 hand
  },
  armor:  {
    obj: 8, // 8-14
    attrs: {
      def: 2
    },
    factor: 1,
    pos: 2// 1 head 2 body 3 hand
  },
  sword:  {
    obj: 15, // 15-21
    attrs: {
      atk: 2
    },
    factor: 1,
    pos: 3// 1 head 2 body 3 hand
  },
  axe:  {
    obj: 22, // 15-21
    attrs: {
      atk: 4,
      spd: -1
    },
    factor: 1.5,
    pos: 3// 1 head 2 body 3 hand
  }
}


var ITEMS = Object.freeze({
  data: data$1
});

const getRandom = (l, h) =>  ~~(Math.random() * (h - l)) + l;
const random = (arr, l=0) => arr[~~(Math.random()*(arr.length-l)+l)];
const uuid = a => a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)


var UTILS = Object.freeze({
	getRandom: getRandom,
	random: random,
	uuid: uuid
});

const stories = [
  'Warriors! We have to find the dark general and kill him!'
]

var DATA = {
  COLORS,
  MAPS,
  OBJS,
  ITEMS,
  UTILS,
  stories,
  noop: ()=>null
}

if(typeof window == 'undefined') module.exports = DATA
else {
   window.DATA = DATA
   window.noop = DATA.noop
}

//# sourceMappingURL=shared.js.map
