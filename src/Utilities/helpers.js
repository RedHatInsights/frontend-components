import map from 'lodash/map';
import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';

export function mergeArraysByKey(arrays, key = 'id') {
  let mergedObject = merge(...arrays.map(row => mapKeys(row,  a => a && a[key])));
  return Object.values(mergedObject); 
}
