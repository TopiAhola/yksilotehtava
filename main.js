'use strict';

import {
  handleAutoLogin,
  getLocation,
  drawMap,
  setNearestRestaurant, createRestElements
} from "./functions.js";
import {setEventHandlers} from './eventhandlers.js';
import {getRestaurants} from './api.js';
import restaurantsPlaceholder from "./placeholder.js";

////////////////////////////////////////////////////
//main

//aseta event handlerit
setEventHandlers();

//tarkista onko tokenia
const user = handleAutoLogin();

//navigoi navigationTarget localstoragen perusteella??

//tarkista sijainti
let userLocation = getLocation();

//hae ravintolat
let restaurants = restaurantsPlaceholder;
restaurants = getRestaurants();

//kun ravintolat saapuvat piirrä ne
restaurants.then(
  (restaurants) => {
    createRestElements(restaurants)
  }
);

//odota sijaintia ja ravintoloita, sitten piirrä kartta
Promise.all([userLocation, restaurants])
  .then(([ul, r]) => {
    drawMap(ul, r)
  });

//lataa lähin ravintola jos sijainti on tiedossa
if (!userLocation === null) {
  setNearestRestaurant(userLocation);
}

