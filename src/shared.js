import  * as COLORS   from './data/colors.js';
import  * as MAPS   from './data/map';
import  * as OBJS   from './data/objects';
import  * as ITEMS from './data/items';
import  * as UTILS from './data/utils';
import  { stories } from './data/langs';

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
