import * as convert from 'lodash/fp/convert';
import * as lodashMap from 'lodash/fp/map';

export const map = convert(lodashMap, {cap: false});
