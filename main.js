'use strict';

import {
  handleAutoLogin,
  getLocation,
  drawMap,
  setNearestRestaurant
} from "./functions.js";
import {setEventHandlers} from './eventhandlers.js';
import {getRestaurants} from './api.js';
import restaurantsPlaceholder from "./placeholder.js";

//aseta event handlerit
setEventHandlers();

//tarkista onko tokenia
handleAutoLogin();

//tarkista sijainti
let userLocation = getLocation();
console.log(userLocation);

//hae ravintolat
let restaurants = restaurantsPlaceholder;
restaurants = getRestaurants();

//odota sijaintia ja ravintoloita, sitten piirrä kartta
Promise.all([userLocation, restaurants])
  .then(([ul, r]) => {
    drawMap(ul, r)
  });

//lataa lähin ravintola jos sijainti on tiedossa
if (!userLocation === null) {
  setNearestRestaurant(userLocation);
}

