import {green,grounds} from './colors';

export const areas = [
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
