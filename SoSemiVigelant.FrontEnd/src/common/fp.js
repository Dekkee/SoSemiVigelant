import convert from 'lodash/fp/convert';
import mapReal from 'lodash/map';
import mapValuesReal from 'lodash/mapValues';
// конфертируем map в функиоанльный стиль с возможностью передачи в функцию key
// помимо value https://github.com/lodash/lodash/issues/2020
let map = convert('map', mapReal, { 'cap': false });
let mapValues = convert('mapValues', mapValuesReal, { 'cap': false });

export { map, mapValues };